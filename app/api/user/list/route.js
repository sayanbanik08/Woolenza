import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import User from "@/models/user";
import Address from "@/models/Address";
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
        
        // Get phone numbers from addresses
        const usersWithPhone = await Promise.all(users.map(async (user) => {
            const address = await Address.findOne({ userId: user._id });
            return {
                ...user.toObject(),
                phoneNumber: address?.phoneNumber || null
            };
        }));
        
        return NextResponse.json({ success: true, users: usersWithPhone });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}