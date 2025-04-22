import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Divider,
  Typography
} from 'antd';
import { 
  MenuOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  PlusOutlined,
  CheckOutlined,
  ToolOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import Notifications from './Notifications';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const Navbar = ({ children }) => {
  const { currentUser, logout, hasRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['dashboard'];
    if (path === '/schemes') return ['schemes'];
    if (path === '/schemes/create') return ['create'];
    if (path === '/schemes/verify') return ['verify'];
    if (path === '/admin') return ['admin'];
    return [];
  };

  const sideNavItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: 'schemes',
      icon: <FileDoneOutlined />,
      label: <Link to="/schemes">Schemes</Link>
    }
  ];

  if (hasRole && hasRole('creator')) {
    sideNavItems.push({
      key: 'create',
      icon: <PlusOutlined />,
      label: <Link to="/schemes/create">Create Scheme</Link>
    });
  }

  if (hasRole && hasRole('verifier')) {
    sideNavItems.push({
      key: 'verify',
      icon: <CheckOutlined />,
      label: <Link to="/schemes/verify">Verify Schemes</Link>
    });
  }

  if (hasRole && hasRole('admin')) {
    sideNavItems.push({
      key: 'admin',
      icon: <ToolOutlined />,
      label: <Link to="/admin">Admin</Link>
    });
  }

  if (!currentUser) {
    return children;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {collapsed ? (
            <h3 style={{ margin: 0 }}>SA</h3>
          ) : (
            <h2 style={{ margin: 0 }}>Scheme App</h2>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={sideNavItems}
          style={{ borderRight: 0 }}
        />
        
        {/* Bottom collapse button */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          backgroundColor: '#fff'
        }}>
          <Button
            type="text"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{
          padding: '0 16px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          height: '64px'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge 
              count={1} 
              dot 
              color="red"
              style={{ marginRight: 24 }}
            >
              <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => setNotificationsOpen(!notificationsOpen)} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: currentUser.role === 'admin' ?'#87d068' : '#1976d2',
                    color: '#fff',
                    fontSize: '16px'
                  }} 
                  size={35}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div style={{ 
                  marginLeft: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <Text strong style={{ fontSize: '14px', lineHeight: '1.2' }}>{currentUser.name || 'User'}</Text>
                  <Text type="secondary" style={{ 
                    fontSize: '12px', 
                    lineHeight: '1.2',
                    textTransform: 'capitalize'
                  }}>
                    {currentUser.role || 'User'}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          minHeight: 280, 
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {children}
        </Content>
      </Layout>
      
      {notificationsOpen && <Notifications onClose={() => setNotificationsOpen(false)} />}
    </Layout>
  );
};

export default Navbar;