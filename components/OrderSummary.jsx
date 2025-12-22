import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Script from "next/script";

const OrderSummary = () => {

  const { currency, router, navigateWithLoading, getCartCount, getCartAmount, getShippingFee, getTotalAmount, getToken, user, cartItems, setCartItems, setIsLoading } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {

      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handlePayment = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({ product: key, quantity: cartItems[key] }));
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);
      if (cartItemsArray.length === 0) {
        return toast.error("Your cart is empty");
      }

      setIsLoading(true);
      
      // Create Razorpay order
      const { data: orderData } = await axios.post('/api/payment/create-order', {
        amount: getTotalAmount(),
        currency: 'INR'
      });

      if (!orderData.success) {
        toast.error(orderData.message);
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Woolenza',
        description: 'Order Payment',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const { data: verifyData } = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.success) {
              // Create order after successful payment
              const token = await getToken();
              const { data } = await axios.post('/api/order/create', {
                address: selectedAddress._id,
                items: cartItemsArray,
                paymentId: response.razorpay_payment_id
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (data.success) {
                toast.success('Payment successful! Order placed.');
                setCartItems({});
                navigateWithLoading('/order-placed');
              } else {
                toast.error(data.message);
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.emailAddresses?.[0]?.emailAddress || '',
          contact: selectedAddress?.phoneNumber || ''
        },
        theme: {
          color: '#ea580c'
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      // Show better error message when axios returns a response body
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => navigateWithLoading("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">{getShippingFee() > 0 ? `${currency}${getShippingFee()}` : 'Free'}</p>
          </div>

          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getTotalAmount()}</p>
          </div>
        </div>
      </div>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button onClick={handlePayment} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;