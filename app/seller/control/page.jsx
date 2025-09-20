'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Control = () => {
    const { getToken, user } = useAppContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/list', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setUsers(data.users);
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const clearUserCart = async (userId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/user/clear-cart', 
                { userId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success('User cart cleared successfully');
                setUsers(users.map(u => 
                    u._id === userId ? { ...u, cartItems: {} } : u
                ));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : (
                <div className="md:p-10 p-4 space-y-5">
                    <h2 className="text-lg font-medium">Control Panel</h2>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium mb-2">Total Users: {users.length}</h3>
                    </div>
                    
                    <div className="max-w-6xl rounded-md">
                        <h3 className="text-md font-medium mb-4">User Management</h3>
                        {users.map((userData, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                                <div className="flex gap-5 items-center flex-1">
                                    <Image
                                        className="w-16 h-16 rounded-full object-cover"
                                        src={userData.imageUrl || '/default-avatar.png'}
                                        alt="user_photo"
                                        width={64}
                                        height={64}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <span className="font-medium text-base">{userData.name}</span>
                                        <span className="text-gray-600">{userData.email}</span>
                                        <span className="text-sm text-gray-500">
                                            Cart Items: {Object.keys(userData.cartItems || {}).length}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => clearUserCart(userData._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm h-fit"
                                        disabled={Object.keys(userData.cartItems || {}).length === 0}
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Control;