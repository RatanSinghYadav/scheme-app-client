import React from 'react';
import { Button, Modal, Card, Descriptions, Table } from 'antd';

const SchemeConfirmation = ({ 
    visible, 
    onCancel, 
    onConfirm, 
    schemeData, 
    form, 
    selectedDistributorKeys, 
    selectedDistributors, 
    selectedRowKeys, 
    productItems,
    customColumns 
}) => {
  return (
    <Modal
      title="Confirm Scheme Details"
      open={visible}
      onCancel={onCancel}
      width="90%"
      style={{ top: 0, maxWidth: '100%', paddingBottom: 0 }}
      bodyStyle={{ height: 'calc(100vh - 108px)', padding: '12px 24px' }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Back to Edit
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          Confirm and Create Scheme
        </Button>
      ]}
    >
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Card title="Scheme Information" style={{ marginBottom: '16px' }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Scheme Code">{schemeData.schemeCode}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{form.getFieldValue('startDate')?.format('DD-MM-YYYY')}</Descriptions.Item>
            <Descriptions.Item label="End Date">{form.getFieldValue('endDate')?.format('DD-MM-YYYY')}</Descriptions.Item>
          </Descriptions>
        </Card>
        
        <Card title={`Selected Distributors (${selectedDistributorKeys.length})`} style={{ marginBottom: '16px' }}>
          <Table
            columns={[
              { title: 'Sr.', render: (_, __, index) => index + 1, width: 60 },
              { title: 'Distributor Code', dataIndex: 'CUSTOMERACCOUNT' },
              { title: 'Distributor Name', dataIndex: 'name' },
              { title: 'City', dataIndex: 'city' },
              { title: 'Group', dataIndex: 'group' }
            ]}
            dataSource={selectedDistributors}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ y: 250 }}
          />
        </Card>
        
        <Card title={`Selected Products (${selectedRowKeys.length})`}>
          <Table
            columns={[
              { title: 'Sr.', render: (_, __, index) => index + 1, width: 60 },
              { title: 'Item Code', dataIndex: 'itemCode' },
              { title: 'Flavour', dataIndex: 'flavour' },
              { title: 'Brand Name', dataIndex: 'brandName' },
              { title: 'Item Name', dataIndex: 'itemName' },
              { title: 'Pack Group', dataIndex: 'packGroup' },
              { title: 'Style', dataIndex: 'style' },
              { title: 'Pack Type', dataIndex: 'packType' },
              { title: 'NOB', dataIndex: 'nob' },
              { title: 'MRP', dataIndex: 'mrp', render: (text) => `₹${text}` },
              { title: 'Discount Price', dataIndex: 'discountPrice', render: (text) => text ? `₹${text}` : '-' },
              // { title: 'Discount %', render: (_, record) => {
              //   if (!record.discountPrice || record.discountPrice === 0) return '-';
              //   const discount = ((record.mrp - record.discountPrice) / record.mrp) * 100;
              //   return `${discount.toFixed(2)}%`;
              // }},
              ...customColumns.map(col => ({
                title: col.title,
                dataIndex: col.key,
                key: col.key
              }))
            ]}
            dataSource={selectedRowKeys.map(key => productItems.find(item => item.key === key))}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ y: 350, x: 'max-content' }}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default SchemeConfirmation;