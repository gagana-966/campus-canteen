import { CheckCircle, X } from "lucide-react";

interface OrderSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export function OrderSuccess({ isOpen, onClose, orderNumber }: OrderSuccessProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-8 text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <CheckCircle size={80} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-4">Thank you for your order</p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
          <p className="text-2xl font-bold text-orange-600">#{orderNumber}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Your order is being prepared. You'll receive a notification when it's ready for pickup.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Continue Ordering
        </button>
      </div>
    </>
  );
}
