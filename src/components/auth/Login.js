import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { url } from '../../utils/constent';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Reload the page to ensure proper context initialization
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 64px)' 
    }}>
      <Card style={{ width: 400, padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Scheme Management System</Title>
          <Title level={4}>Login</Title>
        </div>


        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span>Don't have an account? </span>
            <Link to="/register">Register now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;