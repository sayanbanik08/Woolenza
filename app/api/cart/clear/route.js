import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        await connectDB();
        const user = await User.findById(userId);
        
        user.cartItems = {};
        await user.save();
        
        return NextResponse.json({ success: true, message: "Cart cleared successfully" });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}