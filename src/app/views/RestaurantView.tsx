import { RestaurantPartner } from "../components/RestaurantPartner";
import { FoodItem } from "../components/FoodCard";

interface RestaurantViewProps {
  foodItems: FoodItem[];
  onAddItem: (item: Omit<FoodItem, "id">) => void;
  onUpdateItem: (id: string, item: Partial<FoodItem>) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
}

export function RestaurantView({
  foodItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onBack,
}: RestaurantViewProps) {
  return (
    <RestaurantPartner
      foodItems={foodItems}
      onAddItem={onAddItem}
      onUpdateItem={onUpdateItem}
      onDeleteItem={onDeleteItem}
      onBack={onBack}
    />
  );
}