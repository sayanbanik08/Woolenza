import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

// Configure Cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized - seller check failed' });
        }

        const formData = await request.formData();
        const productId = formData.get('productId');
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const category = formData.get('category');
        const files = formData.getAll('images');
        const existingImages = JSON.parse(formData.get('existingImages') || '[]');

        await connectDB();

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        let finalImages = [...existingImages];

        // Upload new images if any
        if (files && files.length > 0 && files[0].size > 0) {
            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                })
            );
            
            const newImageUrls = uploadResults.map(result => result.secure_url);
            finalImages = [...finalImages, ...newImageUrls];
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                image: finalImages,
            },
            { new: true }
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}