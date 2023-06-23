import { Schema, model } from 'mongoose';

const CartSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
})

const Cart = model('Cart', CartSchema)

export default Cart
