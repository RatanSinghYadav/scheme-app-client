import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Button,
  Card,
  Table,
  Space,
  Spin,
  Row,
  Col,
  message,
  Input,
  Modal,
  Form,
  Popconfirm,
  Select
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const DistributorManagement = () => {
  const { hasRole } = useContext(AuthContext);
  const [distributors, setDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [form] = Form.useForm();

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
  });

  // Load distributors from API
  useEffect(() => {
    fetchDistributors();
  }, []);

  // Filter distributors when search text changes
  useEffect(() => {
    if (searchText) {
      const filtered = distributors.filter(distributor => 
        (distributor.ORGANIZATIONNAME && distributor.ORGANIZATIONNAME.toLowerCase().includes(searchText.toLowerCase())) ||
        (distributor.SMCODE && distributor.SMCODE.toLowerCase().includes(searchText.toLowerCase())) ||
        (distributor.CUSTOMERACCOUNT && distributor.CUSTOMERACCOUNT.toLowerCase().includes(searchText.toLowerCase())) ||
        (distributor.ADDRESSCITY && distributor.ADDRESSCITY.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredDistributors(filtered);
      setPagination(prev => ({
        ...prev,
        total: filtered.length,
        current: 1
      }));
    } else {
      setFilteredDistributors(distributors);
      setPagination(prev => ({
        ...prev,
        total: distributors.length
      }));
    }
  }, [searchText, distributors]);

  const fetchDistributors = async () => {
    setLoading(true);
    try {
      const data = await api.getDistributors();
      setDistributors(data);
      setFilteredDistributors(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('Failed to fetch distributors: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showAddModal = () => {
    setEditingDistributor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (distributor) => {
    setEditingDistributor(distributor);
    form.setFieldsValue({
      SMCODE: distributor.SMCODE,
      CUSTOMERACCOUNT: distributor.CUSTOMERACCOUNT,
      ORGANIZATIONNAME: distributor.ORGANIZATIONNAME,
      ADDRESSCITY: distributor.ADDRESSCITY,
      CUSTOMERGROUPID: distributor.CUSTOMERGROUPID
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingDistributor) {
        // Update existing distributor
        await api.updateDistributor(editingDistributor._id, values);
        message.success('Distributor updated successfully');
      } else {
        // Create new distributor
        await api.createDistributor(values);
        message.success('Distributor created successfully');
      }
      
      setIsModalVisible(false);
      fetchDistributors();
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteDistributor(id);
      message.success('Distributor deleted successfully');
      fetchDistributors();
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'SM Code',
      dataIndex: 'SMCODE',
      key: 'SMCODE',
      sorter: (a, b) => (a.SMCODE || '').localeCompare(b.SMCODE || '')
    },
    {
      title: 'Customer Account',
      dataIndex: 'CUSTOMERACCOUNT',
      key: 'CUSTOMERACCOUNT',
      sorter: (a, b) => (a.CUSTOMERACCOUNT || '').localeCompare(b.CUSTOMERACCOUNT || '')
    },
    {
      title: 'Organization Name',
      dataIndex: 'ORGANIZATIONNAME',
      key: 'ORGANIZATIONNAME',
      sorter: (a, b) => (a.ORGANIZATIONNAME || '').localeCompare(b.ORGANIZATIONNAME || '')
    },
    {
      title: 'City',
      dataIndex: 'ADDRESSCITY',
      key: 'ADDRESSCITY',
      sorter: (a, b) => (a.ADDRESSCITY || '').localeCompare(b.ADDRESSCITY || '')
    },
    {
      title: 'Customer Group ID',
      dataIndex: 'CUSTOMERGROUPID',
      key: 'CUSTOMERGROUPID',
      sorter: (a, b) => (a.CUSTOMERGROUPID || '').localeCompare(b.CUSTOMERGROUPID || '')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            disabled={!hasRole('admin')}
          />
          <Popconfirm
            title="Are you sure you want to delete this distributor?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={!hasRole('admin')}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              disabled={!hasRole('admin')}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="distributor-management-container">
      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={2}>Distributor Management</Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search distributors"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                style={{ width: 250 }}
              />
              {hasRole('admin') && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showAddModal}
                >
                  Add Distributor
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredDistributors}
            rowKey="_id"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingDistributor ? 'Edit Distributor' : 'Add Distributor'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {editingDistributor ? 'Update' : 'Create'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="SMCODE"
            label="SM Code"
            rules={[{ required: true, message: 'Please enter SM Code' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="CUSTOMERACCOUNT"
            label="Customer Account"
            rules={[{ required: true, message: 'Please enter Customer Account' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ORGANIZATIONNAME"
            label="Organization Name"
            rules={[{ required: true, message: 'Please enter Organization Name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ADDRESSCITY"
            label="City"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="CUSTOMERGROUPID"
            label="Customer Group ID"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DistributorManagement;