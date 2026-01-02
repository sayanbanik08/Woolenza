'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {

  const { getToken, setIsLoading } = useAppContext();

  const [files, setFiles] = useState([null]);
  const [coloredProducts, setColoredProducts] = useState([
    { shades: '', description: '', images: [null] }
  ]);
  const [name, setName] = useState('');
  const [baseColor, setBaseColor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cotton Yarn');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validFiles = files.filter(file => file !== null);
    if (validFiles.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('baseColor', baseColor);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);

    // Prepare colored products data
    const coloredProductsData = coloredProducts.map(product => ({
      shades: product.shades,
      description: product.description,
      images: product.images.filter(img => img !== null).map(img => URL.createObjectURL(img))
    }));
    formData.append('coloredProducts', JSON.stringify(coloredProductsData));

    for (let i = 0; i < validFiles.length; i++) {
      formData.append('images', validFiles[i]);
    }

    // Add colored product images
    coloredProducts.forEach((product, idx) => {
      product.images.forEach((img, imgIdx) => {
        if (img !== null) {
          formData.append(`coloredImage-${idx}-${imgIdx}`, img);
        }
      });
    });

    setIsLoading(true)
    try {

      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        setFiles([null]);
        setColoredProducts([{ shades: '', description: '', images: [null] }]);
        setName('');
        setBaseColor('');
        setDescription('');
        setCategory('Cotton Yarn');
        setPrice('');
        setOfferPrice('');

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false)
    }


  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {files.map((file, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  className="max-w-24 cursor-pointer"
                  src={file ? URL.createObjectURL(file) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => setFiles([...files, null])}
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors"
            >
              <Image
                src={assets.add_icon}
                alt="Add more images"
                width={24}
                height={24}
                className="opacity-60"
              />
            </button>
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
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
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
              defaultValue={category}
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

        {coloredProducts.map((product, prodIndex) => (
          <div key={prodIndex} className="border-2 border-gray-400 p-6 space-y-5 relative">
            {/* Plus Icon */}
            <button
              type="button"
              onClick={() => setColoredProducts([...coloredProducts, { shades: '', description: '', images: [null] }])}
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
                {product.images.map((file, index) => (
                  <label key={index} htmlFor={`colored-image-${prodIndex}-${index}`}>
                    <input onChange={(e) => {
                      const updated = [...coloredProducts];
                      updated[prodIndex].images[index] = e.target.files[0];
                      setColoredProducts(updated);
                    }} type="file" id={`colored-image-${prodIndex}-${index}`} hidden />
                    <Image
                      className="max-w-24 cursor-pointer"
                      src={file ? URL.createObjectURL(file) : assets.upload_area}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...coloredProducts];
                    updated[prodIndex].images = [...updated[prodIndex].images, null];
                    setColoredProducts(updated);
                  }}
                  className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors"
                >
                  <Image
                    src={assets.add_icon}
                    alt="Add more images"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            {/* Delete Button */}
            {coloredProducts.length > 1 && (
              <button
                type="button"
                onClick={() => setColoredProducts(coloredProducts.filter((_, i) => i !== prodIndex))}
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
              >
                Remove This Color
              </button>
            )}
          </div>
        ))}

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;