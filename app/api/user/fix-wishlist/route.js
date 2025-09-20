import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        
        await connectDB();
        
        // Find user
        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        
        // Initialize wishlist if it doesn't exist or is null
        if (!user.wishlist || !Array.isArray(user.wishlist)) {
            user.wishlist = [];
            await user.save();
            console.log('Fixed wishlist for user:', userId);
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Wishlist fixed successfully",
            wishlist: user.wishlist,
            userInfo: {
                id: user._id,
                name: user.name,
                email: user.email,
                wishlistLength: user.wishlist.length
            }
        });
        
    } catch (error) {
        console.error('Fix wishlist error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        
        await connectDB();
        
        // Get user info for debugging
        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        
        return NextResponse.json({ 
            success: true,
            userInfo: {
                id: user._id,
                name: user.name,
                email: user.email,
                wishlist: user.wishlist,
                wishlistLength: user.wishlist ? user.wishlist.length : 0,
                cartItems: user.cartItems
            }
        });
        
    } catch (error) {
        console.error('Get user debug info error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}