'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Control = () => {
    const { getToken, user, setIsLoading } = useAppContext();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedUserCart, setSelectedUserCart] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/list', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log('Error fetching products');
        }
    }

    const clearUserCart = async (userId) => {
        setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUsers();
            fetchProducts();
            setLoading(false);
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {/* Image Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div 
                        className="bg-white rounded-lg p-4 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <Image
                                className="w-full h-auto rounded-lg object-cover"
                                src={selectedImage}
                                alt="enlarged_user_photo"
                                width={400}
                                height={400}
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Items Modal */}
            {selectedUserCart && (
                <div 
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedUserCart(null)}
                >
                    <div 
                        className="bg-white p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{selectedUserCart.name}'s Cart Items</h3>
                            <button
                                onClick={() => setSelectedUserCart(null)}
                                className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {Object.keys(selectedUserCart.cartItems || {}).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No items in cart</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="flex gap-3 pb-2">
                                    {Object.entries(selectedUserCart.cartItems).map(([productId, quantity]) => {
                                        const product = products.find(p => p._id?.toString() === productId?.toString());
                                        const imageUrl = product?.image?.[0];
                                        return (
                                            <div key={productId} className="flex items-center gap-3 p-3 border border-gray-200 flex-shrink-0 min-w-max">
                                                {imageUrl && imageUrl !== '' ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt="product"
                                                        width={60}
                                                        height={60}
                                                        className="w-16 h-16 object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <p className="font-medium text-sm whitespace-nowrap">{product?.name || 'Product'}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium whitespace-nowrap">
                                                        Qty: {quantity}
                                                    </span>
                                                    <a
                                                        href={`https://woolenza.in/product/${productId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 transition"
                                                        title="View product"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                                        className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                                        src={userData.imageUrl || '/default-avatar.png'}
                                        alt="user_photo"
                                        width={64}
                                        height={64}
                                        onClick={() => setSelectedImage(userData.imageUrl || '/default-avatar.png')}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <span className="font-medium text-base">{userData.name}</span>
                                        <span className="text-gray-600">{userData.email}</span>
                                        <span className="text-gray-600">{userData.phoneNumber}</span>
                                        <span className="text-sm text-gray-500">
                                            Cart Items: {Object.keys(userData.cartItems || {}).length}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => setSelectedUserCart(userData)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm h-fit"
                                        disabled={Object.keys(userData.cartItems || {}).length === 0}
                                    >
                                        View Cart
                                    </button>
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