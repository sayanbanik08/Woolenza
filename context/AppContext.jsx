'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const { user } = useUser();
    const { getToken } = useAuth();
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [wishlist, setWishlist] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchProductData = async () => {
        try {

            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === 'seller') {
                setIsSeller(true)
            }

            const token = await getToken();
            console.log('Fetching user data for:', user.id); // Debug log
            
            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
            
            console.log('User data response:', data); // Debug log
            
            if (data.success) {
                setUserData(data.user)
                setCartItems(data.user.cartItems)
                setWishlist(data.user.wishlist || [])
                console.log('User wishlist loaded:', data.user.wishlist); // Debug log
            } else {
                // If user not found, try to create the user
                if (data.message === "User not found") {
                    console.log('User not found, creating new user...');
                    await createUser();
                } else {
                    console.error('Fetch user data error:', data.message);
                    toast.error(data.message)
                }
            }

        } catch (error) {
            console.error('Fetch user data error:', error);
            toast.error(error.message)
        }
    }

    const createUser = async () => {
        try {
            const token = await getToken();
            const userData = {
                name: user.fullName || user.firstName || 'User',
                email: user.emailAddresses[0]?.emailAddress || '',
                imageUrl: user.imageUrl || ''
            };
            
            console.log('Creating user with data:', userData);
            
            const { data } = await axios.post('/api/user/create', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                console.log('User created successfully');
                // Fetch user data again after creation
                await fetchUserData();
            } else {
                console.error('Create user error:', data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Create user error:', error);
            toast.error('Failed to create user account');
        }
    }

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

        if (user) {
            try {

                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success("Item added to cart")

            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user) {
            try {

                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success("Cart updated")

            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const getShippingFee = () => {
        let totalShipping = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                const shippingFee = itemInfo.shippingFee || 0;
                totalShipping += shippingFee;
            }
        }
        return Math.floor(totalShipping * 100) / 100;
    }

    const getTotalAmount = () => {
        return Math.floor((getCartAmount() + getShippingFee()) * 100) / 100;
    }

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to add to wishlist")
            return
        }

        setIsLoading(true)
        try {
            const token = await getToken();
            console.log('Toggling wishlist for product:', productId); // Debug log
            console.log('User ID:', user.id); // Debug log
            
            const { data } = await axios.post('/api/user/wishlist', { productId }, { 
                headers: { Authorization: `Bearer ${token}` } 
            })
            
            console.log('Wishlist API response:', data); // Debug log
            
            if (data.success) {
                setWishlist(data.wishlist)
                toast.success(data.message || (data.wishlist.includes(productId) ? "Added to wishlist" : "Removed from wishlist"))
            } else {
                console.error('Wishlist API error:', data.message);
                toast.error(data.message || "Failed to update wishlist")
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
            toast.error(error.response?.data?.message || error.message || "Failed to update wishlist")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        } else {
            // Clear wishlist when user logs out
            setWishlist([])
            setCartItems({})
            setUserData(false)
        }
    }, [user])

    const navigateWithLoading = (path) => {
        setIsLoading(true)
        router.push(path)
        setTimeout(() => setIsLoading(false), 800)
    }

    const value = {
        user, getToken,
        currency, router, navigateWithLoading,
        isSeller, setIsSeller,
        userData, fetchUserData, createUser,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount, getShippingFee, getTotalAmount,
        wishlist, toggleWishlist,
        showSearch, setShowSearch,
        isLoading, setIsLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}