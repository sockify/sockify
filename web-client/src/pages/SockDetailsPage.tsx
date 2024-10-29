import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Hardcoded sock details for testing purposes
const sock = {
  name: 'Cozy Striped Socks',
  description:
    'Experience ultimate comfort with our Cozy Striped Socks. Made from a blend of premium cotton and elastane, these socks offer a perfect fit and all-day comfort. The stylish stripe pattern adds a touch of flair to your everyday look. With reinforced heel and toe for durability, seamless toe closure for added comfort, and a ribbed cuff to prevent slipping, these socks are designed to meet all your needs. Made in the USA with high-quality materials, they’re breathable, soft, and long-lasting. Ideal for both casual and professional wear.',
  preview_image_url: 'https://via.placeholder.com/500',
  variants: [
    { size: 'S', price: 10.99 },
    { size: 'M', price: 12.99 },
    { size: 'L', price: 13.99 },
    { size: 'XL', price: 15.99 },
  ],
};

// Dummy related products
const relatedProducts = [
  {
    id: 1,
    name: 'Classic Black Socks',
    price: 9.99,
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'Colorful Polka Dot Socks',
    price: 11.99,
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    name: 'Warm Wool Socks',
    price: 14.99,
    imageUrl: 'https://via.placeholder.com/300',
  },
];

export default function SockDetailsPage() {
  const [selectedVariant, setSelectedVariant] = useState(sock.variants[1]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleSizeChange = (size: string) => {
    const variant = sock.variants.find((v) => v.size === size);
    setSelectedVariant(variant || sock.variants[0]);
  };

  const handleAddToCart = () => {
    console.log(
      `Adding to cart: ${selectedVariant.size} size, ${quantity} quantity, price $${selectedVariant.price}`
    );
    toast.success('Item added to cart!');
  };

  const handleViewProduct = (id: number) => {
    navigate(`/socks/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2">
          <img
            src={sock.preview_image_url}
            alt={sock.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{sock.name}</h1>
          <p className="text-xl text-gray-500">${selectedVariant.price}</p>
          <p>{sock.description}</p>

          <div className="my-4">
            <label className="block text-lg font-medium">Select Size</label>
            <div className="flex space-x-4">
              {sock.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => handleSizeChange(variant.size)}
                  className={`px-4 py-2 rounded border ${
                    selectedVariant.size === variant.size
                      ? 'bg-gray-300 border-black'
                      : 'border-gray-300'
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="my-4">
            <label className="block text-lg font-medium">Quantity</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <div className="w-12 text-center">{quantity}</div>
              <Button
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg hover:shadow-lg"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <Button
                className="mt-4 bg-indigo-600 text-white w-full"
                onClick={() => handleViewProduct(product.id)}
              >
                View Product
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
