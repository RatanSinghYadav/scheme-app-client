import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  Table,
  Tag,
  Space,
  Spin,
  Row,
  Col,
  message,
  Input,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import ExportScheme from '../components/schemes/ExportScheme';
import { formatDate, searchSchemes, filterSchemesByStatus } from '../utils/helpers';
import { url } from '../utils/constent';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const SchemeList = () => {
  const { hasRole, currentUser } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Load schemes from API
  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Get schemes from real API
        const response = await fetch(`${url}/api/schemes/getAllSchemes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Schemes data:', data);

        if (data.success) {
          // Transform data to match the expected format
          const formattedSchemes = data.data.map(scheme => {
            // Try to get user name from createdBy if it's an object
            let createdByName = 'Unknown';
            if (scheme.createdBy) {
              if (typeof scheme.createdBy === 'object' && scheme.createdBy.name) {
                createdByName = scheme.createdBy.name;
              } else if (typeof scheme.createdBy === 'string') {
                createdByName = scheme.createdBy;
              }
            }
            
            return {
              id: scheme.schemeCode,
              distributorName: scheme.distributors && scheme.distributors.length > 0 
                ? scheme.distributors[0].name || 'Unknown' 
                : 'Unknown',
              distributorCode: scheme.distributors && scheme.distributors.length > 0 
                ? scheme.distributors[0].code || '' 
                : '',
              city: scheme.distributors && scheme.distributors.length > 0 
                ? scheme.distributors[0].city || '' 
                : '',
              startDate: formatDate(scheme.startDate),
              endDate: formatDate(scheme.endDate),
              status: scheme.status === 'pending' 
                ? 'Pending Verification' 
                : scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1),
              // Add distributor and product counts
              distributorCount: scheme.distributors ? scheme.distributors.length : 0,
              productCount: scheme.products ? scheme.products.length : 0,
              // Use createdDate instead of createdAt
              createdAt: scheme.createdDate || scheme.createdAt,
              updatedAt: scheme.updatedAt,
              products: scheme.products || [],
              createdBy: createdByName
            };
          });
          
          setSchemes(formattedSchemes);
          setFilteredSchemes(formattedSchemes);
        } else {
          message.error(data.error || 'Failed to load schemes');
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);
        message.error('Failed to load schemes: ' + error.message);

        // Clear schemes if API fails
        setSchemes([]);
        setFilteredSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Apply search filter
  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, dateRange);
  };

  // Apply date range filter
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(searchText, dates);
  };

  // Apply all filters
  const applyFilters = (search, dates) => {
    let filtered = [...schemes];

    // Apply search filter
    if (search) {
      filtered = searchSchemes(filtered, search);
    }

    // Apply date filters
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].startOf('day').toDate();
      const end = dates[1].endOf('day').toDate();

      filtered = filtered.filter(scheme => {
        const schemeDate = new Date(scheme.startDate.split('-').reverse().join('-'));
        return schemeDate >= start && schemeDate <= end;
      });
    }

    setFilteredSchemes(filtered);
  };

  // Handle status filter in the table
  const handleStatusFilter = (value, record) => {
    return record.status === value;
  };

  const columns = [
    {
      title: 'Scheme Code',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Link to={`/schemes/${text}`}>{text}</Link>,
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
      dataIndex: 'distributor',
      key: 'distributor',
      render: (_, record) => (
          <Tag color="blue">{`${record.distributorCount} Distributors`}</Tag>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text) => text || 'Unknown',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        if (!text) return 'N/A';
        try {
          return formatDate(text);
        } catch (e) {
          console.error('Error formatting date:', e, text);
          return 'Invalid Date';
        }
      },
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => (
          <Tag color="cyan">{`${record.productCount} Products`}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Verified', value: 'Verified' },
        { text: 'Pending Verification', value: 'Pending Verification' },
        { text: 'Rejected', value: 'Rejected' }
      ],
      onFilter: handleStatusFilter,
      render: (status) => (
        <Tag color={
          status === 'Verified' ? 'green' :
            status === 'Pending Verification' ? 'warning' :
              status === 'Rejected' ? 'error' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Link to={`/schemes/${record.id}`}>
            <Button type="link" size="small">View</Button>
          </Link>
          <ExportScheme schemeId={record.id} schemeName={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Schemes</Title>
          </Col>
          <Col>
            {hasRole('creator') && (
              <Link to="/schemes/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  Create Scheme
                </Button>
              </Link>
            )}
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Input
              placeholder="Search schemes..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Start date', 'End date']}
              onChange={handleDateRangeChange}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredSchemes}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default SchemeList;