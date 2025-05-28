
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Play, 
  Database,
  Cloud,
  Server,
  Terminal,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DeploymentScripts = () => {
  const { toast } = useToast();

  const awsSetupScript = `#!/bin/bash
# AWS RDS MySQL Setup Script for Asset Management System
# Run this script to set up AWS infrastructure

echo "Setting up AWS RDS MySQL database..."

# Create RDS MySQL instance
aws rds create-db-instance \\
    --db-instance-identifier asset-management-db \\
    --db-instance-class db.t3.micro \\
    --engine mysql \\
    --engine-version 8.0.35 \\
    --master-username assetadmin \\
    --master-user-password "SecurePass123!" \\
    --allocated-storage 20 \\
    --storage-type gp2 \\
    --vpc-security-group-ids sg-xxxxxxxxx \\
    --db-subnet-group-name default \\
    --backup-retention-period 7 \\
    --storage-encrypted \\
    --no-multi-az \\
    --publicly-accessible

echo "Waiting for RDS instance to be available..."
aws rds wait db-instance-available --db-instance-identifier asset-management-db

echo "Getting RDS endpoint..."
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier asset-management-db --query 'DBInstances[0].Endpoint.Address' --output text)

echo "RDS MySQL instance created successfully!"
echo "Endpoint: $RDS_ENDPOINT"
echo "Username: assetadmin"
echo "Database: assetmanagement"

# Create S3 bucket for file storage
aws s3 mb s3://asset-management-files-$(date +%s)

echo "AWS infrastructure setup complete!"
`;

  const mysqlSetupScript = `#!/bin/bash
# MySQL Database Setup Script
# Creates the database schema for Asset Management System

mysql -u root -p << 'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS assetmanagement;
USE assetmanagement;

-- Create users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    department VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    INDEX idx_employee_id (employee_id)
);

-- Create roles table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create locations table
CREATE TABLE locations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    zip VARCHAR(20),
    parent_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_parent_id (parent_id),
    FOREIGN KEY (parent_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- Create assets table
CREATE TABLE assets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE,
    category_id VARCHAR(36) NOT NULL,
    status ENUM('available', 'in-use', 'maintenance', 'retired') DEFAULT 'available',
    location_id VARCHAR(36) NOT NULL,
    assigned_to VARCHAR(36),
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    vendor VARCHAR(255),
    warranty_months INT,
    notes TEXT,
    last_audit_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asset_tag (asset_tag),
    INDEX idx_serial_number (serial_number),
    INDEX idx_rfid_tag (rfid_tag),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_location_id (location_id),
    INDEX idx_assigned_to (assigned_to),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    asset_id VARCHAR(36),
    action VARCHAR(50) NOT NULL,
    description TEXT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_asset_id (asset_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
);

-- Create asset_requests table
CREATE TABLE asset_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    requested_by VARCHAR(36) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    justification TEXT NOT NULL,
    urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'approved', 'rejected', 'fulfilled') DEFAULT 'pending',
    approved_by VARCHAR(36),
    approved_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_requested_by (requested_by),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default roles
INSERT INTO roles (id, name, description, permissions, is_system_role) VALUES
('super-admin', 'Super Administrator', 'Full system access', '["all"]', TRUE),
('admin', 'Administrator', 'Administrative access', '["assets.*", "users.*", "roles.*", "reports.*"]', TRUE),
('manager', 'Asset Manager', 'Asset and user management', '["assets.create", "assets.read", "assets.update", "assets.checkout", "assets.checkin", "users.read", "reports.assets"]', TRUE),
('operator', 'Asset Operator', 'Basic asset operations', '["assets.read", "assets.checkout", "assets.checkin", "rfid.scan"]', TRUE),
('viewer', 'Asset Viewer', 'Read-only access', '["assets.read", "reports.assets"]', TRUE);

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
('IT Equipment', 'Computers, laptops, servers', '#3B82F6', 'laptop'),
('Office Furniture', 'Desks, chairs, cabinets', '#10B981', 'chair'),
('Vehicles', 'Company cars, trucks', '#F59E0B', 'car');

-- Insert default locations
INSERT INTO locations (name, address, city, state, country) VALUES
('Headquarters', '123 Business Ave', 'New York', 'NY', 'USA'),
('Branch Office', '456 Commerce St', 'Los Angeles', 'CA', 'USA'),
('Warehouse', '789 Storage Blvd', 'Chicago', 'IL', 'USA');

-- Create default admin user (password: admin123)
INSERT INTO users (email, name, role_id, password_hash) VALUES
('admin@company.com', 'System Administrator', 'super-admin', '$2b$10$hash_here');

COMMIT;
EOF

echo "MySQL database setup complete!"
echo "Default admin user: admin@company.com"
echo "Default password: admin123"
`;

  const dockerSetupScript = `#!/bin/bash
# Docker Setup Script for Asset Management System

echo "Setting up Docker environment..."

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: assetmanagement
      MYSQL_USER: assetuser
      MYSQL_PASSWORD: assetpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://assetuser:assetpassword@mysql:3306/assetmanagement
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mysql
      - redis

volumes:
  mysql_data:
EOF

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

echo "Docker setup complete!"
echo "Run 'docker-compose up -d' to start the services"
`;

  const downloadScript = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Script Downloaded",
      description: `${filename} has been downloaded successfully`
    });
  };

  const scripts = [
    {
      id: 'aws',
      name: 'AWS RDS MySQL Setup',
      description: 'Sets up AWS RDS MySQL instance and S3 bucket',
      icon: <Cloud className="h-5 w-5" />,
      content: awsSetupScript,
      filename: 'setup-aws.sh'
    },
    {
      id: 'mysql',
      name: 'MySQL Database Schema',
      description: 'Creates database tables and default data',
      icon: <Database className="h-5 w-5" />,
      content: mysqlSetupScript,
      filename: 'setup-mysql.sh'
    },
    {
      id: 'docker',
      name: 'Docker Setup',
      description: 'Docker containerization setup',
      icon: <Server className="h-5 w-5" />,
      content: dockerSetupScript,
      filename: 'setup-docker.sh'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deployment Scripts</h1>
          <p className="text-gray-600 mt-2">
            Download and run deployment scripts for AWS, MySQL, and Docker
          </p>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Deployment Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Before Running Scripts:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Ensure AWS CLI is configured with proper credentials</li>
              <li>• Have MySQL installed and running locally (for local setup)</li>
              <li>• Docker and Docker Compose installed (for containerization)</li>
              <li>• Review and modify scripts according to your environment</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Deployment Order:</h3>
            <ol className="space-y-1 text-sm">
              <li>1. Run AWS setup script for cloud infrastructure</li>
              <li>2. Run MySQL setup script to create database schema</li>
              <li>3. Configure environment variables in your application</li>
              <li>4. Deploy application using Docker or your preferred method</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scripts.map((script) => (
          <Card key={script.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {script.icon}
                <span>{script.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{script.description}</p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => downloadScript(script.filename, script.content)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {script.filename}
                </Button>
              </div>
              
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium flex items-center space-x-1">
                  <Terminal className="h-4 w-4" />
                  <span>View Script Content</span>
                </summary>
                <Textarea
                  value={script.content}
                  readOnly
                  className="mt-2 font-mono text-xs h-40"
                />
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Required Environment Variables:</h3>
            <Textarea
              readOnly
              value={`# Database Configuration
DATABASE_URL=mysql://username:password@hostname:3306/assetmanagement

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-asset-files-bucket

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Application Configuration
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123

# RFID Configuration
RFID_READER_PORT=/dev/ttyUSB0
RFID_READER_BAUDRATE=9600`}
              className="font-mono text-xs h-64"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentScripts;
