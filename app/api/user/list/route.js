import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        await connectDB();
        const users = await User.find({});
        
        return NextResponse.json({ success: true, users });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}