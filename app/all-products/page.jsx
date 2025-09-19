'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {

    const { products } = useAppContext();

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="pt-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8">
                        All <span className="text-orange-600">products</span>
                    </h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-2 sm:gap-4 md:gap-6 mt-6 pb-14 w-full max-w-screen-xl mx-auto justify-items-center">
                    {products.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
