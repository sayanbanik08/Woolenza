import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({ success: false, message: 'Product ID required' });
        }

        await connectDB();
        
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        await Product.findByIdAndDelete(productId);
        
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}