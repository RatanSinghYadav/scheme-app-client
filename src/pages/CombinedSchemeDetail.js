import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Table,
  Descriptions,
  Tag,
  Tabs,
  Timeline,
  Spin,
  message,
  Typography
} from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { url } from '../utils/constent';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CombinedSchemeDetail = () => {
  const { code } = useParams(); // Customer code from URL
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchDetails();
  }, [code]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('Authentication required');
        return;
      }

      const response = await fetch(`${url}/api/combined/schemes/customer/details/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setDetails(data.data);
      } else {
        message.error(data.message || 'Failed to fetch details');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      message.error('Error fetching details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!details) {
    return <Card><Text>No details found for this customer</Text></Card>;
  }

  // Define product discounts table columns
  // Define product discounts table columns
  const productColumns = [
    {
      title: 'Product Name',  // यदि आवश्यक हो तो itemName को भी प्रदर्शित करें
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Active Schemes',
      dataIndex: 'schemes',
      key: 'schemes',
      render: schemes => schemes.length,
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: value => `₹${value.toFixed(2)}`,
      sorter: (a, b) => a.totalDiscount - b.totalDiscount,
    },
  ];

  // Define date-wise summary table columns
  const dateColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => moment(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Active Schemes',
      dataIndex: 'activeSchemes',
      key: 'activeSchemes',
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: value => `₹${value.toFixed(2)}`,
    },
  ];

  // Expandable row for product details
  const expandedRowRender = record => {
    const schemeColumns = [
      {
        title: 'Scheme Code',
        dataIndex: 'schemeCode',
        key: 'schemeCode',
      },
      {
        title: 'Scheme Type',  // नया कॉलम जोड़ें
        dataIndex: 'schemeType',
        key: 'schemeType',
        render: type => (
          <Tag color={type === 'Group' ? 'blue' : 'green'}>
            {type || 'Additional'}
          </Tag>
        ),
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: date => moment(date).format('DD-MM-YYYY'),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: date => moment(date).format('DD-MM-YYYY'),
      },
      {
        title: 'Configuration',
        dataIndex: 'configId',
        key: 'configId',
      },
      {
        title: 'Style',
        dataIndex: 'style',
        key: 'style',
      },
      {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
        render: (value, record) => {
          return record.calculationType === 'Percentage' ?
            `${value}%` :
            `₹${value}`;
        },
      },
    ];

    return (
      <Table
        columns={schemeColumns}
        dataSource={record.schemes.map((scheme, index) => ({ ...scheme, key: index }))}
        pagination={false}
      />
    );
  };

  return (
    <Card title={`Scheme Details for ${details.customer?.salesDescription || 'Customer'}`}>
      <Descriptions title="Customer Information" bordered>
        <Descriptions.Item label="Customer Type">{details.customer?.salesType || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Customer Code">{details.customer?.salesCode || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Customer Name">{details.customer?.salesDescription || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Group ID">{details.customer?.groupId || 'N/A'}</Descriptions.Item>
      </Descriptions>

      <Tabs defaultActiveKey="products" style={{ marginTop: 16 }}>
        <TabPane tab="Product-wise Discounts" key="products">
          <Table
            columns={productColumns}
            expandable={{ expandedRowRender }}
            dataSource={(details.productDiscounts || []).map((product, index) => ({ ...product, key: index }))}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Date-wise Summary" key="dates">
          <Table
            columns={dateColumns}
            dataSource={(details.dateWiseSummary || []).map((date, index) => ({ ...date, key: index }))}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Timeline View" key="timeline">
          <Timeline mode="left">
            {(details.dateWiseSummary || []).map((date, index) => (
              <Timeline.Item key={index} label={moment(date.date).format('DD-MM-YYYY')}>
                <Text strong>{date.activeSchemes} active schemes</Text>
                <br />
                <Text>Total discount: ₹{(date.totalDiscount || 0).toFixed(2)}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CombinedSchemeDetail;