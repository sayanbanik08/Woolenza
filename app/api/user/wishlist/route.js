import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        console.log('Wishlist API - userId:', userId);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        
        const { productId } = await request.json();
        
        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }
        
        await connectDB();
        
        // Find user by Clerk userId
        let user = await User.findById(userId);
        
        // If user doesn't exist, create one (this might be needed for new users)
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found. Please ensure user is created." });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }
        
        const wishlistIndex = user.wishlist.indexOf(productId);
        
        if (wishlistIndex > -1) {
            // Remove from wishlist
            user.wishlist.splice(wishlistIndex, 1);
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
        }

        // Save the user
        const savedUser = await user.save();
        
        console.log('Wishlist updated:', savedUser.wishlist); // Debug log
        
        return NextResponse.json({ 
            success: true, 
            wishlist: savedUser.wishlist,
            message: wishlistIndex > -1 ? "Removed from wishlist" : "Added to wishlist"
        });
    } catch (error) {
        console.error('Wishlist API Error:', error);
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
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({ 
            success: true, 
            wishlist: user.wishlist || [] 
        });
    } catch (error) {
        console.error('Get Wishlist API Error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}