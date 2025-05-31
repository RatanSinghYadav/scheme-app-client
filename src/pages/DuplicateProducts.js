import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Card,
  Table,
  Space,
  Spin,
  Row,
  Col,
  message,
  Select,
  Button,
  Divider,
  Tag,
  Collapse,
  Statistic,
  Radio,
  Popconfirm,
  Modal
} from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '../services/api';
// Removed: import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { confirm } = Modal;

const DuplicateProducts = () => {
  // Removed: const { hasRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [criteria, setCriteria] = useState('itemid');
  const [stats, setStats] = useState({
    totalDuplicates: 0,
    uniqueGroupsCount: 0
  });
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  const findDuplicates = async () => {
    setLoading(true);
    try {
      const result = await api.findDuplicateProducts(criteria);
      setDuplicates(result.data);
      setStats({
        totalDuplicates: result.totalDuplicates,
        uniqueGroupsCount: result.uniqueGroupsCount
      });
      // Reset selections when criteria changes
      setSelectedProducts({});
    } catch (error) {
      message.error('Problem finding duplicate products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findDuplicates();
  }, [criteria]);

  useEffect(() => {
    console.log('Selected products updated:', selectedProducts);
  }, [selectedProducts]);

  const handleProductSelect = (groupId, productId) => {
    console.log('Selected product - groupId:', groupId, 'productId:', productId);
    console.log('Current selectedProducts before update:', selectedProducts);
    setSelectedProducts(prevState => {
      const newState = {
        ...prevState,
        [groupId]: productId
      };
      console.log('New selectedProducts state:', newState);
      return newState;
    });
  };

  const handleDeleteDuplicates = (groupId, products) => {
    const keepId = selectedProducts[groupId];
    console.log('Deleting duplicates - groupId:', groupId);
    console.log('Products to process:', products);
    console.log('Current selectedProducts:', selectedProducts);
    console.log('Keep product ID:', keepId);
    
    if (!keepId) {
      message.warning('Please select a product to keep before deleting duplicates');
      return;
    }

    confirm({
      title: 'Are you sure you want to delete the duplicate products?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All duplicates except the selected product will be permanently deleted.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setLoading(true);
          const productIds = products.map(p => p._id);
          console.log('Product IDs to delete:', productIds);
          console.log('Keep ID:', keepId);
          
          const result = await api.deleteDuplicateProducts(productIds, keepId);
          console.log('API response:', result);
          message.success(`Successfully deleted ${result.data.deletedCount} duplicate products`);
          // Refresh the duplicate list
          findDuplicates();
        } catch (error) {
          console.error('Error details:', error);
          message.error('Failed to delete duplicates: ' + error.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      title: 'ITEMID',
      dataIndex: 'ITEMID',
      key: 'ITEMID',
    },
    {
      title: 'ITEMNAME',
      dataIndex: 'ITEMNAME',
      key: 'ITEMNAME',
    },
    {
      title: 'BRANDNAME',
      dataIndex: 'BRANDNAME',
      key: 'BRANDNAME',
    },
    {
      title: 'Style',
      dataIndex: 'Style',
      key: 'Style',
    },
    {
      title: 'PACKTYPE',
      dataIndex: 'PACKTYPE',
      key: 'PACKTYPE',
    },
    {
      title: 'Configuration',
      dataIndex: 'Configuration',
      key: 'Configuration',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => {
        const groupId = typeof record._id === 'object' 
          ? `${record._id.itemId}_${record._id.style}` 
          : record._id;
        
        // डीबगिंग के लिए _id के प्रकार की जांच करें
        console.log('Product row - record._id type:', typeof record._id);
        console.log('Product row - record._id value:', record._id);
        console.log('Product row - groupId:', groupId);
        
        return (
          <Radio 
            checked={selectedProducts[groupId] === record._id}
            onChange={() => handleProductSelect(groupId, record._id)}
          >
            Keep this
          </Radio>
        );
      }
    }
  ];

  const expandedRowRender = (record) => {
    const groupId = typeof record._id === 'object' 
      ? `${record._id.itemId}_${record._id.style}` 
      : record._id;

    // प्रत्येक प्रोडक्ट में groupId शामिल करें
    const productsWithGroupId = record.products.map(product => ({
      ...product,
      groupId // प्रत्येक प्रोडक्ट में groupId जोड़ें
    }));

    return (
      <div>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Popconfirm
            title="Delete all duplicates except the selected product?"
            onConfirm={() => handleDeleteDuplicates(groupId, record.products)}
            okText="Yes"
            cancelText="No"
            disabled={!selectedProducts[groupId]}
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              disabled={!selectedProducts[groupId]}
            >
              Delete Duplicates
            </Button>
          </Popconfirm>
        </div>
        <Table
          columns={columns}
          dataSource={productsWithGroupId} // यहां productsWithGroupId का उपयोग करें
          pagination={false}
          rowKey="_id"
          size="small"
        />
      </div>
    );
  };

  const groupColumns = [
    {
      title: 'Duplicate Value',
      dataIndex: '_id',
      key: '_id',
      render: (id) => {
        if (typeof id === 'object') {
          if (id.config) {
            return (
              <span>
                ITEMID: <Tag color="blue">{id.itemId}</Tag> 
                Style: <Tag color="green">{id.style}</Tag>
                Configuration: <Tag color="purple">{id.config}</Tag>
              </span>
            );
          } else if (id.style) {
            return (
              <span>
                ITEMID: <Tag color="blue">{id.itemId}</Tag> 
                Style: <Tag color="green">{id.style}</Tag>
              </span>
            );
          }
        }
        return <Tag color="blue">{id}</Tag>;
      }
    },
    {
      title: 'Number of Products',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        // record से सीधे groupId प्राप्ह करें
        const groupId = record.groupId || (typeof record._id === 'object' 
          ? `${record._id.itemId}_${record._id.style}` 
          : record._id);
        
        return (
          // columns में Radio बटन के लिए
          <Radio 
            checked={String(selectedProducts[groupId]) === String(record._id)}
            onChange={() => handleProductSelect(groupId, record._id)}
          >
            Keep this
          </Radio>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Duplicate Products</Title>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Text strong>Search Criteria:</Text>
            <Select
              style={{ width: 200, marginLeft: 10 }}
              value={criteria}
              onChange={(value) => setCriteria(value)}
            >
              <Option value="itemid">Based on ITEMID</Option>
              <Option value="itemid_style">Based on ITEMID and Style</Option>
              <Option value="itemname">Based on ITEMNAME</Option>
              <Option value="itemid_style_config">Based on ITEMID, Style and Configuration</Option>
            </Select>
          </Col>
          <Col span={12}>
            <Space>
              <Button type="primary" onClick={findDuplicates} icon={<ReloadOutlined />} loading={loading}>
                Find Duplicate Products
              </Button>
              {/* Removed admin-only warning */}
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total Duplicate Products"
                value={stats.totalDuplicates}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Duplicate Groups"
                value={stats.uniqueGroupsCount}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={groupColumns}
            dataSource={duplicates}
            rowKey={(record) => 
              typeof record._id === 'object' 
                ? `${record._id.itemId}_${record._id.style}` 
                : record._id
            }
            expandable={{
              expandedRowRender,
              onExpand: (expanded, record) => {
                const groupId = typeof record._id === 'object' 
                  ? `${record._id.itemId}_${record._id.style}` 
                  : record._id;
                
                if (expanded) {
                  setExpandedGroups([...expandedGroups, groupId]);
                } else {
                  setExpandedGroups(expandedGroups.filter(id => id !== groupId));
                }
              }
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default DuplicateProducts;