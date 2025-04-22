import React from 'react';
import { 
  Card, 
  Typography, 
  Divider,
  Timeline
} from 'antd';
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const getHistoryIcon = (action) => {
  switch (action) {
    case 'created':
      return <PlusCircleOutlined style={{ color: '#1976d2' }} />;
    case 'verified':
      return <CheckCircleOutlined style={{ color: '#4caf50' }} />;
    case 'rejected':
      return <CloseCircleOutlined style={{ color: '#f44336' }} />;
    case 'exported':
      return <DownloadOutlined style={{ color: '#2196f3' }} />;
    case 'edited':
      return <EditOutlined style={{ color: '#ff9800' }} />;
    default:
      return <EditOutlined style={{ color: '#ff9800' }} />;
  }
};

const getHistoryColor = (action) => {
  switch (action) {
    case 'created':
      return 'blue';
    case 'verified':
      return 'green';
    case 'rejected':
      return 'red';
    case 'exported':
      return 'blue';
    case 'edited':
      return 'orange';
    default:
      return 'blue';
  }
};

const SchemeHistory = ({ history }) => {
  return (
    <Card>
      <Title level={5}>Scheme History</Title>
      <Divider />
      
      <Timeline
        mode="left"
        items={history.map((item) => ({
          color: getHistoryColor(item.action),
          label: <Text>{item.timestamp}</Text>, // Use the already formatted timestamp
          dot: getHistoryIcon(item.action),
          children: (
            <>
              <Text strong>{item.action.charAt(0).toUpperCase() + item.action.slice(1)}</Text>
              <div>
                <Text type="secondary">By: {item.user}</Text>
              </div>
              {item.notes && (
                <div>
                  <Text italic>{item.notes}</Text>
                </div>
              )}
            </>
          )
        }))}
      />
    </Card>
  );
};

export default SchemeHistory;