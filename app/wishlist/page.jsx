'use client'
import { useAppContext } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'

const WishlistPage = () => {
    const { wishlist, products, user } = useAppContext()
    const [wishlistProducts, setWishlistProducts] = useState([])

    useEffect(() => {
        if (products.length > 0 && wishlist.length > 0) {
            const filteredProducts = products.filter(product => wishlist.includes(product._id))
            setWishlistProducts(filteredProducts)
        } else {
            setWishlistProducts([])
        }
    }, [wishlist, products])

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Please login to view your wishlist</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="pt-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8">
                        My <span className="text-orange-600">Wishlist</span>
                    </h1>
                </div>
                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-16 w-full">
                        <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                        <p className="text-gray-400 text-sm mt-2">Add products to your wishlist to see them here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-2 sm:gap-4 md:gap-6 mt-6 pb-14 w-full max-w-screen-xl mx-auto justify-items-center">
                        {wishlistProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default WishlistPage