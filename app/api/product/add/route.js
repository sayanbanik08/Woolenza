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

export async function POST(request) {
    try {

        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' });
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const baseColor = formData.get('baseColor');
        const description = formData.get('description');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const category = formData.get('category');
        const files = formData.getAll('images');
        const coloredProductsJson = formData.get('coloredProducts');
        const coloredProductsData = coloredProductsJson ? JSON.parse(coloredProductsJson) : [];
        
        // Get all colored images from formData
        const allFormDataKeys = Array.from(formData.keys());
        const coloredImageKeys = allFormDataKeys.filter(key => key.startsWith('coloredImage-'));
        
        // Group colored images by product index
        const coloredImageMap = {};
        coloredImageKeys.forEach(key => {
          const [_, prodIdx, imgIdx] = key.split('-');
          if (!coloredImageMap[prodIdx]) coloredImageMap[prodIdx] = [];
          coloredImageMap[prodIdx][imgIdx] = formData.get(key);
        });

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'no files uploaded' });
        }

        const result = await Promise.all(
            files.map(async (files) => {
                const arrayBuffer = await files.arrayBuffer();
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
        )

        const image = result.map(result => result.secure_url);
        await connectDB();
        
        const products = [];

        // Always create the base product first
        const baseProduct = await Product.create({
            userId,
            name,
            baseColor,       
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            shippingFee: 0,
            image,
            date: Date.now()
        });
        products.push(baseProduct);

        // Create a product for each colored variant
        if (coloredProductsData && coloredProductsData.length > 0) {
            for (let i = 0; i < coloredProductsData.length; i++) {
                const coloredProduct = coloredProductsData[i];
                
                // Upload colored product images if they exist
                let coloredImages = [];
                if (coloredImageMap[i] && coloredImageMap[i].length > 0) {
                    const uploadResults = await Promise.all(
                        coloredImageMap[i].filter(f => f !== undefined).map(async (imgFile) => {
                            const arrayBuffer = await imgFile.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);

                            return new Promise((resolve, reject) => {
                                const stream = cloudinary.uploader.upload_stream(
                                    { resource_type: 'auto' },
                                    (error, result) => {
                                        if (error) reject(error);
                                        else resolve(result);
                                    }
                                );
                                stream.end(buffer);
                            });
                        })
                    );
                    coloredImages = uploadResults.map(r => r.secure_url);
                }

                const newProduct = await Product.create({
                    userId,
                    name,
                    baseColor,
                    description,
                    category,
                    price: Number(price),
                    offerPrice: Number(offerPrice),
                    shippingFee: 0,
                    image: coloredImages.length > 0 ? coloredImages : image,
                    shade: {
                        name: coloredProduct.shades || '',
                        thumbnail: coloredImages.length > 0 ? coloredImages[0] : image[0]
                    },
                    shadeDescription: coloredProduct.description || '',
                    date: Date.now()
                });
                products.push(newProduct);
            }
        }

        return NextResponse.json({ success: true, message: 'Upload successful', products });


    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}