import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Card, 
  Tag, 
  Popconfirm,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { url } from '../utils/constent';

const { Option } = Select;
const { Title } = Typography;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Users API response:', data);
      
      if (response.ok) {
        setUsers(data.data || []);
      } else {
        message.error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    form.resetFields();
    
    if (user) {
      form.setFieldsValue({
        username: user.username || user.email.split('@')[0],
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.active ? 'active' : 'inactive'
      });
    }
    
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentUser(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      
      // Convert status to active boolean
      values.active = values.status === 'active';
      delete values.status;
      
      if (currentUser) {
        // Update existing user
        const response = await fetch(`${url}/api/auth/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          message.success('User updated successfully');
          fetchUsers();
        } else {
          message.error(data.error || 'Failed to update user');
        }
      } else {
        // Add new user with password
        if (!values.password) {
          message.error('Password is required for new users');
          return;
        }
        
        const response = await fetch(`${url}/api/auth/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          message.success('User created successfully');
          fetchUsers();
        } else {
          message.error(data.error || 'Failed to create user');
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success('User deleted successfully');
        fetchUsers();
      } else {
        message.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? false : true;
      
      const response = await fetch(`${url}/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        message.error(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Failed to update user status');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'creator':
        return 'blue';
      case 'verifier':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Tag 
          color={active ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleStatus(record._id, active ? 'active' : 'inactive')}
        >
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>User Management</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add User
          </Button>
        </div>
      </Card>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      {/* Add/Edit User Modal */}
      <Modal
        title={currentUser ? 'Edit User' : 'Add New User'}
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okText={currentUser ? 'Update' : 'Add'}
      >
        <Form 
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            email: '',
            department: 'IT',
            role: 'viewer',
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input type="email" />
          </Form.Item>
          
          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select a department' }]}
          >
            <Select>
              <Option value="IT">IT</Option>
              <Option value="Accounts">Accounts</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Sales">Sales</Option>
              <Option value="General">General</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="creator">Creator</Option>
              <Option value="verifier">Verifier</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;