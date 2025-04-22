import React, { useContext, useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Avatar, 
  Descriptions, 
  Row, 
  Col, 
  Space, 
  Divider,
  Modal,
  Form,
  Input,
  Select
} from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEditProfile = () => {
    form.setFieldsValue({
      fullName: currentUser.name,
      email: currentUser.email || `${currentUser.name.toLowerCase()}@gmail.com`,
      department: currentUser.department || 'IT',
      role: currentUser.role
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = (values) => {
    // In a real app, this would update the user profile via API
    console.log('Updated profile:', values);
    setEditModalVisible(false);
    // Here you would update the user context with the new values
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return dateString;
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1976d2', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>{currentUser.name}</Title>
              <Text type="secondary" style={{ textTransform: 'capitalize' }}>{currentUser.role}</Text>
            </div>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Department</Text>
                <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  {currentUser.department || 'IT'}
                </div>
              </div>
              
              <div>
                <Text type="secondary">Last Login</Text>
                <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  {formatDate(currentUser.lastLogin) || new Date().toISOString()}
                </div>
              </div>
              
              <div>
                <Text type="secondary">Status</Text>
                <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  Active
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card 
            title="Profile Details"
            extra={
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{currentUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentUser.email || `${currentUser.name.toLowerCase()}@gmail.com`}</Descriptions.Item>
              <Descriptions.Item label="Department">{currentUser.department || 'IT'}</Descriptions.Item>
              <Descriptions.Item label="Role" style={{ textTransform: 'capitalize' }}>{currentUser.role}</Descriptions.Item>
              <Descriptions.Item label="Employee ID">Not set</Descriptions.Item>
              <Descriptions.Item label="Joined Date">{formatDate(currentUser.joinedDate) || new Date().toISOString()}</Descriptions.Item>
            </Descriptions>
          </Card>
          
          <Card title="Security" style={{ marginTop: 24 }}>
            <Button type="primary" danger>
              Change Password
            </Button>
          </Card>
        </Col>
      </Row>
      
      <Modal
        title="Edit Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
          >
            Save Changes
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProfile}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Department"
          >
            <Select>
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Operations">Operations</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select disabled>
              <Option value="admin">Admin</Option>
              <Option value="creator">Creator</Option>
              <Option value="verifier">Verifier</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;