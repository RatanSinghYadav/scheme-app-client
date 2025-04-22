import React from 'react';
import { 
  Card, 
  Typography, 
  List, 
  Avatar,
  Divider,
  Space
} from 'antd';
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const getActivityIcon = (type) => {
  switch (type) {
    case 'create':
      return <PlusCircleOutlined style={{ color: '#1976d2' }} />;
    case 'verify':
      return <CheckCircleOutlined style={{ color: '#4caf50' }} />;
    case 'reject':
      return <CloseCircleOutlined style={{ color: '#f44336' }} />;
    case 'export':
      return <DownloadOutlined style={{ color: '#2196f3' }} />;
    default:
      return <PlusCircleOutlined />;
  }
};

const getActivityText = (activity) => {
  switch (activity.type) {
    case 'create':
      return `${activity.user} created scheme ${activity.schemeId}`;
    case 'verify':
      return `${activity.user} verified scheme ${activity.schemeId}`;
    case 'reject':
      return `${activity.user} rejected scheme ${activity.schemeId}`;
    case 'export':
      return `${activity.user} exported scheme ${activity.schemeId}`;
    default:
      return `Unknown activity for scheme ${activity.schemeId}`;
  }
};

const RecentActivity = ({ activities }) => {
  return (
    <Card>
      <Title level={5}>Recent Activity</Title>
      <Divider />
      
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(activity) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={getActivityIcon(activity.type)} 
                  style={{ 
                    backgroundColor: 
                      activity.type === 'create' ? '#e3f2fd' : 
                      activity.type === 'verify' ? '#e8f5e9' : 
                      activity.type === 'reject' ? '#ffebee' : 
                      activity.type === 'export' ? '#e1f5fe' : '#f5f5f5' 
                  }} 
                />
              }
              title={getActivityText(activity)}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;