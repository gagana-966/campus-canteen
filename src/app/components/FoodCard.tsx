import { Plus, Minus } from "lucide-react";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface FoodCardProps {
  item: FoodItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function FoodCard({ item, quantity, onAdd, onRemove }: FoodCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="text-green-600 font-bold">₹{item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        {item.available ? (
          <div className="flex items-center justify-between">
            {quantity === 0 ? (
              <button
                onClick={onAdd}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Add to Cart
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-gray-100 rounded-lg">
                <button
                  onClick={onRemove}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-semibold">{quantity}</span>
                <button
                  onClick={onAdd}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
