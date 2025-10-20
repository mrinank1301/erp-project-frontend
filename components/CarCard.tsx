"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car } from '@/lib/api';
import { Calendar, Fuel, Gauge, Users } from 'lucide-react';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const imageUrl = car.imageUrl?.startsWith('http') 
    ? car.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}${car.imageUrl}`;

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 animate-scale hover:-translate-y-2 border-2 hover:border-purple-200">
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {car.imageUrl ? (
          <Image
            src={imageUrl}
            alt={car.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-400 text-lg">No Image</span>
          </div>
        )}
        {car.status && car.status !== 'available' && (
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
            {car.status}
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold group-hover:text-slate-700 transition-colors">
          {car.name}
        </CardTitle>
        <p className="text-sm text-slate-500">{car.brand} {car.model}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-600 line-clamp-2 min-h-[3rem]">
          {car.description || 'No description available'}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {car.year && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>{car.year}</span>
            </div>
          )}
          {car.fuelType && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Gauge className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
          )}
          {car.seats && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>{car.seats} Seats</span>
            </div>
          )}
        </div>
        
        {car.features && car.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t pt-4 bg-gradient-to-r from-slate-50 to-purple-50">
        <div>
          <p className="text-sm text-slate-500 font-medium">Price</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ${car.price.toLocaleString()}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl transition-all hover:scale-105">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

