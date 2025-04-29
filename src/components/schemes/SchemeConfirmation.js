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
    selectedProducts, // Changed from selectedRowKeys
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

        <Card title="Selected Distributors" style={{ marginBottom: '16px' }}>
          <Table
            columns={[
              { title: 'Sr.', dataIndex: 'sr', key: 'sr', width: 60, render: (_, __, index) => index + 1 },
              { title: 'Distributor Code', dataIndex: 'code', key: 'code' },
              { title: 'Distributor Name', dataIndex: 'name', key: 'name' },
              { title: 'City', dataIndex: 'city', key: 'city' },
              { title: 'Group', dataIndex: 'group', key: 'group' },
              { title: 'SM', dataIndex: 'sm', key: 'sm' }
            ]}
            dataSource={selectedDistributors}
            rowKey="key"
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Card title="Selected Products" style={{ marginTop: '16px' }}>
          <Table
            columns={[
              { title: 'Sr.', dataIndex: 'sr', key: 'sr', width: 60, render: (_, __, index) => index + 1 },
              { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode' },
              { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
              { title: 'Brand Name', dataIndex: 'brandName', key: 'brandName' },
              { title: 'Flavour', dataIndex: 'flavour', key: 'flavour' },
              { title: 'Pack Type', dataIndex: 'packType', key: 'packType' },
              { title: 'Pack Group', dataIndex: 'packGroup', key: 'packGroup' },
              { title: 'Style', dataIndex: 'style', key: 'style' },
              { title: 'NOB', dataIndex: 'nob', key: 'nob' },
              { title: 'MRP', dataIndex: 'mrp', key: 'mrp' },
              { title: 'Discount Price', dataIndex: 'discountPrice', key: 'discountPrice' },
              // Add custom columns if any
              ...customColumns.map(col => ({
                title: col.title,
                dataIndex: col.key,
                key: col.key,
              }))
            ]}
            dataSource={selectedProducts} // Use selectedProducts directly instead of filtering from productItems
            rowKey="key"
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default SchemeConfirmation;