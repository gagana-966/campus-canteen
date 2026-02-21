import { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, LogOut, History, Settings, Edit2, Save, Camera, Plus, Trash2, Map } from "lucide-react";
import { AddressMap } from "./AddressMap";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onLogout: () => void;
}

export function Profile({ isOpen, onClose, userEmail, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: userEmail,
    phone: "+91 98765 43210",
    studentId: "STU2024001",
    address: "Dormitory Block A, Room 305",
    memberSince: "January 2024",
  });

  const [savedAddresses, setSavedAddresses] = useState([
    "Dormitory Block A, Room 305",
    "Library Study Room 4",
    "Main Canteen Area"
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleAddAddress = () => {
    if (newAddressInput.trim()) {
      setSavedAddresses([...savedAddresses, newAddressInput]);
      setNewAddressInput("");
      setIsAddingAddress(false);
      setShowMap(false);
    }
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setNewAddressInput(address);
  };

  const handleDeleteAddress = (index: number) => {
    const newAddresses = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(newAddresses);
  };

  // Update email when prop changes
  useEffect(() => {
    setProfile(prev => ({ ...prev, email: userEmail }));
  }, [userEmail]);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed, for now we just toggle off
    // Ideally we'd keep a "backup" state to revert to
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Profile Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <div className="flex gap-2">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 size={20} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-orange-500 overflow-hidden">
                <User size={40} />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full hover:bg-gray-700 transition-colors border-2 border-orange-500">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:bg-opacity-30"
                  placeholder="Full Name"
                />
              ) : (
                <h3 className="text-xl font-semibold">{profile.name}</h3>
              )}
              <p className="text-orange-100 text-sm mt-1">Student ID: {profile.studentId}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Personal Information */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Personal Information</h4>
              {isEditing && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancel}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 text-sm text-orange-600 font-semibold hover:text-orange-700"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-orange-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-700">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-orange-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <p className="font-medium">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-orange-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Current Address</p>
                  {isEditing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      rows={2}
                      placeholder="Address"
                    />
                  ) : (
                    <p className="font-medium">{profile.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Saved Addresses</h4>
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center gap-1 text-sm text-orange-600 font-semibold hover:text-orange-700"
              >
                <Plus size={16} />
                Add New
              </button>
            </div>
            
            <div className="space-y-3">
              {savedAddresses.map((addr, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-orange-50 transition-colors">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setProfile({...profile, address: addr})}>
                    <MapPin size={18} className="text-gray-400 group-hover:text-orange-500" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{addr}</span>
                    {profile.address === addr && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-2">Default</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {isAddingAddress && (
                <div className="p-4 bg-white border-2 border-orange-200 rounded-lg shadow-lg space-y-3">
                  {/* Map Toggle Button */}
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Add Address</label>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <Map size={14} />
                      {showMap ? "Hide Map" : "Show Map"}
                    </button>
                  </div>

                  {/* Map Component */}
                  {showMap && (
                    <div className="mb-3">
                      <AddressMap onLocationSelect={handleLocationSelect} />
                    </div>
                  )}

                  {/* Address Input */}
                  <input
                    type="text"
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="Enter address or select from map"
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    autoFocus={!showMap}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddAddress();
                      if (e.key === 'Escape') {
                        setIsAddingAddress(false);
                        setShowMap(false);
                      }
                    }}
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      onClick={() => {
                        setIsAddingAddress(false);
                        setShowMap(false);
                        setNewAddressInput("");
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddAddress}
                      className="text-xs bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-600 font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Account Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">47</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">₹5,400</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <History size={20} className="text-gray-600" />
                <span className="font-medium">Order History</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings size={20} className="text-gray-600" />
                <span className="font-medium">Account Settings</span>
              </button>
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center text-sm text-gray-500 mb-4">
            Member since {profile.memberSince}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}