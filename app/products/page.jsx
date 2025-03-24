"use client";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { addToCart } from '@/lib/redux/cartSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Products</h1>
      <p className="mb-4">Items in cart: {cartItems.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-md">
            <h2 className="text-xl">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <Button
              className="mt-2"
              onClick={() => dispatch(addToCart({ id: product._id, name: product.name, price: product.price }))}
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}