'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {

      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setProducts(data?.products)
        setLoading(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete?id=${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        fetchSellerProduct();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th colSpan="4" className="p-0">
                  <div className="overflow-x-auto">
                    <div className="flex min-w-[600px]">
                      <div className="w-2/5 md:px-4 pl-2 md:pl-4 py-3 font-medium">Product</div>
                      <div className="w-1/5 px-4 py-3 font-medium">Category</div>
                      <div className="w-1/5 px-4 py-3 font-medium">Price</div>
                      <div className="w-1/5 px-4 py-3 font-medium">Action</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td colSpan="4" className="p-0">
                    <div className="overflow-x-auto">
                      <div className="flex min-w-[600px]">
                        <div className="w-2/5 md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                          <div className="bg-gray-500/10 rounded p-2">
                            <Image
                              src={product.image[0]}
                              alt="product Image"
                              className="w-16"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <span className="truncate">
                            {product.name}
                          </span>
                        </div>
                        <div className="w-1/5 px-4 py-3">{product.category}</div>
                        <div className="w-1/5 px-4 py-3">${product.offerPrice}</div>
                        <div className="w-1/5 px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-4 py-2.5 bg-orange-600 text-white rounded-md text-xs whitespace-nowrap">
                              <span>Visit</span>
                              <Image
                                className="h-3.5"
                                src={assets.redirect_icon}
                                alt="redirect_icon"
                              />
                            </button>
                            <button onClick={() => deleteProduct(product._id)} className="px-4 py-2.5 bg-red-600 text-white rounded-md text-xs whitespace-nowrap">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;