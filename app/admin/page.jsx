"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "",
    color: "",
    stock: 0,
    price: 0,
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    console.log(e.target.files,'target')
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Add or Edit Product
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("size", formData.size);
    data.append("color", formData.color);
    data.append("stock", formData.stock);
    if (formData.image) data.append("image", formData.image);
  
    // ✅ Debugging: Properly log FormData
    console.log("📤 Submitting FormData:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
  
    const url = editingProduct
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/products/add`;
  
    const method = editingProduct ? "PUT" : "POST";
  
    try {
      const response = await fetch(url, {
        method,
        body: data, // ✅ No need to set Content-Type, FormData handles it
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save product: ${errorText}`);
      }
  
      const updatedProduct = await response.json();
      setProducts((prev) =>
        editingProduct
          ? prev.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            )
          : [...prev, updatedProduct]
      );
  
      // Reset form state after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        image: null,
        size: "",
        color: "",
        stock: 0,
      });
  
      setEditingProduct(null);
    } catch (error) {
      console.error("❌ Error submitting product:", error);
      alert(error.message);
    }
  };
  

  // Delete Product
  const handleDelete = async (id) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } else {
      alert("Failed to delete product.");
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      size: product.size,
      color: product.color,
      stock: product.stock,
      image: null, // Image won't be pre-filled
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid gap-4 grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Size</label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      <table className="w-full border-collapse border border-gray-300">
  <thead>
    <tr>
      <th className="border border-gray-300 px-4 py-2">Name</th>
      <th className="border border-gray-300 px-4 py-2">Description</th>
      <th className="border border-gray-300 px-4 py-2">Price</th>
      <th className="border border-gray-300 px-4 py-2">Color</th>
      <th className="border border-gray-300 px-4 py-2">Size</th>
      <th className="border border-gray-300 px-4 py-2">Stock</th>
      <th className="border border-gray-300 px-4 py-2">Image</th>
      <th className="border border-gray-300 px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product._id}>
        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
        <td className="border border-gray-300 px-4 py-2">{product.description}</td>
        <td className="border border-gray-300 px-4 py-2">${product.price}</td>
        <td className="border border-gray-300 px-4 py-2">{product.color}</td>
        <td className="border border-gray-300 px-4 py-2">{product.size}</td>
        <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
        <td className="border border-gray-300 px-4 py-2">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            "No Image"
          )}
        </td>
        <td className="border border-gray-300 px-4 py-2 space-x-2">
          <button
            onClick={() => handleEdit(product)}
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
