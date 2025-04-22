import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Space, 
  Divider, 
  Spin,
  message
} from 'antd';
import { 
  PlusOutlined, 
  ArrowRightOutlined 
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import SchemeStats from '../components/dashboard/SchemeStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import { url } from '../utils/constent';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { currentUser, hasRole } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    activeToday: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch stats
        const statsResponse = await fetch(`${url}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statsResponse.ok) {
          throw new Error(`HTTP error! Status: ${statsResponse.status}`);
        }
        
        const statsData = await statsResponse.json();
        
        if (!statsData.success) {
          throw new Error(statsData.error || 'Failed to fetch dashboard stats');
        }
        
        // Fetch activities
        const activitiesResponse = await fetch(`${url}/api/dashboard/activities`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!activitiesResponse.ok) {
          throw new Error(`HTTP error! Status: ${activitiesResponse.status}`);
        }
        
        const activitiesData = await activitiesResponse.json();
        
        if (!activitiesData.success) {
          throw new Error(activitiesData.error || 'Failed to fetch recent activities');
        }
        
        // Set state with fetched data
        setStats(statsData.data);
        setActivities(activitiesData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to load dashboard data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>
                Welcome, {currentUser?.name || 'User'}
              </Title>
              <Text type="secondary">
                Here's what's happening with your schemes today.
              </Text>
            </Space>
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

      <SchemeStats stats={stats} />

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={16}>
          <RecentActivity activities={activities} />
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>Quick Actions</Title>
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <Link to="/schemes">
                <Button type="default" block style={{ textAlign: 'left' }}>
                  View All Schemes
                  <ArrowRightOutlined style={{ float: 'right', marginTop: '4px' }} />
                </Button>
              </Link>
              
              {hasRole('verifier') && (
                <Link to="/schemes/verify">
                  <Button type="default" block style={{ textAlign: 'left' }}>
                    Verify Pending Schemes
                    <ArrowRightOutlined style={{ float: 'right', marginTop: '4px' }} />
                  </Button>
                </Link>
              )}
              
              {hasRole('admin') && (
                <Link to="/admin">
                  <Button type="default" block style={{ textAlign: 'left' }}>
                    Admin Dashboard
                    <ArrowRightOutlined style={{ float: 'right', marginTop: '4px' }} />
                  </Button>
                </Link>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;