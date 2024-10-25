// src/components/ui/SockItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Sock } from '@/api/socks/model';

interface SockItemProps {
    sock: Sock;
}

const SockItem: React.FC<SockItemProps> = ({ sock }) => {
    const navigate = useNavigate();
    const { addItem } = useCart();

    const handleAddToCart = () => {
        const newItem = {
            sockVariantId: sock.variants[0]?.id ?? 0, // Defaulting to the first variant, can be adjusted
            name: sock.name,
            price: sock.variants[0]?.price ?? 0,
            quantity: 1,
            size: sock.variants[0]?.size ?? 'M',
            imageUrl: sock.previewImageUrl,
        };

        addItem(newItem);
        navigate(`/socks/${sock.id}`);
    };

    return (
        <div className="sock-item max-w-xs bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image container with placeholder */}
            <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
                <img
                    src={sock.previewImageUrl || '/path-to-placeholder-image.png'}
                    alt={sock.name}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Sock Info */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{sock.name}</h3>
                <p className="text-sm text-gray-500">${sock.variants[0]?.price.toFixed(2)}</p>

                {/* Add to Cart Button */}
                <button
                    className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default SockItem;
