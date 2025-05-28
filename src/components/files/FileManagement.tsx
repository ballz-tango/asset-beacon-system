
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Trash2, 
  File, 
  Folder,
  Search,
  Filter,
  Image,
  FileText,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  assetId?: string;
  tags: string[];
}

const FileManagement = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Asset Manual - Laptop Dell XPS.pdf',
      type: 'file',
      size: 2048576,
      mimeType: 'application/pdf',
      uploadedBy: 'admin@company.com',
      uploadedAt: '2024-01-15T10:30:00Z',
      assetId: 'asset-001',
      tags: ['manual', 'laptop', 'dell']
    },
    {
      id: '2',
      name: 'Warranty Documents',
      type: 'folder',
      size: 0,
      mimeType: '',
      uploadedBy: 'admin@company.com',
      uploadedAt: '2024-01-10T09:00:00Z',
      tags: ['warranty', 'documents']
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, type: string) => {
    if (type === 'folder') return <Folder className="h-5 w-5 text-blue-500" />;
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    if (mimeType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(file => {
        const newFile: FileItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          uploadedBy: 'current-user@company.com',
          uploadedAt: new Date().toISOString(),
          tags: []
        };
        setFiles(prev => [...prev, newFile]);
      });
      
      toast({
        title: "Files Uploaded",
        description: `${uploadedFiles.length} file(s) uploaded successfully`
      });
    }
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Deleted",
      description: "File has been removed successfully"
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
          <p className="text-gray-600 mt-2">
            Manage asset-related documents and files
          </p>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.mimeType, file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.type === 'file' && (
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {file.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Uploaded by {file.uploadedBy}</p>
                  <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex space-x-1 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-6">
              Upload files or adjust your search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileManagement;
