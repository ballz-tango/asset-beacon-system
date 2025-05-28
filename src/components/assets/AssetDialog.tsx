
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAssetStore, Asset } from '@/stores/assetStore';
import { useToast } from '@/hooks/use-toast';

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset | null;
}

const AssetDialog: React.FC<AssetDialogProps> = ({ isOpen, onClose, asset }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    serialNumber: '',
    rfidTag: '',
    status: 'available' as Asset['status'],
    location: '',
    assignedTo: '',
    purchaseDate: new Date(),
    purchasePrice: 0,
    currentValue: 0,
    vendor: '',
    warranty: '',
    notes: ''
  });
  
  const { addAsset, updateAsset, categories } = useAssetStore();
  const { toast } = useToast();

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        serialNumber: asset.serialNumber,
        rfidTag: asset.rfidTag || '',
        status: asset.status,
        location: asset.location,
        assignedTo: asset.assignedTo || '',
        purchaseDate: new Date(asset.purchaseDate),
        purchasePrice: asset.purchasePrice,
        currentValue: asset.currentValue,
        vendor: asset.vendor,
        warranty: asset.warranty,
        notes: asset.notes || ''
      });
    } else {
      // Reset form for new asset
      setFormData({
        name: '',
        category: categories[0]?.name || '',
        serialNumber: '',
        rfidTag: '',
        status: 'available',
        location: '',
        assignedTo: '',
        purchaseDate: new Date(),
        purchasePrice: 0,
        currentValue: 0,
        vendor: '',
        warranty: '',
        notes: ''
      });
    }
  }, [asset, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assetData = {
      ...formData,
      purchaseDate: formData.purchaseDate.toISOString(),
      rfidTag: formData.rfidTag || undefined,
      assignedTo: formData.assignedTo || undefined,
      notes: formData.notes || undefined
    };

    if (asset) {
      updateAsset(asset.id, assetData);
      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully"
      });
    } else {
      addAsset(assetData);
      toast({
        title: "Asset Created",
        description: "New asset has been added to the system"
      });
    }
    
    onClose();
  };

  const generateSerialNumber = () => {
    const prefix = formData.category.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    setFormData({ ...formData, serialNumber: `${prefix}${timestamp}` });
  };

  const generateRFIDTag = () => {
    const rfidTag = `RF${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setFormData({ ...formData, rfidTag });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter asset name"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <div className="flex space-x-2">
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  required
                  placeholder="Enter serial number"
                />
                <Button type="button" variant="outline" onClick={generateSerialNumber}>
                  Generate
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="rfidTag">RFID Tag</Label>
              <div className="flex space-x-2">
                <Input
                  id="rfidTag"
                  value={formData.rfidTag}
                  onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                  placeholder="Enter RFID tag"
                />
                <Button type="button" variant="outline" onClick={generateRFIDTag}>
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Status and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Asset['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Office A, Warehouse 1"
              />
            </div>
            
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Person or department"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.purchaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.purchaseDate ? format(formData.purchaseDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.purchaseDate}
                    onSelect={(date) => date && setFormData({ ...formData, purchaseDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>
            
            <div>
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="e.g., 2 years, Expired"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this asset"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {asset ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDialog;
