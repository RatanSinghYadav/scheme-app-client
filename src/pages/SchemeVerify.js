import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Card, 
  Descriptions, 
  Tag, 
  Divider, 
  Row, 
  Col, 
  Alert
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { api } from '../services/api';

const { TextArea } = Input;
const { confirm } = Modal;

// Mock data for pending schemes
const pendingSchemes = [
  {
    id: 'SCHM00000135',
    startDate: '10-04-2025',
    endDate: '10-04-2025',
    distributorGroup: 'A Pair UK',
    distributorCode: 'BR-CG-DI-000063',
    distributorName: 'GURUNANAK ENTERPRISES DINESHPUR',
    city: 'Dineshpur',
    status: 'Pending Verification',
    createdBy: 'john.doe',
    createdDate: '15-03-2023',
    items: [
      { itemCode: 'FG050255', itemName: 'Charged by Thums up 250 ML PET X 30', brand: 'CHARGED BY THUMUPS', packType: 'PET', mrp: 35, discountPrice: 30 },
      { itemCode: 'FG030252', itemName: 'Sprite 250ML PET X30', brand: 'Sprite', packType: 'PET', mrp: 25, discountPrice: 22 },
      { itemCode: 'FG050252', itemName: 'Thums Up 250ML PET X30', brand: 'Thums-Up', packType: 'PET', mrp: 35, discountPrice: 30 }
    ]
  }
];

const SchemeVerify = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    // Load pending schemes from both mock data and local storage
    const fetchPendingSchemes = async () => {
      try {
        // Get schemes from mock data
        let mockPendingSchemes = [];
        try {
          mockPendingSchemes = await api.getPendingSchemes();
        } catch (error) {
          console.error('Error fetching from API, using local mock data:', error);
          mockPendingSchemes = pendingSchemes; // फॉलबैक के रूप में लोकल मॉक डेटा का उपयोग करें
        }
        
        // Get schemes from local storage
        const localSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
        const localPendingSchemes = localSchemes.filter(
          scheme => scheme.status === 'Pending Verification'
        );
        
        // Combine both sources (avoiding duplicates by ID)
        const allPendingSchemes = [...mockPendingSchemes];
        
        // Add local schemes that don't exist in mock data
        localPendingSchemes.forEach(localScheme => {
          if (!allPendingSchemes.some(scheme => scheme.id === localScheme.id)) {
            // Make sure items array exists
            if (!localScheme.items && localScheme.products) {
              localScheme.items = localScheme.products;
            } else if (!localScheme.items) {
              localScheme.items = [];
            }
            allPendingSchemes.push(localScheme);
          }
        });
        
        setSchemes(allPendingSchemes);
      } catch (error) {
        console.error('Error in fetchPendingSchemes:', error);
        
        // Fallback to local storage and mock data
        const localSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
        const localPendingSchemes = localSchemes.filter(
          scheme => scheme.status === 'Pending Verification'
        ).map(scheme => {
          // Make sure items array exists
          if (!scheme.items && scheme.products) {
            scheme.items = scheme.products;
          } else if (!scheme.items) {
            scheme.items = [];
          }
          return scheme;
        });
        
        setSchemes([...pendingSchemes, ...localPendingSchemes]);
      }
    };

    fetchPendingSchemes();
  }, []);

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
    setDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
    setSelectedScheme(null);
  };

  const showApproveConfirm = () => {
    confirm({
      title: 'Approve Scheme',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to approve scheme ${selectedScheme?.id}? Once approved, the scheme will be available for export.`,
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        handleApprove();
      }
    });
  };

  const handleOpenRejectModal = () => {
    setRejectModalVisible(true);
  };

  const handleCloseRejectModal = () => {
    setRejectModalVisible(false);
    setRejectReason('');
  };

  const handleApprove = async () => {
    // In a real app, this would send data to an API
    console.log('Approving scheme:', selectedScheme.id);
    
    try {
      // Call API to approve the scheme
      await api.approveScheme(selectedScheme.id);
      
      // Update local state
      const updatedSchemes = schemes.filter(scheme => scheme.id !== selectedScheme.id);
      setSchemes(updatedSchemes);
      
      // Update scheme status in local storage
      const localSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
      const updatedLocalSchemes = localSchemes.map(scheme => {
        if (scheme.id === selectedScheme.id) {
          return { 
            ...scheme, 
            status: 'Verified',
            verifiedBy: 'admin',
            verifiedDate: new Date().toISOString()
          };
        }
        return scheme;
      });
      localStorage.setItem('schemes', JSON.stringify(updatedLocalSchemes));
      
      // Update mock data if it exists there
      if (pendingSchemes.some(scheme => scheme.id === selectedScheme.id)) {
        const schemeIndex = pendingSchemes.findIndex(scheme => scheme.id === selectedScheme.id);
        if (schemeIndex !== -1) {
          pendingSchemes[schemeIndex].status = 'Verified';
        }
      }
      
      setDetailsVisible(false);
      setSelectedScheme(null);
      
      // Show success message
      Modal.success({
        title: 'Scheme Approved',
        content: `Scheme ${selectedScheme.id} has been approved and is now ready for export.`,
      });
    } catch (error) {
      console.error('Error approving scheme:', error);
      
      // Show error message
      Modal.error({
        title: 'Approval Failed',
        content: `Failed to approve scheme ${selectedScheme.id}. Please try again.`,
      });
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      return;
    }
    
    // In a real app, this would send data to an API
    console.log('Rejecting scheme:', selectedScheme.id, 'Reason:', rejectReason);
    
    try {
      // Call API to reject the scheme
      await api.rejectScheme(selectedScheme.id, rejectReason);
      
      // Update local state
      const updatedSchemes = schemes.filter(scheme => scheme.id !== selectedScheme.id);
      setSchemes(updatedSchemes);
      
      // Update scheme status in local storage
      const localSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
      const updatedLocalSchemes = localSchemes.map(scheme => {
        if (scheme.id === selectedScheme.id) {
          return { 
            ...scheme, 
            status: 'Rejected',
            rejectionReason: rejectReason,
            rejectedBy: 'admin',
            rejectedDate: new Date().toISOString()
          };
        }
        return scheme;
      });
      localStorage.setItem('schemes', JSON.stringify(updatedLocalSchemes));
      
      // Update mock data if it exists there
      if (pendingSchemes.some(scheme => scheme.id === selectedScheme.id)) {
        const schemeIndex = pendingSchemes.findIndex(scheme => scheme.id === selectedScheme.id);
        if (schemeIndex !== -1) {
          pendingSchemes[schemeIndex].status = 'Rejected';
          pendingSchemes[schemeIndex].rejectionReason = rejectReason;
        }
      }
      
      setRejectModalVisible(false);
      setDetailsVisible(false);
      setSelectedScheme(null);
      setRejectReason('');
      
      // Show success message
      Modal.success({
        title: 'Scheme Rejected',
        content: `Scheme ${selectedScheme.id} has been rejected.`,
      });
    } catch (error) {
      console.error('Error rejecting scheme:', error);
      
      // Show error message
      Modal.error({
        title: 'Rejection Failed',
        content: `Failed to reject scheme ${selectedScheme.id}. Please try again.`,
      });
    }
  };

  const columns = [
    {
      title: 'Scheme Code',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Distributor',
      dataIndex: 'distributorName',
      key: 'distributorName',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => record.items.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Pack Type',
      dataIndex: 'packType',
      key: 'packType',
    },
    {
      title: 'MRP',
      dataIndex: 'mrp',
      key: 'mrp',
    },
    {
      title: 'Discount Price',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Typography.Title level={4} style={{ marginBottom: '16px' }}>
        Verify Schemes
      </Typography.Title>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={schemes} 
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No pending schemes to verify' }}
        />
      </Card>
      
      {/* Scheme Details Modal */}
      <Modal
        title={`Scheme Details: ${selectedScheme?.id}`}
        open={detailsVisible}
        onCancel={handleCloseDetails}
        width={1200}
        footer={[
          <Button key="close" onClick={handleCloseDetails}>
            Close
          </Button>,
          <Button 
            key="reject" 
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleOpenRejectModal}
          >
            Reject
          </Button>,
          <Button 
            key="approve" 
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={showApproveConfirm}
          >
            Approve
          </Button>,
        ]}
      >
        {selectedScheme && (
          <>
            <Card title="Basic Information" style={{ marginBottom: '16px' }}>
              <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="Scheme Code">{selectedScheme.id}</Descriptions.Item>
                <Descriptions.Item label="Start Date">{selectedScheme.startDate}</Descriptions.Item>
                <Descriptions.Item label="End Date">{selectedScheme.endDate}</Descriptions.Item>
                <Descriptions.Item label="Distributor">{selectedScheme.distributorName}</Descriptions.Item>
                <Descriptions.Item label="City">{selectedScheme.city}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color="warning">{selectedScheme.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created By">{selectedScheme.createdBy}</Descriptions.Item>
                <Descriptions.Item label="Created Date">{selectedScheme.createdDate}</Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Divider orientation="left">Products ({selectedScheme.items.length})</Divider>
            
            <Table 
              columns={itemColumns} 
              dataSource={selectedScheme.items} 
              rowKey="itemCode"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>
      
      {/* Reject Modal */}
      <Modal
        title="Reject Scheme"
        open={rejectModalVisible}
        onCancel={handleCloseRejectModal}
        footer={[
          <Button key="cancel" onClick={handleCloseRejectModal}>
            Cancel
          </Button>,
          <Button 
            key="reject" 
            type="primary" 
            danger
            onClick={handleReject}
            disabled={!rejectReason}
          >
            Reject
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="Please provide a reason for rejecting scheme"
            name="rejectReason"
            rules={[{ required: true, message: 'Please enter a rejection reason' }]}
          >
            <TextArea 
              rows={4} 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchemeVerify;