import React from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Statistic
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ScheduleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{
          backgroundColor: color === 'primary' ? '#e3f2fd' :
            color === 'success' ? '#e8f5e9' :
              color === 'warning' ? '#fff8e1' :
                color === 'info' ? '#e1f5fe' : '#f5f5f5',
          borderRadius: '50%',
          padding: 8,
          marginRight: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, {
            style: {
              color: color === 'primary' ? '#1976d2' :
                color === 'success' ? '#4caf50' :
                  color === 'warning' ? '#ff9800' :
                    color === 'info' ? '#03a9f4' : '#757575',
              fontSize: 20
            }
          })}
        </div>
        <Title level={5} style={{ margin: 0 }}>{title}</Title>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <Statistic value={value || 0} />
    </Card>
  );
};

const SchemeStats = ({ stats }) => {
  return (
    <>
      <Title level={4} style={{ marginBottom: '16px' }}>Additional Schemes</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Additional Schemes"
            value={stats.total || 0}
            icon={<ScheduleOutlined />}
            color="primary"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Verified Additional Schemes"
            value={stats.verified || 0}
            icon={<CheckCircleOutlined />}
            color="success"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Additional Schemes"
            value={stats.pending || 0}
            icon={<ClockCircleOutlined />}
            color="warning"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Today"
            value={stats.activeToday || 0}
            icon={<CalendarOutlined />}
            color="info"
          />
        </Col>
      </Row>

      <Title level={4} style={{ margin: '24px 0 16px' }}>Base Schemes</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Base Schemes"
            value={stats.baseTotal || 0}
            icon={<ScheduleOutlined />}
            color="primary"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Verified Base Schemes"
            value={stats.baseVerified || 0}
            icon={<CheckCircleOutlined />}
            color="success"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Base Schemes"
            value={stats.basePending || 0}
            icon={<ClockCircleOutlined />}
            color="warning"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Base Schemes Today"
            value={stats.baseActiveToday || 0}
            icon={<CalendarOutlined />}
            color="info"
          />
        </Col>
      </Row>

      <Title level={4} style={{ margin: '24px 0 16px' }}>All Schemes</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Schemes"
            value={(stats.total || 0) + (stats.baseTotal || 0)}
            icon={<ScheduleOutlined />}
            color="primary"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Verified Schemes"
            value={(stats.verified || 0) + (stats.baseVerified || 0)}
            icon={<CheckCircleOutlined />}
            color="success"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Verification"
            value={(stats.pending || 0) + (stats.basePending || 0)}
            icon={<ClockCircleOutlined />}
            color="warning"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Today"
            value={(stats.activeToday || 0) + (stats.baseActiveToday || 0)}
            icon={<CalendarOutlined />}
            color="info"
          />
        </Col>
      </Row>
    </>
  );
};

export default SchemeStats;