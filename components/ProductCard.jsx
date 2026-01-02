import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {

    const { currency, router, navigateWithLoading, wishlist, toggleWishlist } = useAppContext()
    const isInWishlist = wishlist.includes(product._id)

    return (
        <div
            onClick={() => { navigateWithLoading('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] md:max-w-[250px] lg:max-w-[300px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
                <button 
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product._id)
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition"
                >
                    <Image
                        className={`h-3 w-3 ${isInWishlist ? 'filter-red' : ''}`}
                        src={assets.heart_icon}
                        alt="heart_icon"
                        style={isInWishlist ? { filter: 'invert(13%) sepia(94%) saturate(7151%) hue-rotate(3deg) brightness(90%) contrast(118%)' } : {}}
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.shadeDescription && product.shadeDescription.trim() ? product.shadeDescription : product.description}</p>


            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard