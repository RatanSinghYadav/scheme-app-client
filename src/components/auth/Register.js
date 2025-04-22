import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { url } from '../../utils/constent';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([
    { id: '1', name: 'IT' },
    { id: '2', name: 'Accounts' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Sales' },
    { id: '5', name: 'General' },
  ]);
  const navigate = useNavigate();

  // Check if email exists
  const checkEmailExists = debounce(async (email) => {
    try {
      const response = await fetch(`${url}/api/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.exists) {
        form.setFields([
          {
            name: 'email',
            errors: ['This email is already registered']
          }
        ]);
      }
    } catch (error) {
      console.error('Email check error:', error);
    }
  }, 500);

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${url}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('Registration response:', data);
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Save token and user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      message.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed');
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
          <Title level={4}>Create an Account</Title>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              onBlur={(e) => {
                const email = e.target.value;
                if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                  checkEmailExists(email);
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="department"
            rules={[{ required: true, message: 'Please select your department!' }]}
          >
            <Select
              placeholder="Select Department"
              size="large"
              suffixIcon={<TeamOutlined />}
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.name}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select
              placeholder="Select Role"
              size="large"
              suffixIcon={<BankOutlined />}
            >
              <Option value="viewer">Viewer</Option>
              <Option value="creator">Creator</Option>
              <Option value="verifier">Verifier</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;