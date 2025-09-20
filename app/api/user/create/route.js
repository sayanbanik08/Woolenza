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
        
        const { name, email, imageUrl } = await request.json();
        
        if (!name || !email) {
            return NextResponse.json({ success: false, message: "Name and email are required" });
        }
        
        await connectDB();
        
        // Check if user already exists
        const existingUser = await User.findById(userId);
        if (existingUser) {
            return NextResponse.json({ success: true, user: existingUser, message: "User already exists" });
        }
        
        // Create new user
        const newUser = new User({
            _id: userId,
            name,
            email,
            imageUrl: imageUrl || "",
            cartItems: {},
            wishlist: []
        });
        
        const savedUser = await newUser.save();
        console.log('New user created:', savedUser._id);
        
        return NextResponse.json({ 
            success: true, 
            user: savedUser,
            message: "User created successfully" 
        });
        
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}