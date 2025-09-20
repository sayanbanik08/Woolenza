import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        await connectDB();
        
        // Use findOneAndUpdate to ensure wishlist field exists
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $setOnInsert: { wishlist: [] } },
            { upsert: false, new: true }
        );
        
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        
        // Force add wishlist if still missing
        if (!user.wishlist) {
            await User.updateOne({ _id: userId }, { $set: { wishlist: [] } });
            user.wishlist = [];
        }
        
        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}