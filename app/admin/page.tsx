"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { carApi, Car } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

export default function AdminDashboard() {
  const { user, getUserRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Car>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    price: 0,
    imageUrl: '',
    color: '',
    fuelType: '',
    transmission: '',
    mileage: 0,
    engineCapacity: '',
    seats: 4,
    features: [],
    status: 'available',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (getUserRole() !== 'admin') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin privileges",
        });
        router.push('/');
      } else {
        fetchCars();
      }
    }
  }, [user, authLoading]);

  const fetchCars = async () => {
    try {
      const data = await carApi.getAllCars();
      setCars(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch cars",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await carApi.uploadImage(file);
      setFormData({ ...formData, imageUrl: result.url });
      toast({
        variant: "success" as any,
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCar) {
        await carApi.updateCar(editingCar.id!, formData);
        toast({
          variant: "success" as any,
          title: "Success",
          description: "Car updated successfully",
        });
      } else {
        await carApi.createCar(formData);
        toast({
          variant: "success" as any,
          title: "Success",
          description: "Car added successfully",
        });
      }
      
      resetForm();
      fetchCars();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to save car",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData(car);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      await carApi.deleteCar(id);
      toast({
        variant: "success" as any,
        title: "Success",
        description: "Car deleted successfully",
      });
      fetchCars();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      description: '',
      price: 0,
      imageUrl: '',
      color: '',
      fuelType: '',
      transmission: '',
      mileage: 0,
      engineCapacity: '',
      seats: 4,
      features: [],
      status: 'available',
    });
    setEditingCar(null);
    setShowForm(false);
  };

  const handleFeatureAdd = (feature: string) => {
    if (feature && !formData.features?.includes(feature)) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), feature],
      });
    }
  };

  const handleFeatureRemove = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index),
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-6 text-xl text-slate-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-3 text-lg">Manage your premium car inventory</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Button>
        </div>

      {showForm && (
        <Card className="mb-12 shadow-2xl animate-bounce-in border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </CardTitle>
                <CardDescription className="text-base mt-2">Fill in the car details below</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm} className="hover:bg-purple-100">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Car Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Input
                    id="fuelType"
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    placeholder="e.g., Petrol, Diesel, Electric"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Input
                    id="transmission"
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    placeholder="e.g., Manual, Automatic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage (km/l)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineCapacity">Engine Capacity</Label>
                  <Input
                    id="engineCapacity"
                    value={formData.engineCapacity}
                    onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                    placeholder="e.g., 2.0L, 1500cc"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="flex h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                  placeholder="Describe the car..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Car Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <span className="text-sm text-slate-600">Uploading...</span>}
                </div>
                {formData.imageUrl && (
                  <p className="text-sm text-green-600">Image uploaded successfully!</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    id="featureInput"
                    placeholder="Add a feature"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleFeatureAdd(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('featureInput') as HTMLInputElement;
                      handleFeatureAdd(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl transition-all py-6 text-base font-semibold"
                >
                  {loading ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="border-2 hover:bg-slate-100"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-2xl text-slate-600 font-medium">No cars in inventory</p>
            <p className="text-slate-500 mt-2">Add your first car to get started!</p>
          </div>
        ) : (
          cars.map((car, index) => (
            <Card key={car.id} className="shadow-lg hover:shadow-2xl transition-all animate-slide-up border-2 hover:border-purple-200 hover:-translate-y-1" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardContent className="flex items-center gap-6 p-6">
                <div className="w-40 h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl.startsWith('http') ? car.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${car.imageUrl}`}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{car.name}</h3>
                      <p className="text-slate-600 text-lg mt-1">{car.brand} {car.model} - {car.year}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {car.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-3">
                    ${car.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{car.description}</p>
                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {car.features.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 4 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          +{car.features.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleEdit(car)}
                    className="hover:bg-blue-50 border-2"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(car.id!)}
                    className="hover:shadow-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

