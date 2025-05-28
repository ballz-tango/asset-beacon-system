
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  rfidTag?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  assignedTo?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  vendor: string;
  warranty: string;
  notes?: string;
  lastScanned?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  fields: { name: string; type: string; required: boolean }[];
}

interface AssetState {
  assets: Asset[];
  categories: AssetCategory[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  scanRFID: (rfidTag: string) => Asset | null;
  getAssetsByCategory: (category: string) => Asset[];
  getAssetsByStatus: (status: Asset['status']) => Asset[];
  exportToCSV: () => string;
  importFromCSV: (csvData: string) => void;
}

const defaultCategories: AssetCategory[] = [
  {
    id: '1',
    name: 'IT Equipment',
    description: 'Computers, laptops, servers, and IT infrastructure',
    fields: [
      { name: 'model', type: 'text', required: true },
      { name: 'specifications', type: 'text', required: false },
      { name: 'osVersion', type: 'text', required: false }
    ]
  },
  {
    id: '2',
    name: 'Office Furniture',
    description: 'Desks, chairs, cabinets, and office equipment',
    fields: [
      { name: 'material', type: 'text', required: false },
      { name: 'dimensions', type: 'text', required: false }
    ]
  },
  {
    id: '3',
    name: 'Vehicles',
    description: 'Company cars, trucks, and fleet vehicles',
    fields: [
      { name: 'make', type: 'text', required: true },
      { name: 'model', type: 'text', required: true },
      { name: 'year', type: 'number', required: true },
      { name: 'license', type: 'text', required: true }
    ]
  }
];

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],
      categories: defaultCategories,
      
      addAsset: (assetData) => {
        const asset: Asset = {
          ...assetData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          assets: [...state.assets, asset]
        }));
      },
      
      updateAsset: (id, updates) => {
        set((state) => ({
          assets: state.assets.map(asset =>
            asset.id === id
              ? { ...asset, ...updates, updatedAt: new Date().toISOString() }
              : asset
          )
        }));
      },
      
      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter(asset => asset.id !== id)
        }));
      },
      
      scanRFID: (rfidTag) => {
        const { assets } = get();
        return assets.find(asset => asset.rfidTag === rfidTag) || null;
      },
      
      getAssetsByCategory: (category) => {
        const { assets } = get();
        return assets.filter(asset => asset.category === category);
      },
      
      getAssetsByStatus: (status) => {
        const { assets } = get();
        return assets.filter(asset => asset.status === status);
      },
      
      exportToCSV: () => {
        const { assets } = get();
        const headers = ['ID', 'Name', 'Category', 'Serial Number', 'RFID Tag', 'Status', 'Location', 'Assigned To', 'Purchase Date', 'Purchase Price', 'Current Value', 'Vendor'];
        const rows = assets.map(asset => [
          asset.id,
          asset.name,
          asset.category,
          asset.serialNumber,
          asset.rfidTag || '',
          asset.status,
          asset.location,
          asset.assignedTo || '',
          asset.purchaseDate,
          asset.purchasePrice,
          asset.currentValue,
          asset.vendor
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      },
      
      importFromCSV: (csvData) => {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const assets: Asset[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= headers.length - 1) {
            const asset: Asset = {
              id: values[0] || Date.now().toString(),
              name: values[1],
              category: values[2],
              serialNumber: values[3],
              rfidTag: values[4] || undefined,
              status: (values[5] as Asset['status']) || 'available',
              location: values[6],
              assignedTo: values[7] || undefined,
              purchaseDate: values[8],
              purchasePrice: parseFloat(values[9]) || 0,
              currentValue: parseFloat(values[10]) || 0,
              vendor: values[11],
              warranty: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            assets.push(asset);
          }
        }
        
        set((state) => ({
          assets: [...state.assets, ...assets]
        }));
      }
    }),
    {
      name: 'asset-storage'
    }
  )
);
