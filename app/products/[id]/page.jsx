import Button from '@/components/ui/Button';

export default function ProductDetailPage({ params }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product {params.id}</h1>
      <div className="flex gap-4">
        <div className="w-1/2 h-64 bg-gray-200 rounded-md"></div>
        <div className="w-1/2">
          <p className="text-gray-600 mb-2">$29.99</p>
          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}