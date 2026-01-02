"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import ShadeSelector from "@/components/ShadeSelector";
import React from "react";

const Product = () => {

    const { id } = useParams();

    const { products, router, navigateWithLoading, addToCart, currency, setIsLoading } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [displayDescription, setDisplayDescription] = useState('');
    const [shadesList, setShadesList] = useState([]);
    const [selectedShade, setSelectedShade] = useState(null);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
        setMainImage(null);
        
        if (product) {
            // Set description: use shadeDescription for colored products, description for base
            const desc = product.shadeDescription && product.shadeDescription.trim() ? product.shadeDescription : product.description;
            setDisplayDescription(desc);
            
            // Get base product and all related colored products with same name, category, and price
            const baseProduct = products.find(p => p.name === product.name && p.category === product.category && p.price === product.price && !p.shade);
            
            // Get all colored variants
            const coloredVariants = products
              .filter(p => p.name === product.name && p.category === product.category && p.price === product.price && p.shade)
              .map(p => ({ 
                name: p.shade?.name || 'Default', 
                thumbnail: p.shade?.thumbnail || p.image[0],
                productId: p._id,
                product: p
              }));
            
            // Build shades list: base color first, then colored variants
            let allShades = [];
            if (baseProduct) {
                allShades.push({
                    name: baseProduct.baseColor || 'Base',
                    thumbnail: baseProduct.image[0],
                    productId: baseProduct._id,
                    product: baseProduct,
                    isBase: true
                });
            }
            allShades = [...allShades, ...coloredVariants];
            
            setShadesList(allShades);
            
            // Set selected shade based on current product
            const currentShade = allShades.find(s => s.productId === product._id) || allShades[0];
            setSelectedShade(currentShade);
        }
    }

    const handleShadeSelect = (shade) => {
        setSelectedShade(shade);
        // Find the full shade object with product info from shadesList
        const selectedShadeData = shadesList.find(s => s.name === shade.name);
        if (selectedShadeData && selectedShadeData.product) {
            // Update the displayed product immediately
            setProductData(selectedShadeData.product);
            setMainImage(null); // Reset to first image
            
            // Update description: use shadeDescription for colored products, description for base
            const desc = selectedShadeData.product.shadeDescription && selectedShadeData.product.shadeDescription.trim() ? selectedShadeData.product.shadeDescription : selectedShadeData.product.description;
            setDisplayDescription(desc);
            
            // Navigate to the new product if it's different
            if (selectedShadeData.productId !== id) {
                navigateWithLoading(`/product/${selectedShadeData.productId}`);
            }
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (<>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 flex items-center justify-center min-h-96">
                        {(mainImage || productData?.image?.[0]) ? (
                            <Image
                                src={mainImage || productData?.image?.[0]}
                                alt="alt"
                                className="w-full h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <p className="text-lg font-medium">No Image</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData?.image?.map((image, index) => (
                            image && (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 flex items-center justify-center min-h-24"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-full object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                            )
                        ))}
                        {(!productData?.image || productData.image.length === 0) && (
                            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 min-h-24 flex items-center justify-center cursor-not-allowed">
                                <div className="text-gray-500 text-xs font-medium">No Image</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>

                    <p className="text-gray-600 mt-3">
                        {displayDescription}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        {currency}{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            {currency}{productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <ShadeSelector 
                      shades={shadesList.map(s => ({ name: s.name, thumbnail: s.thumbnail }))} 
                      selectedShade={selectedShade}
                      onShadeSelect={handleShadeSelect}
                    />

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={() => { setIsLoading(true); addToCart(productData._id); setTimeout(() => setIsLoading(false), 500) }} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                            Add to Cart
                        </button>
                        <button onClick={() => { setIsLoading(true); addToCart(productData._id); navigateWithLoading('/cart') }} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-2 sm:gap-4 md:gap-6 mt-6 pb-14 w-full max-w-screen-xl mx-auto justify-items-center">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button onClick={() => navigateWithLoading('/all-products')} className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;