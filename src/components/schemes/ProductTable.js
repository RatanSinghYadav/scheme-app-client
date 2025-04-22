import React, { useState } from 'react';
import {
  Table,
  Typography,
  Space,
  Input,
  Switch,
  DatePicker,
  Button,
  Popconfirm,
  Modal,
  Form,
  Tooltip,
  Select
} from 'antd';
import {
  SettingOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ColumnManager from './ColumnManager';

const ProductTable = ({
  productItems,
  setProductItems,
  columns,
  visibleColumns,
  setVisibleColumns,
  selectedRowKeys,
  setSelectedRowKeys,
  filteredProducts,
  handleDiscountPriceAll,
  handleEditColumn,
  handleDeleteColumn,
  tableHeight = 400,
  tableWidth = "100%",
  customColumns = [],
  loading = false 
}) => {
  const [editColumnModalVisible, setEditColumnModalVisible] = useState(false);
  const [currentEditColumn, setCurrentEditColumn] = useState(null);
  const [editColumnForm] = Form.useForm();

  // Product row selection
  const productRowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    }
  };

  // Handle cell value change for custom columns
  const handleCellChange = (record, key, value) => {
    const updatedItems = [...productItems];
    const index = updatedItems.findIndex(item => item.key === record.key);
    if (index !== -1) {
      updatedItems[index] = {
        ...updatedItems[index],
        [key]: value
      };
      setProductItems(updatedItems);

      // Also update filtered products
      const updatedFilteredProducts = [...filteredProducts];
      const filteredIndex = updatedFilteredProducts.findIndex(item => item.key === record.key);
      if (filteredIndex !== -1) {
        updatedFilteredProducts[filteredIndex] = {
          ...updatedFilteredProducts[filteredIndex],
          [key]: value
        };
      }
    }
  };

  // Render cell based on data type
  const renderCell = (dataType, text, record, index, key) => {
    switch (dataType) {
      case 'number':
        return (
          <Input
            type="number"
            value={text}
            onChange={(e) => handleCellChange(record, key, parseFloat(e.target.value) || 0)}
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={text}
            onChange={(checked) => handleCellChange(record, key, checked)}
          />
        );
      case 'date':
        return (
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(date) => handleCellChange(record, key, date ? date.format('YYYY-MM-DD') : null)}
          />
        );
      default:
        return (
          <Input
            value={text}
            onChange={(e) => handleCellChange(record, key, e.target.value)}
          />
        );
    }
  };

  // Show edit column modal
  const showEditColumnModal = (column) => {
    setCurrentEditColumn(column);

    // Set form values including dataType and defaultValue if available
    editColumnForm.setFieldsValue({
      title: column.title,
      key: column.key,
      dataType: column.dataType || 'text',
      defaultValue: column.defaultValue || ''
    });

    setEditColumnModalVisible(true);
  };

  // Handle edit column submit
  const handleEditColumnSubmit = () => {
    editColumnForm.validateFields().then(values => {
      // Convert default value based on data type
      if (values.dataType === 'number' && values.defaultValue !== undefined && values.defaultValue !== '') {
        values.defaultValue = parseFloat(values.defaultValue) || 0;
      } else if (values.dataType === 'boolean' && values.defaultValue !== undefined) {
        values.defaultValue = values.defaultValue === 'true' || values.defaultValue === true;
      }

      // Pass all form values to handleEditColumn
      handleEditColumn(currentEditColumn.key, values);
      setEditColumnModalVisible(false);
    });
  };

  // Add column actions to custom columns
  const columnsWithActions = columns.map(col => {
    // Check if this is a custom column
    const isCustomColumn = Array.isArray(customColumns) && customColumns.some(customCol => customCol.key === col.key);

    if (isCustomColumn) {
      return {
        ...col,
        title: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{col.title}</span>
            <Space size="small">
              <Tooltip title="Edit column">
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    showEditColumnModal(col);
                  }}
                />
              </Tooltip>
              <Tooltip title="Delete column">
                <Popconfirm
                  title="Are you sure you want to delete this column?"
                  onConfirm={() => handleDeleteColumn(col.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          </div>
        ),
        render: (text, record, index) => {
          return renderCell(col.dataType, text, record, index, col.key);
        }
      };
    }

    return col;
  });

  // Define visible columns based on the visibleColumns prop
  const visibleProductColumns = columnsWithActions.filter(col =>
    visibleColumns.includes(col.key) || col.key === 'sr'
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Text>
          Total Selected Lines: {selectedRowKeys.length}
          <div>
            Total Products: {filteredProducts.length}
          </div>
        </Typography.Text>
        <div className="columns-manager-button">
          <ColumnManager
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnChange={setVisibleColumns}
          />
        </div>
      </div>

      <Table
        rowSelection={{
          type: 'checkbox',
          ...productRowSelection
        }}
        columns={visibleProductColumns}
        dataSource={filteredProducts}
        pagination={false}
        size="small"
        bordered
        loading={loading}
        scroll={{
          y: tableHeight,
          x: tableWidth
        }}
        style={{
          maxHeight: tableHeight,
          width: tableWidth
        }}
      />

      {/* Edit Column Modal */}
      <Modal
        title="Edit Column"
        open={editColumnModalVisible}
        onOk={handleEditColumnSubmit}
        onCancel={() => setEditColumnModalVisible(false)}
      >
        <Form form={editColumnForm} layout="vertical">
          <Form.Item
            name="title"
            label="Column Title"
            rules={[{ required: true, message: 'Please enter column title' }]}
          >
            <Input placeholder="Enter column title" />
          </Form.Item>
          <Form.Item
            name="key"
            label="Column Key"
            rules={[
              { required: true, message: 'Please enter column key' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Key can only contain letters, numbers and underscore' }
            ]}
          >
            <Input placeholder="Enter column key" disabled={currentEditColumn !== null} />
          </Form.Item>
          <Form.Item
            name="dataType"
            label="Data Type"
            rules={[{ required: true, message: 'Please select data type' }]}
          >
            <Select>
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="number">Number</Select.Option>
              <Select.Option value="boolean">Boolean</Select.Option>
              <Select.Option value="date">Date</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="defaultValue"
            label="Default Value"
            dependencies={['dataType']}
          >
            {({ getFieldValue }) => {
              const dataType = getFieldValue('dataType');

              switch (dataType) {
                case 'number':
                  return <Input type="number" placeholder="Enter default value" />;
                case 'boolean':
                  return (
                    <Select placeholder="Select default value">
                      <Select.Option value={true}>True</Select.Option>
                      <Select.Option value={false}>False</Select.Option>
                    </Select>
                  );
                case 'date':
                  return <DatePicker style={{ width: '100%' }} />;
                default:
                  return <Input placeholder="Enter default value" />;
              }
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;