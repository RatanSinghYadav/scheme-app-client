import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Space, 
  DatePicker, 
  Collapse,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const SchemeFilters = ({ onFilter, schemes = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: null,
    endDate: null,
    distributor: ''
  });

  // Get unique statuses for Excel-like filter
  const getUniqueStatuses = () => {
    const statuses = [...new Set(schemes.map(scheme => scheme.status))];
    return statuses.filter(Boolean).map(status => ({
      label: status,
      value: status
    }));
  };

  // Get unique distributors for Excel-like filter
  const getUniqueDistributors = () => {
    const distributors = [...new Set(schemes.map(scheme => scheme.distributorName))];
    return distributors.filter(Boolean).map(distributor => ({
      label: distributor,
      value: distributor
    }));
  };

  const handleChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setFilters({
        ...filters,
        startDate: dates[0],
        endDate: dates[1]
      });
    } else {
      setFilters({
        ...filters,
        startDate: null,
        endDate: null
      });
    }
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      startDate: null,
      endDate: null,
      distributor: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Input
            placeholder="Search schemes..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => handleChange('status', value)}
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="Verified">Verified</Option>
            <Option value="Pending Verification">Pending Verification</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>
        <Col xs={24} md={4} style={{ textAlign: 'right' }}>
          <Button 
            type={expanded ? "primary" : "default"}
            icon={<FilterOutlined />}
            onClick={() => setExpanded(!expanded)}
          >
            Advanced
          </Button>
        </Col>
      </Row>

      <Collapse 
        activeKey={expanded ? ['1'] : []} 
        ghost
        style={{ marginTop: 16 }}
      >
        <Panel key="1" showArrow={false} header={null}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text strong>Date Range:</Text>
              <RangePicker 
                style={{ width: '100%', marginTop: 8 }}
                onChange={handleDateChange}
                value={[filters.startDate, filters.endDate]}
              />
            </Col>
            <Col xs={24} md={12}>
              <Text strong>Distributor:</Text>
              <Input
                placeholder="Filter by distributor"
                value={filters.distributor}
                onChange={(e) => handleChange('distributor', e.target.value)}
                style={{ marginTop: 8 }}
                allowClear
              />
            </Col>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleClearFilters} icon={<ClearOutlined />}>
                  Clear Filters
                </Button>
                <Button type="primary" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </Space>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default SchemeFilters;