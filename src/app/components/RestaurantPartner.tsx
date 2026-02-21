import { useState } from "react";
import { Plus, Edit, Trash2, ArrowLeft, Search, Store } from "lucide-react";
import { FoodItem } from "./FoodCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface RestaurantPartnerProps {
  foodItems: FoodItem[];
  onAddItem: (item: Omit<FoodItem, "id">) => void;
  onUpdateItem: (id: string, item: Partial<FoodItem>) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["Main Course", "Salads", "Beverages", "Desserts"];

// Available food images to choose from
const FOOD_IMAGES = [
  { label: "Burger", url: "https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc3MDI2Mzk1OXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Pizza", url: "https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc3MDE4ODc4OXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Pasta", url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Salad Bowl", url: "https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MDIzOTIxMHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Sandwich", url: "https://images.unsplash.com/photo-1763647814142-b1eb054d42f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZyZXNofGVufDF8fHx8MTc3MDE5NDQ1NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Coffee", url: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NzAyMzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Lemonade", url: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwYmV2ZXJhZ2V8ZW58MXx8fHwxNzcwMjcwODA5fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Chocolate Cake", url: "https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NzAxOTM3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Chicken Biryani", url: "https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmlyeWFuaSUyMGJvd2x8ZW58MXx8fHwxNzcwMTk5MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Fried Rice", url: "https://images.unsplash.com/photo-1581184953987-5668072c8420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmcmllZCUyMHJpY2V8ZW58MXx8fHwxNzcwMjYzNjg0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Paneer Tikka", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Caesar Salad", url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NzAyNzc3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Fruit Salad", url: "https://images.unsplash.com/photo-1609090802574-612df35aaa04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc2FsYWQlMjBib3lsfGVufDF8fHx8MTc3MDI2MjQ3MXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Mango Lassi", url: "https://images.unsplash.com/photo-1655074084308-901ea6b88fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGxhc3NpJTIwZHJpbmt8ZW58MXx8fHwxNzcwMTk4MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Masala Chai", url: "https://images.unsplash.com/photo-1628702774354-f09e4a167a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNhbGElMjBjaGFpJTIwdGVhJTIwY3VwfGVufDF8fHx8MTc3MDI3MTc5NXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Gulab Jamun", url: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwxfHx8fDE3NzAyNjYzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { label: "Brownie Ice Cream", url: "https://images.unsplash.com/photo-1639744093270-36e0cc2817ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllJTIwd2l0aCUyMHZhbmlsbGElMjBpY2UlMjBjcmVhbXxlbnwxfHx8fDE3NzAyODEwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export function RestaurantPartner({
  foodItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onBack,
}: RestaurantPartnerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: "",
    available: true,
  });

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Main Course",
      image: "",
      available: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
    });
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newItem: Omit<FoodItem, "id"> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      available: formData.available,
    };

    onAddItem(newItem);
    setIsAddModalOpen(false);
    toast.success("Food item added successfully!");
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedItem: Partial<FoodItem> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      available: formData.available,
    };

    onUpdateItem(editingItem.id, updatedItem);
    setIsEditModalOpen(false);
    setEditingItem(null);
    toast.success("Food item updated successfully!");
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      onDeleteItem(id);
      toast.success("Food item deleted successfully!");
    }
  };

  const handleToggleAvailability = (item: FoodItem) => {
    onUpdateItem(item.id, { available: !item.available });
    toast.success(`${item.name} is now ${!item.available ? "available" : "unavailable"}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                <Store size={32} className="text-orange-500" />
                <div>
                  <h1 className="text-2xl font-bold">Restaurant Partner Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your menu items</p>
                </div>
              </div>
            </div>

            <Button onClick={handleOpenAddModal} className="bg-orange-500 hover:bg-orange-600">
              <Plus size={20} className="mr-2" />
              Add New Item
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Total Items</p>
            <p className="text-2xl font-bold">{foodItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {foodItems.filter((item) => item.available).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Unavailable</p>
            <p className="text-2xl font-bold text-red-600">
              {foodItems.filter((item) => !item.available).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Categories</p>
            <p className="text-2xl font-bold">{CATEGORIES.length}</p>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => handleToggleAvailability(item)}
                        />
                        <span
                          className={`text-sm ${
                            item.available ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No items found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Food Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chicken Biryani"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the dish..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="149"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Food Image *</Label>
              <Select
                value={formData.image}
                onValueChange={(value) => setFormData({ ...formData, image: value })}
              >
                <SelectTrigger id="image">
                  <SelectValue placeholder="Select a food image" />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_IMAGES.map((img) => (
                    <SelectItem key={img.url} value={img.url}>
                      {img.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-orange-500 hover:bg-orange-600">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chicken Biryani"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the dish..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="149"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-image">Food Image *</Label>
              <Select
                value={formData.image}
                onValueChange={(value) => setFormData({ ...formData, image: value })}
              >
                <SelectTrigger id="edit-image">
                  <SelectValue placeholder="Select a food image" />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_IMAGES.map((img) => (
                    <SelectItem key={img.url} value={img.url}>
                      {img.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="edit-available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="edit-available">Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem} className="bg-orange-500 hover:bg-orange-600">
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}