import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();

        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // calculate subtotal using items (avoid async reduce pitfalls)
        let subtotal = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({ success: false, message: `Product not found: ${item.product}` });
            }
            subtotal += product.offerPrice * item.quantity;
        }
        // round to 2 decimals
        subtotal = Math.round(subtotal * 100) / 100;
        const tax = Math.round(subtotal * 0.02 * 100) / 100; // 2%
        const total = Math.round((subtotal + tax) * 100) / 100;

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                subtotal,
                tax,
                total,
                amount: total,
                date: Date.now()
            }
        })

        //  clear user's cart
        const user = await User.findById(userId);
        user.cart = {};
        await user.save();
        return NextResponse.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}