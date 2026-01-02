'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { getToken, setIsLoading, router } = useAppContext();
  const [productId, setProductId] = useState('');
  const [files, setFiles] = useState([]);
  const [showColoredProducts, setShowColoredProducts] = useState(false);
  const [coloredProducts, setColoredProducts] = useState([
    { shades: '', description: '', images: [], existingImages: [] }
  ]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState('');
  const [baseColor, setBaseColor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cotton Yarn');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setProductId(id);
      fetchProduct(id);
    } else {
      router.push('/seller/product-list');
    }
  }, [router]);

  const fetchProduct = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/product/list?id=${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (data.success && data.products.length > 0) {
        const product = data.products[0];
        setName(product.name);
        setBaseColor(product.baseColor || '');
        setDescription(product.description);
        setCategory(product.category);
        setPrice(product.price.toString());
        setOfferPrice(product.offerPrice.toString());
        setExistingImages(product.image);
        
        // Check if current product is a colored variant or base product
        const isColoredProduct = product.shade !== null && product.shade !== undefined;
        
        if (isColoredProduct) {
          // If editing a colored product, don't show the composite form
          // Just show the colored product details alone
          setColoredProducts([{ shades: '', description: '', images: [], existingImages: [] }]);
        } else {
          // If editing base product, fetch all related colored products
          const { data: allProductsData } = await axios.get('/api/product/list', { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          
          if (allProductsData.success) {
            const relatedColoredProducts = allProductsData.products
              .filter(p => p.name === product.name && p.category === product.category && p.price === product.price && p.shade)
              .map(p => ({
                shades: p.shade?.name || '',
                description: p.shadeDescription || '',
                images: [],
                existingImages: p.image,
                productId: p._id
              }));
            
            // Set colored products if any exist, otherwise empty default
            if (relatedColoredProducts.length > 0) {
              setColoredProducts(relatedColoredProducts);
              setShowColoredProducts(true); // Show colored products section by default
            } else {
              setColoredProducts([{ shades: '', description: '', images: [], existingImages: [] }]);
              setShowColoredProducts(false); // Hide colored products section by default
            }
          }
        }
        
        setLoading(false);
      } else {
        toast.error('Product not found');
        router.push('/seller/product-list');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      router.push('/seller/product-list');
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeColoredProduct = async (prodIndex) => {
    const productToRemove = coloredProducts[prodIndex];
    
    // If it's an existing product (has productId), delete it from database
    if (productToRemove.productId) {
      try {
        const token = await getToken();
        await axios.delete(`/api/product/delete?id=${productToRemove.productId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        toast.success('Color variant deleted successfully');
      } catch (error) {
        toast.error('Failed to delete colored product');
        return;
      }
    }
    
    // Remove from state
    setColoredProducts(coloredProducts.filter((_, i) => i !== prodIndex));
    toast.success('Color variant removed from form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && files.length === 0) {
      toast.error('Please keep at least one product image');
      return;
    }

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('name', name);
    formData.append('baseColor', baseColor);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('existingImages', JSON.stringify(existingImages));

    files.forEach(file => {
      formData.append('images', file);
    });

    // Separate existing and new colored products
    const existingColoredProducts = coloredProducts.filter(cp => cp.productId);
    const newColoredProducts = coloredProducts.filter(cp => !cp.productId);

    // Prepare existing colored products for update
    const existingColoredProductsData = existingColoredProducts.map(product => ({
      productId: product.productId,
      shades: product.shades,
      description: product.description,
      existingImages: product.existingImages,
      newImages: product.images.filter(img => img !== null)
    }));
    formData.append('existingColoredProducts', JSON.stringify(existingColoredProductsData));

    // Prepare new colored products data
    const newColoredProductsData = newColoredProducts.map(product => ({
      shades: product.shades,
      description: product.description,
      images: product.images.filter(img => img !== null).map(img => URL.createObjectURL(img))
    }));
    formData.append('coloredProducts', JSON.stringify(newColoredProductsData));

    // Add new colored product images
    newColoredProducts.forEach((product, idx) => {
      product.images.forEach((img, imgIdx) => {
        if (img !== null) {
          formData.append(`coloredImage-${idx}-${imgIdx}`, img);
        }
      });
    });

    // Add existing colored product new images
    existingColoredProducts.forEach((product, idx) => {
      product.images.forEach((img, imgIdx) => {
        if (img !== null) {
          formData.append(`existingColoredImage-${idx}-${imgIdx}`, img);
        }
      });
    });

    setIsLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.put('/api/product/update', formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (data.success) {
        toast.success(data.message);
        router.push('/seller/product-list');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-1 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form key={productId} onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-lg font-medium">Edit Product</h2>
        
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative">
                <Image
                  className="max-w-24 border rounded"
                  src={image}
                  alt=""
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            
            {files.map((file, index) => (
              <div key={`new-${index}`} className="relative">
                <Image
                  className="max-w-24 border rounded"
                  src={URL.createObjectURL(file)}
                  alt=""
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            
            <label htmlFor="add-image">
              <input 
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFiles([...files, e.target.files[0]]);
                  }
                }} 
                type="file" 
                id="add-image" 
                hidden 
              />
              <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors cursor-pointer">
                <Image
                  src={assets.add_icon}
                  alt="Add image"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="base-color">
            Base Color
          </label>
          <input
            id="base-color"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setBaseColor(e.target.value)}
            value={baseColor}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Cotton Yarn">Cotton Yarn</option>
              <option value="Chenile Yarn">Chenile Yarn</option>
              <option value="Pure Merino wool">Pure Merino wool</option>
              <option value="Cotton and Acrylic Blend">Cotton and Acrylic Blend</option>
              <option value="Acrylic Yarn">Acrylic Yarn</option>
              <option value="Acrylic Rainbow">Acrylic Rainbow</option>
              <option value="MultiTone Acrylic">MultiTone Acrylic</option>
              <option value="CloudCotton">CloudCotton</option>
              <option value="Aroma Cotton">Aroma Cotton</option>
              <option value="TwistTone Cotton">TwistTone Cotton</option>
              <option value="Exclusive Acrylic">Exclusive Acrylic</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        {/* Colored Products Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowColoredProducts(!showColoredProducts);
              if (!showColoredProducts && coloredProducts.length === 0) {
                setColoredProducts([{ shades: '', description: '', images: [], existingImages: [] }]);
              }
            }}
            className={`px-6 py-2 rounded text-white font-medium transition ${
              showColoredProducts
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {showColoredProducts ? 'Turn Off Colored Products' : 'Add Colored Products'}
          </button>
        </div>

        {/* Colored Products Section */}
        {showColoredProducts && (
          <>
            {coloredProducts.map((product, prodIndex) => (
              <div key={prodIndex} className="border-2 border-gray-400 p-6 space-y-5 relative">
            {/* Plus Icon */}
            <button
              type="button"
              onClick={() => setColoredProducts([...coloredProducts, { shades: '', description: '', images: [], existingImages: [] }])}
              className="absolute top-4 right-4 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center text-lg font-bold transition"
              title="Add another colored product"
            >
              +
            </button>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-base font-medium" htmlFor={`choose-shade-${prodIndex}`}>
                Choose a Shade
              </label>
              <input
                id={`choose-shade-${prodIndex}`}
                type="text"
                placeholder="e.g., Red, Blue, Green..."
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => {
                  const updated = [...coloredProducts];
                  updated[prodIndex].shades = e.target.value;
                  setColoredProducts(updated);
                }}
                value={product.shades}
                required
              />
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <label
                className="text-base font-medium"
                htmlFor={`colored-product-description-${prodIndex}`}
              >
                Colored Product Description
              </label>
              <textarea
                id={`colored-product-description-${prodIndex}`}
                rows={4}
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                placeholder="Type here"
                onChange={(e) => {
                  const updated = [...coloredProducts];
                  updated[prodIndex].description = e.target.value;
                  setColoredProducts(updated);
                }}
                value={product.description}
                required
              ></textarea>
            </div>

            <div>
              <p className="text-base font-medium">Colored product Image</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {product.existingImages?.map((image, index) => (
                  <div key={`existing-colored-${index}`} className="relative">
                    <Image
                      className="max-w-24 border rounded"
                      src={image}
                      alt=""
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...coloredProducts];
                        updated[prodIndex].existingImages = updated[prodIndex].existingImages.filter((_, i) => i !== index);
                        setColoredProducts(updated);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {product.images?.map((file, index) => (
                  <div key={`new-colored-${index}`} className="relative">
                    <Image
                      className="max-w-24 border rounded"
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...coloredProducts];
                        updated[prodIndex].images = updated[prodIndex].images.filter((_, i) => i !== index);
                        setColoredProducts(updated);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <label htmlFor={`colored-file-input-${prodIndex}`}>
                  <input
                    id={`colored-file-input-${prodIndex}`}
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        const updated = [...coloredProducts];
                        updated[prodIndex].images = [...(updated[prodIndex].images || []), e.target.files[0]];
                        setColoredProducts(updated);
                      }
                    }}
                  />
                  <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors cursor-pointer">
                    <Image
                      src={assets.add_icon}
                      alt="Add image"
                      width={24}
                      height={24}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeColoredProduct(prodIndex)}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
            >
              Remove This Color
            </button>
          </div>
            ))}
          </>
        )}

        <div className="flex gap-3">
          <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
            UPDATE
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/seller/product-list')}
            className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded"
          >
            CANCEL
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default EditProduct;