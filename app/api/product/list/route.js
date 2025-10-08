import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (id) {
            // Fetch single product by ID
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ success: false, message: 'Product not found' });
            }
            return NextResponse.json({ success: true, products: [product] });
        } else {
            // Fetch all products
            const products = await Product.find({});
            return NextResponse.json({ success: true, products });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}