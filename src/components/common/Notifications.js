import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  Typography, 
  Avatar, 
  Button, 
  Divider, 
  Badge, 
  Space 
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    type: 'verification',
    message: 'Scheme SCHM0000009 has been verified',
    timestamp: '2023-03-16T14:45:00',
    read: false,
    schemeId: 'SCHM0000009'
  },
  {
    id: 2,
    type: 'pending',
    message: 'New scheme SCHM00000135 is pending verification',
    timestamp: '2023-03-15T10:30:00',
    read: true,
    schemeId: 'SCHM00000135'
  },
  {
    id: 3,
    type: 'rejected',
    message: 'Scheme SCHM00000134 has been rejected',
    timestamp: '2023-03-01T16:20:00',
    read: true,
    schemeId: 'SCHM00000134'
  }
];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'verification':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'pending':
      return <ClockCircleOutlined style={{ color: '#faad14' }} />;
    case 'rejected':
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    default:
      return <CheckCircleOutlined />;
  }
};

const Notifications = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleNotificationClick = (schemeId) => {
    navigate(`/schemes/${schemeId}`);
    onClose();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <Drawer
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={5} style={{ margin: 0 }}>Notifications</Title>
          <Badge count={unreadCount} />
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={true}
      width={320}
      extra={
        <Button type="text" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      }
    >
      <List
        dataSource={notifications}
        renderItem={(notification) => (
          <List.Item 
            onClick={() => handleNotificationClick(notification.schemeId)}
            style={{ 
              cursor: 'pointer',
              backgroundColor: notification.read ? 'transparent' : 'rgba(24, 144, 255, 0.05)'
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={getNotificationIcon(notification.type)} 
                  style={{ 
                    backgroundColor: 
                      notification.type === 'verification' ? '#f6ffed' : 
                      notification.type === 'pending' ? '#fffbe6' : 
                      notification.type === 'rejected' ? '#fff1f0' : '#f5f5f5' 
                  }} 
                />
              }
              title={notification.message}
              description={
                <Text type="secondary">
                  {new Date(notification.timestamp).toLocaleString()}
                </Text>
              }
            />
          </List.Item>
        )}
      />
      
      {notifications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">No notifications</Text>
        </div>
      )}
    </Drawer>
  );
};

export default Notifications;