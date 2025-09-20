import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        await connectDB();
        
        const { orderId, status } = await request.json();
        
        if (!orderId || !status) {
            return NextResponse.json({ success: false, message: "Order ID and status are required" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        
        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Order not found" });
        }

        return NextResponse.json({ success: true, message: "Order status updated successfully", order: updatedOrder });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}