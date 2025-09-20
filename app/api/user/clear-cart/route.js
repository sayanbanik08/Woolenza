import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        await connectDB();
        
        const { userId: targetUserId } = await request.json();
        
        if (!targetUserId) {
            return NextResponse.json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(targetUserId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        user.cartItems = {};
        await user.save();
        
        return NextResponse.json({ success: true, message: "User cart cleared successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}