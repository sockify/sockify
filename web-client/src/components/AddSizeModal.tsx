import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AddSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  availableSizes: string[];
}

interface FormData {
  size: string;
  quantity: number;
  price: number;
}

export default function AddSizeModal({ isOpen, onClose, onSubmit, availableSizes }: AddSizeModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Size</DialogTitle>
          <DialogDescription>Add a new size, quantity, and price.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Size</label>
              <select
                {...register('size', { required: 'Size is required' })}
                className="w-full border rounded p-2"
              >
                <option value="">Select a size</option>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                {...register('quantity', { required: 'Quantity is required', min: 1 })}
                className="w-full border rounded p-2"
              />
              {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                className="w-full border rounded p-2"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Size</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
