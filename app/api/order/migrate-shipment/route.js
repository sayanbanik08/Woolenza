import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
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
        
        // Update all orders that don't have shipmentStatus field
        const result = await Order.updateMany(
            { shipmentStatus: { $exists: false } },
            { $set: { shipmentStatus: 'Under Shipment' } }
        );

        return NextResponse.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} orders with shipment status`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}