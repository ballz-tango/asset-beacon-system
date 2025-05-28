
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Package,
  BarChart3
} from 'lucide-react';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventoryItems = [
    {
      id: '1',
      name: 'Laptop Batteries',
      sku: 'BAT-LP-001',
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      unitPrice: 89.99,
      location: 'Warehouse A - Shelf 12',
      lastRestocked: '2024-01-15',
      supplier: 'Tech Solutions Inc'
    },
    {
      id: '2',
      name: 'USB Cables',
      sku: 'CBL-USB-002',
      currentStock: 5,
      minStock: 20,
      maxStock: 100,
      unitPrice: 12.50,
      location: 'Warehouse A - Shelf 8',
      lastRestocked: '2024-01-10',
      supplier: 'Cable Corp'
    },
    {
      id: '3',
      name: 'Office Chairs',
      sku: 'CHR-OFF-003',
      currentStock: 8,
      minStock: 5,
      maxStock: 25,
      unitPrice: 299.99,
      location: 'Warehouse B - Section 3',
      lastRestocked: '2024-01-08',
      supplier: 'Furniture Plus'
    }
  ];

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current <= min) return { status: 'low', color: 'bg-red-100 text-red-800' };
    if (current <= min * 1.5) return { status: 'medium', color: 'bg-orange-100 text-orange-800' };
    return { status: 'good', color: 'bg-green-100 text-green-800' };
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockCount = inventoryItems.filter(item => item.currentStock <= item.minStock).length;
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Track stock levels, supplies, and inventory movements
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Inventory Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {inventoryItems.map((item) => {
          const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                  </div>
                  <Badge className={stockStatus.color}>
                    {stockStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Stock:</span>
                    <span className="font-medium">{item.currentStock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Min Stock:</span>
                    <span>{item.minStock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unit Price:</span>
                    <span>${item.unitPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Value:</span>
                    <span className="font-medium">
                      ${(item.currentStock * item.unitPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Location: {item.location}</p>
                  <p className="text-xs text-gray-500">Last restocked: {item.lastRestocked}</p>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Restock
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 mb-4">
              {lowStockCount} item{lowStockCount > 1 ? 's' : ''} {lowStockCount === 1 ? 'is' : 'are'} running low on stock and need restocking.
            </p>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              View Low Stock Items
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;
