"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data.slice(0, 4)); // Show 4 featured products
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-bgPrimary">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-5xl font-secondary font-bold mb-4">Discover Your Style</h1>
            <p className="text-xl font-primary text-textSecondary mb-6">
              Shop the latest trends with ease
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-primary">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto p-6">
        <h2 className="text-3xl font-secondary font-semibold mb-6 text-center text-textPrimary">
          Featured Products
        </h2>
        {loading ? (
          <p className="text-center text-textSecondary">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product._id}`} key={product._id}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-secondary font-medium text-textPrimary">
                      {product.name}
                    </h3>
                    <p className="text-textSecondary">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary text-white text-center py-12">
        <h2 className="text-2xl font-secondary font-bold mb-4">Ready to Shop?</h2>
        <Link href="/products">
          <Button className="bg-white text-primary hover:bg-secondary hover:text-white px-6 py-2 font-primary">
            Explore All Products
          </Button>
        </Link>
      </section>
    </div>
  );
}