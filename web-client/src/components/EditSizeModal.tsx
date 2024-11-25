import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { size: string; quantity: number; price: number }) => void;
  defaultValues: { size: string; quantity: number; price: number };
}

export default function EditSizeModal({ isOpen, onClose, onSubmit, defaultValues }: EditSizeModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Size Information</DialogTitle>
          <DialogDescription>Modify size details for this item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Size</label>
              <input
                type="text"
                {...register('size', { required: 'Size is required' })}
                className="w-full border rounded p-2"
                disabled
              />
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
