import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Card, Table, Tag, Space, Spin, Row, Col, message, Input, DatePicker, Modal } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import ExportScheme from '../components/schemes/ExportScheme';
import { formatDate, searchSchemes, filterSchemesByStatus } from '../utils/helpers';
import { url } from '../utils/constent';

// Import CSS for custom styling
import '../components/assets/style/SchemeList.css'

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Add custom styles
const tableStyles = {
  tableWrapper: {
    overflow: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tag: {
    fontSize: '14px',
    padding: '2px 8px'
  },
  distributorTag: {
    // margin: '2px',
    display: 'inline-block'
  },
  distributorContainer: {
    maxHeight: '80px',
    overflowY: 'auto',
    padding: '4px'
  }
};

const SchemeList = () => {
  const { hasRole, currentUser } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
  });

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
        console.log('Schemes data:', data);

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
              createdBy: createdByName,
              // Include the full distributors array
              distributors: scheme.distributors || []
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
      // Convert to UTC dates to match with our formatting
      const start = dates[0].clone().startOf('day');
      const end = dates[1].clone().endOf('day');

      filtered = filtered.filter(scheme => {
        // Parse the date in DD-MM-YYYY format correctly
        const parts = scheme.startDate.split('-');
        // Create date as YYYY-MM-DD for proper parsing
        const schemeDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
        return schemeDate >= start.toDate() && schemeDate <= end.toDate();
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
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, __, index) => {
        // Calculate the correct serial number based on pagination
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
      fixed: 'left'
    },
    {
      title: 'Scheme Code',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Link to={`/schemes/${text}`}><span className="scheme-code">{text}</span></Link>,
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
    // {
    //   title: 'Distributor Name',
    //   dataIndex: 'distributor',
    //   key: 'distributor',
    //   width: 200,
    //   render: (_, record) => {
    //     // Check if distributors exist and is an array
    //     if (!record.distributors || !Array.isArray(record.distributors) || record.distributors.length === 0) {
    //       return <span>No distributors</span>;
    //     }
        
    //     // Return a list of distributor names
    //     return (
    //       <div style={tableStyles.distributorContainer}>
    //         {record.distributors.map((dist, index) => (
    //           <Tag 
    //             color="blue" 
    //             key={index} 
    //             // style={tableStyles.distributorTag}
    //           >
    //             {dist.ORGANIZATIONNAME || `Distributor ${index + 1}`}
    //           </Tag>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Distributor Count',
      dataIndex: 'distributor',
      key: 'distributorCount',
      render: (_, record) => (
        <Tag color="blue">{`${record.distributorCount} Distributors`}</Tag>
      ),
    },
    {
      title: 'Distributors Code',
      dataIndex: 'distributor',
      key: 'distributorList',
      width: 180,
      render: (_, record) => {
        // Check if distributors exist and is an array
        if (!record.distributors || !Array.isArray(record.distributors)) {
          return <span>No distributors</span>;
        }
        
        // Return a list of distributor customer accounts
        return (
          <div style={tableStyles.distributorContainer}>
            {record.distributors.map((dist, index) => (
              <div 
                key={index} 
                // className="distributor-account"
              >
                {dist.CUSTOMERACCOUNT || `Distributor ${index + 1}`}
              </div>
            ))}
          </div>
        );
      },
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
          {hasRole('admin') && (
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Add a new function to handle export by date range
  const handleExportByDate = async () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      message.error('Please select a date range first');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      // Call the export API with the date range
      const response = await fetch(
        `${url}/api/schemes/exportByDate?startDate=${startDate}&endDate=${endDate}&format=excel`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export schemes');
      }

      // Handle file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Schemes_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      message.success('Schemes exported successfully');
    } catch (error) {
      console.error('Error exporting schemes by date:', error);
      message.error('Failed to export schemes: ' + error.message);
    }
  };

  // Add state for delete confirmation modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  // Function to show delete confirmation
  const showDeleteConfirm = (schemeId) => {
    console.log('Deleting scheme with ID:', schemeId);
    setSchemeToDelete(schemeId);
    setDeleteModalVisible(true);
  };

  // Add function to handle scheme deletion
  const handleDeleteScheme = async () => {
    if (!schemeToDelete) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${url}/api/schemes/delete/${schemeToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete scheme');
      }

      // Remove the deleted scheme from state
      const updatedSchemes = schemes.filter(scheme => scheme.id !== schemeToDelete);
      setSchemes(updatedSchemes);
      setFilteredSchemes(filteredSchemes.filter(scheme => scheme.id !== schemeToDelete));

      message.success('Scheme deleted successfully');
    } catch (error) {
      console.error('Error deleting scheme:', error);
      message.error('Failed to delete scheme: ' + error.message);
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSchemeToDelete(null);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* <Card style={{ marginBottom: '16px' }}>
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
      </Card> */}

      <Card style={{ marginBottom: '16px' }}>
      <Title level={4}>Additional Scheme</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={8}>
            <Input
              placeholder="Search schemes..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Start date', 'End date']}
              onChange={handleDateRangeChange}
              className="date-picker"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportByDate}
              disabled={!dateRange || !dateRange[0] || !dateRange[1]}
              className="export-button"
            >
              Export Schemes by Date
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredSchemes}
          loading={loading}
          pagination={{
            ...pagination,
            total: filteredSchemes.length,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
            showQuickJumper: true,
          }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          bordered
          size="middle"
        />
      </Card>

      {/* Add Delete Confirmation Modal */}
      <Modal
        title="Delete Scheme"
        visible={deleteModalVisible}
        onOk={handleDeleteScheme}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSchemeToDelete(null);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this scheme? This action cannot be undone.</p>
        {schemeToDelete && <p><strong>Scheme Code:</strong> {schemeToDelete}</p>}
      </Modal>
    </div>
  );
};

export default SchemeList;