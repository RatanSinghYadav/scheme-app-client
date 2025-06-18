import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Spin,
  message
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { url } from '../utils/constent';
import { AuthContext } from '../context/AuthContext';

const CombinedSchemeSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('Authentication required');
        return;
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      const response = await fetch(`${url}/api/combined/schemes/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal // Add abort signal
      });

      // Clear timeout if request completes successfully
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        console.log('Setting summary data:', data.data);
        setSummary(data.data);
        if (!data.data || data.data.length === 0) {
          console.log('Warning: Empty data received from API');
        }
      } else {
        message.error(data.message || 'Failed to fetch summary');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);

      if (error.name === 'AbortError') {
        message.error('Request timeout - please try again');
      } else {
        message.error('Error fetching summary');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter summary based on search text
  const filteredSummary = summary.filter(item => {
    if (!item) return false; // Add null check
    
    return !searchText ||
      (item.salesDescription && item.salesDescription.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.salesCode && item.salesCode.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.salesType && item.salesType.toLowerCase().includes(searchText.toLowerCase()));
  });

  // Define table columns
  const columns = [
    {
      title: 'Customer Type',
      dataIndex: 'salesType',
      key: 'salesType',
      filters: [
        { text: 'Distributor', value: 'Distributor' },
        { text: 'Retailer', value: 'Retailer' },
      ],
      onFilter: (value, record) => record.salesType === value,
      render: type => <Tag color={type === 'Distributor' ? 'blue' : 'green'}>{type || 'N/A'}</Tag>,
    },
    {
      title: 'Customer Code',
      dataIndex: 'salesCode',
      key: 'salesCode',
      sorter: (a, b) => (a.salesCode && b.salesCode) ? a.salesCode.localeCompare(b.salesCode) : 0,
    },
    {
      title: 'Customer Name',
      dataIndex: 'salesDescription',
      key: 'salesDescription',
      sorter: (a, b) => (a.salesDescription && b.salesDescription) ? a.salesDescription.localeCompare(b.salesDescription) : 0,
    },
    {
      title: 'Total Schemes',
      dataIndex: 'totalSchemes',
      key: 'totalSchemes',
      sorter: (a, b) => a.totalSchemes - b.totalSchemes,
    },
    {
      title: 'Total Products',
      dataIndex: 'totalProducts',
      key: 'totalProducts',
      sorter: (a, b) => a.totalProducts - b.totalProducts,
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: value => `₹${(value || 0).toFixed(2)}`,
      sorter: (a, b) => (a.totalDiscount || 0) - (b.totalDiscount || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/combined/schemes/customer/${record.salesCode}/details`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              View Details
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Customer Scheme Summary" className="scheme-summary-card">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by customer name or code"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredSummary.map((item, index) => ({ ...item, key: item._id || index }))}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Spin>
    </Card>
  );
};

export default CombinedSchemeSummary;