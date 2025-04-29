import React from 'react';
import { Table, Button, Typography, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SelectedProductsTable = ({
  selectedProducts,
  removeProduct,
  customColumns
}) => {
  // Define columns for the selected products table
  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Flavour',
      dataIndex: 'flavour',
      key: 'flavour',
    },
    {
      title: 'Pack Type',
      dataIndex: 'packType',
      key: 'packType',
    },
    {
      title: 'Pack Group',
      dataIndex: 'packGroup',
      key: 'packGroup',
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
    },
    {
      title: 'NOB',
      dataIndex: 'nob',
      key: 'nob',
    },
    {
      title: 'MRP',
      dataIndex: 'mrp',
      key: 'mrp',
    },
    {
      title: 'Discount Price',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
      render: (text) => <Text strong>{text}</Text>,
    },
    // Add custom columns if any
    ...customColumns.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
    })),
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to remove this product?"
          onConfirm={() => removeProduct(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography.Title level={5}>Selected Products ({selectedProducts.length})</Typography.Title>
      <Table
        columns={columns}
        dataSource={selectedProducts}
        rowKey="key"
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
      />
    </div>
  );
};

export default SelectedProductsTable;