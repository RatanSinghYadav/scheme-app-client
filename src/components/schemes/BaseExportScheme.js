import React, { useState } from 'react';
import { 
  Button, 
  Modal, 
  Radio, 
  Space, 
  Typography, 
  Alert, 
  Spin 
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { url } from '../../utils/constent';

const { Title, Text } = Typography;

const ExportScheme = ({ schemeId, schemeName }) => {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call the export API with the correct format
      const response = await fetch(`${url}/api/base/schemes/export/${schemeId}?format=${exportFormat}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export scheme');
      }
      
      // Handle file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Scheme_${schemeName}.${exportFormat === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export scheme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        type="default" 
        icon={<DownloadOutlined />} 
        onClick={handleOpen}
      >
        Export
      </Button>
      
      <Modal
        title="Export Scheme"
        open={open}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
          <Button 
            key="export" 
            type="primary" 
            onClick={handleExport}
            loading={loading}
          >
            Export
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Export scheme {schemeName} as:</Text>
          
          <Radio.Group 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="excel">Excel (.xlsx)</Radio>
              <Radio value="pdf">PDF Document (.pdf)</Radio>
            </Space>
          </Radio.Group>
          
          {error && (
            <Alert 
              message="Export Error" 
              description={error} 
              type="error" 
              showIcon 
            />
          )}
          
          {success && (
            <Alert 
              message="Export Successful" 
              description="Your file is being downloaded." 
              type="success" 
              showIcon 
            />
          )}
        </Space>
      </Modal>
    </>
  );
};

export default ExportScheme;