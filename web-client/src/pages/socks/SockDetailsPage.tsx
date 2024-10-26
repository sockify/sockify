import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

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

export default function SockDetailsPage() {
  const [selectedVariant, setSelectedVariant] = useState(sock.variants[1]); 
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* Removed Card wrapping the image */}
        <div className="w-full md:w-1/2">
          <img
            src={sock.preview_image_url}
            alt={sock.name}
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Removed Card wrapping the description */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{sock.name}</h1>
          <p className="text-xl text-gray-500">${selectedVariant.price}</p>
          <p>{sock.description}</p>

          {/* Select Size */}
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

          {/* Quantity Selector */}
          <div className="my-4">
            <label className="block text-lg font-medium">Quantity</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <div className="w-12 text-center">{quantity}</div> {/* Regular style for quantity */}
              <Button
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
