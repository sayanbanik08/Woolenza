'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { states, cities } from "@/data/locations";

const AddAddress = () => {

    const { getToken, router } = useAppContext();

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!address.fullName || !address.phoneNumber || !address.pincode || !address.area || !address.city || !address.state) {
            toast.error('All fields are required');
            return;
        }

        // Validate phone number (10 digits)
        if (!/^\d{10}$/.test(address.phoneNumber)) {
            toast.error('Phone number must be exactly 10 digits');
            return;
        }

        // Validate pincode (6 digits)
        if (!/^\d{6}$/.test(address.pincode)) {
            toast.error('Pin code must be exactly 6 digits');
            return;
        }

        try {
            const token = await getToken();
            const { data } = await axios.post('/api/user/add-address', { address }, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                toast.success(data.message);
                router.push('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto">
                <form onSubmit={onSubmitHandler} className="w-full flex flex-col items-center md:items-start">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Add Shipping <span className="font-semibold text-orange-600">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Full name"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                            required
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="tel"
                            placeholder="Phone number (10 digits)"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setAddress({ ...address, phoneNumber: value });
                            }}
                            value={address.phoneNumber}
                            maxLength={10}
                            required
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Pin code (6 digits)"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setAddress({ ...address, pincode: value });
                            }}
                            value={address.pincode}
                            maxLength={6}
                            required
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            rows={4}
                            placeholder="Address (Area and Street)"
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                            required
                        ></textarea>
                        <div className="flex space-x-3">
                            <select
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                                required
                            >
                                <option value="">Select City/District/Town</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <select
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                                required
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase">
                        Save address
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;