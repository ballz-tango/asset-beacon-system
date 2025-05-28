
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface SettingsFormProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSave?: () => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ title, icon, children, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {onSave && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({ label, description, children }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label>{label}</Label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
};

interface SettingFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
}

export const SettingField: React.FC<SettingFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  placeholder 
}) => {
  return (
    <div>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <Input
        id={label.toLowerCase().replace(/\s+/g, '-')}
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

interface SettingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; }[];
}

export const SettingSelect: React.FC<SettingSelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface SettingSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({ 
  label, 
  description, 
  checked, 
  onChange 
}) => {
  return (
    <SettingItem label={label} description={description}>
      <Switch checked={checked} onCheckedChange={onChange} />
    </SettingItem>
  );
};
