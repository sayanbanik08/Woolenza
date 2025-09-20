import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    date: { type: Number, required: true }

})
// Force new model creation to update schema
if (mongoose.models.product) {
    delete mongoose.models.product;
}
const Product = mongoose.model('product', productSchema);
export default Product;