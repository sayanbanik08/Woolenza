'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);


    const fetchSellerOrders = async () => {

        try {

            const token = await getToken();
            const { data } = await axios.get('/api/order/seller-orders', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setOrders(data.orders);
                setFilteredOrders(data.orders);
                setLoading(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteOrder = async (orderId) => {
        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/order/delete?id=${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                toast.success(data.message);
                const updatedOrders = orders.filter(order => order._id !== orderId);
                setOrders(updatedOrders);
                setFilteredOrders(updatedOrders.filter(order => {
                    const searchLower = searchTerm.toLowerCase();
                    if (!searchLower) return true;
                    const orderDate = new Date(order.date).toLocaleDateString().toLowerCase();
                    const productNames = order.items.map(item => item.product?.name || '').join(' ').toLowerCase();
                    const customerName = order.userId?.name?.toLowerCase() || '';
                    const customerEmail = order.userId?.email?.toLowerCase() || '';
                    const phoneNumber = order.address?.phoneNumber?.toLowerCase() || '';
                    const address = `${order.address?.area || ''} ${order.address?.city || ''} ${order.address?.state || ''}`.toLowerCase();
                    return productNames.includes(searchLower) || orderDate.includes(searchLower) || customerName.includes(searchLower) || customerEmail.includes(searchLower) || phoneNumber.includes(searchLower) || address.includes(searchLower);
                }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const toggleDeliveryStatus = async (orderId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Delivered' ? 'Order placed' : 'Delivered';
            const token = await getToken();
            const { data } = await axios.put('/api/order/update-status', 
                { orderId, status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(`Order marked as ${newStatus.toLowerCase()}`);
                const updatedOrders = orders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                );
                setOrders(updatedOrders);
                filterOrders(searchTerm);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const toggleShipmentStatus = async (orderId, currentStatus) => {
        try {
            let newStatus;
            if (currentStatus === 'Under Shipment') {
                newStatus = 'Order placed'; // Cancel shipment
            } else {
                newStatus = 'Under Shipment'; // Start shipment
            }
            
            const token = await getToken();
            const { data } = await axios.put('/api/order/update-status', 
                { orderId, status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(`Order marked as ${newStatus.toLowerCase()}`);
                const updatedOrders = orders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                );
                setOrders(updatedOrders);
                filterOrders(searchTerm);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }



    const filterOrders = (searchValue) => {
        if (!searchValue.trim()) {
            setFilteredOrders(orders);
            return;
        }
        
        const filtered = orders.filter(order => {
            const searchLower = searchValue.toLowerCase();
            const orderDate = new Date(order.date).toLocaleDateString().toLowerCase();
            const productNames = order.items.map(item => item.product?.name || '').join(' ').toLowerCase();
            const customerName = order.userId?.name?.toLowerCase() || '';
            const customerEmail = order.userId?.email?.toLowerCase() || '';
            const phoneNumber = order.address?.phoneNumber?.toLowerCase() || '';
            const address = `${order.address?.area || ''} ${order.address?.city || ''} ${order.address?.state || ''}`.toLowerCase();
            
            return productNames.includes(searchLower) ||
                   orderDate.includes(searchLower) ||
                   customerName.includes(searchLower) ||
                   customerEmail.includes(searchLower) ||
                   phoneNumber.includes(searchLower) ||
                   address.includes(searchLower);
        });
        
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }
    }, [user]);

    useEffect(() => {
        filterOrders(searchTerm);
    }, [searchTerm, orders]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search orders by product name, date, customer name, email, phone, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="max-w-4xl rounded-md">
                    {filteredOrders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className={`flex flex-col md:flex-row gap-5 justify-between flex-1 ${
                                order.status === 'Under Shipment' ? 'opacity-50' : ''
                            }`}>
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium">
                                            {order.items.map((item) => item.product?.name ? item.product.name + ` x ${item.quantity}` : 'Product unavailable').join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address.fullName}</span>
                                        <br />
                                        <span >{order.address.area}</span>
                                        <br />
                                        <span>{`${order.address.city}, ${order.address.state}`}</span>
                                        <br />
                                        <span>{order.address.phoneNumber}</span>
                                        <br />
                                        <span>Customer : {order.userId?.name || 'N/A'}</span>
                                        <br />
                                        <span>Email : {order.userId?.email || 'N/A'}</span>
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{order.amount}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : COD</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => toggleDeliveryStatus(order._id, order.status)}
                                    className={`px-4 py-2 rounded text-sm h-fit ${
                                        order.status === 'Delivered' 
                                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                                >
                                    {order.status === 'Delivered' ? 'Delivered' : 'Undelivered'}
                                </button>

                                <button 
                                    onClick={() => toggleShipmentStatus(order._id, order.status)}
                                    className={`px-4 py-2 rounded text-sm h-fit ${
                                        order.status === 'Under Shipment' 
                                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {order.status === 'Under Shipment' ? 'Under Shipment' : 'Ship'}
                                </button>

                                <button 
                                    onClick={() => deleteOrder(order._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm h-fit"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;