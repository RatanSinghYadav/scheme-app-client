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
  Select,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  FilterOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
// Import the filter components
import TableFilters from '../components/schemes/TableFilters';
import CheckboxFilter from '../components/schemes/CheckboxFilter';

const { Title } = Typography;
const { Option } = Select;

const ProductManagement = () => {
  const { hasRole } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  
  // Add state for filters
  const [productFilters, setProductFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
  });

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search text or filters change
  useEffect(() => {
    let filtered = [...products];
    
    // Apply text search filter
    if (searchText) {
      filtered = filtered.filter(product =>
        product.ITEMNAME?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.ITEMID?.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.BRANDNAME && product.BRANDNAME.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // Apply each active filter
    Object.entries(productFilters).forEach(([field, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(item => {
          if (Array.isArray(values)) {
            return values.includes(item[field]);
          }
          return String(item[field])?.toLowerCase().includes(String(values).toLowerCase());
        });
      }
    });
    
    setFilteredProducts(filtered);
    setPagination(prev => ({
      ...prev,
      total: filtered.length,
      current: 1
    }));
  }, [searchText, products, productFilters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('Failed to fetch products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  // Handle product filter change
  const handleProductFilterChange = (field, value) => {
    const newFilters = {
      ...productFilters,
      [field]: value
    };
    
    // If value is empty, remove the filter
    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[field];
    }
    
    setProductFilters(newFilters);
  };
  
  // Get unique values for a field
  const getUniqueFieldOptions = (field) => {
    const values = [...new Set(products.map(item => item[field]))];
    return values.filter(Boolean).map(value => ({
      label: String(value),
      value: value
    }));
  };

  const showAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ITEMID: product.ITEMID,
      ITEMNAME: product.ITEMNAME,
      BRANDNAME: product.BRANDNAME,
      FLAVOURTYPE: product.FLAVOURTYPE,
      PACKTYPEGROUPNAME: product.PACKTYPEGROUPNAME,
      Style: product.Style,
      PACKTYPE: product.PACKTYPE,
      Configuration: product.Configuration,
      NOB: product.NOB
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        // Update existing product
        await api.updateProduct(editingProduct._id, values);
        message.success('Product updated successfully');
      } else {
        // Create new product
        await api.createProduct(values);
        message.success('Product created successfully');
      }

      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setProductFilters({});
    setSearchText('');
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
      title: 'Item ID',
      dataIndex: 'ITEMID',
      key: 'ITEMID',
      sorter: (a, b) => a.ITEMID.localeCompare(b.ITEMID),
      ...TableFilters({
        field: 'ITEMID',
        placeholder: 'Search Item ID',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('ITEMID'),
        dataSource: products
      })
    },
    {
      title: 'Flavour Type',
      dataIndex: 'FLAVOURTYPE',
      key: 'FLAVOURTYPE',
      sorter: (a, b) => (a.FLAVOURTYPE || '').localeCompare(b.FLAVOURTYPE || ''),
      ...TableFilters({
        field: 'FLAVOURTYPE',
        placeholder: 'Search Flavour',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('FLAVOURTYPE'),
        dataSource: products
      })
    },
    {
      title: 'Brand',
      dataIndex: 'BRANDNAME',
      key: 'BRANDNAME',
      sorter: (a, b) => (a.BRANDNAME || '').localeCompare(b.BRANDNAME || ''),
      ...TableFilters({
        field: 'BRANDNAME',
        placeholder: 'Search Brand',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('BRANDNAME'),
        dataSource: products
      })
    },
    {
      title: 'Item Name',
      dataIndex: 'ITEMNAME',
      key: 'ITEMNAME',
      sorter: (a, b) => a.ITEMNAME.localeCompare(b.ITEMNAME),
      ...TableFilters({
        field: 'ITEMNAME',
        placeholder: 'Search Item Name',
        onFilter: handleProductFilterChange,
        dataSource: products
      })
    },
    {
      title: 'Pack Group',
      dataIndex: 'PACKTYPEGROUPNAME',
      key: 'PACKTYPEGROUPNAME',
      sorter: (a, b) => (a.PACKTYPEGROUPNAME || '').localeCompare(b.PACKTYPEGROUPNAME || ''),
      ...TableFilters({
        field: 'PACKTYPEGROUPNAME',
        placeholder: 'Search Pack Group',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('PACKTYPEGROUPNAME'),
        dataSource: products
      })
    },
    {
      title: 'Style',
      dataIndex: 'Style',
      key: 'Style',
      sorter: (a, b) => (a.Style || '').localeCompare(b.Style || ''),
      ...TableFilters({
        field: 'Style',
        placeholder: 'Search Style',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('Style'),
        dataSource: products
      })
    },
    {
      title: 'Pack Type',
      dataIndex: 'PACKTYPE',
      key: 'PACKTYPE',
      sorter: (a, b) => (a.PACKTYPE || '').localeCompare(b.PACKTYPE || ''),
      ...TableFilters({
        field: 'PACKTYPE',
        placeholder: 'Search Pack Type',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('PACKTYPE'),
        dataSource: products
      })
    },
    {
      title: 'NOB',
      dataIndex: 'NOB',
      key: 'NOB',
      sorter: (a, b) => (a.NOB || 0) - (b.NOB || 0),
      ...TableFilters({
        field: 'NOB',
        placeholder: 'Search NOB',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('NOB'),
        dataSource: products
      })
    },
    {
      title: 'Configuration',
      dataIndex: 'Configuration',
      key: 'Configuration',
      sorter: (a, b) => (a.Configuration || '').localeCompare(b.Configuration || ''),
      ...TableFilters({
        field: 'Configuration',
        placeholder: 'Search Configuration',
        onFilter: handleProductFilterChange,
        useCheckboxFilter: true,
        filterOptions: getUniqueFieldOptions('Configuration'),
        dataSource: products
      })
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
            title="Are you sure you want to delete this product?"
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

  // Render active filters
  const renderActiveFilters = () => {
    const activeFilters = Object.entries(productFilters);
    if (activeFilters.length === 0) return null;
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          {activeFilters.map(([field, values]) => {
            if (!values || (Array.isArray(values) && values.length === 0)) return null;
            
            return (
              <Button 
                key={field} 
                size="small" 
                onClick={() => handleProductFilterChange(field, [])}
                type="default"
              >
                {field}: {Array.isArray(values) ? `${values.length} selected` : values}
                <CloseOutlined style={{ marginLeft: 5 }} />
              </Button>
            );
          })}
          <Button size="small" type="link" onClick={clearAllFilters}>Clear All</Button>
        </Space>
      </div>
    );
  };

  return (
    <div className="product-management-container">
      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={2}>Product Management</Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search products"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                style={{ width: 250 }}
              />
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                type={showFilters ? "primary" : "default"}
              >
                Filters {Object.keys(productFilters).length > 0 && `(${Object.keys(productFilters).length})`}
              </Button>
              {hasRole('admin') && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                >
                  Add Product
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        
        {/* Filter section */}
        {showFilters && (
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <Card size="small" title="Filter Products">
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div style={{ marginBottom: 8 }}><strong>Brand</strong></div>
                  <CheckboxFilter
                    options={getUniqueFieldOptions('BRANDNAME')}
                    onFilter={(values) => handleProductFilterChange('BRANDNAME', values)}
                    field="BRANDNAME"
                    placeholder="Search brands"
                    selectedKeys={productFilters.BRANDNAME || []}
                  />
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: 8 }}><strong>Flavour Type</strong></div>
                  <CheckboxFilter
                    options={getUniqueFieldOptions('FLAVOURTYPE')}
                    onFilter={(values) => handleProductFilterChange('FLAVOURTYPE', values)}
                    field="FLAVOURTYPE"
                    placeholder="Search flavours"
                    selectedKeys={productFilters.FLAVOURTYPE || []}
                  />
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: 8 }}><strong>Style</strong></div>
                  <CheckboxFilter
                    options={getUniqueFieldOptions('Style')}
                    onFilter={(values) => handleProductFilterChange('Style', values)}
                    field="Style"
                    placeholder="Search styles"
                    selectedKeys={productFilters.Style || []}
                  />
                </Col>
                <Col span={6}>
                  <div style={{ marginBottom: 8 }}><strong>Pack Type</strong></div>
                  <CheckboxFilter
                    options={getUniqueFieldOptions('PACKTYPE')}
                    onFilter={(values) => handleProductFilterChange('PACKTYPE', values)}
                    field="PACKTYPE"
                    placeholder="Search pack types"
                    selectedKeys={productFilters.PACKTYPE || []}
                  />
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </Col>
              </Row>
            </Card>
          </div>
        )}
        
        {/* Display active filters */}
        {renderActiveFilters()}

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="_id"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="ITEMID"
                label="Item ID"
                rules={[{ required: true, message: 'Please enter Item ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ITEMNAME"
                label="Item Name"
                rules={[{ required: true, message: 'Please enter Item Name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="BRANDNAME"
                label="Brand Name"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="FLAVOURTYPE"
                label="Flavour Type"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="PACKTYPEGROUPNAME"
                label="Pack Type Group Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="Style"
                label="Style"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="PACKTYPE"
                label="Pack Type"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="Configuration"
                label="Configuration"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="NOB"
                label="NOB"
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;