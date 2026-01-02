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
        const baseColor = formData.get('baseColor');
        const description = formData.get('description');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const category = formData.get('category');
        const files = formData.getAll('images');
        const existingImages = JSON.parse(formData.get('existingImages') || '[]');
        const coloredProductsJson = formData.get('coloredProducts');
        const coloredProductsData = coloredProductsJson ? JSON.parse(coloredProductsJson) : [];
        const existingColoredProductsJson = formData.get('existingColoredProducts');
        const existingColoredProductsData = existingColoredProductsJson ? JSON.parse(existingColoredProductsJson) : [];
        
        // Get all colored images from formData
        const allFormDataKeys = Array.from(formData.keys());
        const coloredImageKeys = allFormDataKeys.filter(key => key.startsWith('coloredImage-'));
        const existingColoredImageKeys = allFormDataKeys.filter(key => key.startsWith('existingColoredImage-'));
        
        // Group colored images by product index
        const coloredImageMap = {};
        coloredImageKeys.forEach(key => {
          const [_, prodIdx, imgIdx] = key.split('-');
          if (!coloredImageMap[prodIdx]) coloredImageMap[prodIdx] = [];
          coloredImageMap[prodIdx][imgIdx] = formData.get(key);
        });

        // Group existing colored images by product index
        const existingColoredImageMap = {};
        existingColoredImageKeys.forEach(key => {
          const parts = key.split('-');
          const prodIdx = parts[1];
          const imgIdx = parts[2];
          if (!existingColoredImageMap[prodIdx]) existingColoredImageMap[prodIdx] = [];
          existingColoredImageMap[prodIdx][imgIdx] = formData.get(key);
        });

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
                baseColor,
                description,
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                image: finalImages,
            },
            { new: true }
        );

        // Update existing colored products
        const updatedColoredProducts = [];
        if (existingColoredProductsData && existingColoredProductsData.length > 0) {
            for (let i = 0; i < existingColoredProductsData.length; i++) {
                const coloredProduct = existingColoredProductsData[i];
                let finalColoredImages = [...(coloredProduct.existingImages || [])];

                // Upload new images if any
                if (existingColoredImageMap[i] && existingColoredImageMap[i].length > 0) {
                    const uploadResults = await Promise.all(
                        existingColoredImageMap[i].filter(f => f !== undefined).map(async (imgFile) => {
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
                    finalColoredImages = [...finalColoredImages, ...uploadResults.map(r => r.secure_url)];
                }

                const updatedColored = await Product.findByIdAndUpdate(
                    coloredProduct.productId,
                    {
                        shade: {
                            name: coloredProduct.shades || '',
                            thumbnail: finalColoredImages.length > 0 ? finalColoredImages[0] : finalImages[0]
                        },
                        shadeDescription: coloredProduct.description || '',
                        image: finalColoredImages
                    },
                    { new: true }
                );
                updatedColoredProducts.push(updatedColored);
            }
        }

        // Create new colored products if any
        const createdColoredProducts = [];
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
                    image: coloredImages.length > 0 ? coloredImages : finalImages,
                    shade: {
                        name: coloredProduct.shades || '',
                        thumbnail: coloredImages.length > 0 ? coloredImages[0] : finalImages[0]
                    },
                    shadeDescription: coloredProduct.description || '',
                    date: Date.now()
                });
                createdColoredProducts.push(newProduct);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Product updated successfully', 
            product: updatedProduct,
            updatedColoredProducts,
            createdColoredProducts
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}