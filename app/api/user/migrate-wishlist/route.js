import connectDB from "@/config/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        
        // Update all users that don't have wishlist field
        const result = await User.updateMany(
            { wishlist: { $exists: false } },
            { $set: { wishlist: [] } }
        );
        
        console.log('Migration result:', result);
        
        return NextResponse.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} users with wishlist field`,
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}