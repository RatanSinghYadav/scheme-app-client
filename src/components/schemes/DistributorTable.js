import React, { useState, useMemo } from 'react';
import { Table, Typography, Button, Space } from 'antd';

const { Text } = Typography;

const DistributorTable = ({
  columns,
  filteredDistributors,
  selectedDistributorKeys,
  setSelectedDistributorKeys,
  setSelectedDistributors,
  tableHeight = 400,
  tableWidth = "100%",
  loading = false
}) => {
  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['50', '100', '200'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
  });

  // Distributor row selection
  const distributorRowSelection = {
    selectedRowKeys: selectedDistributorKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDistributorKeys(selectedRowKeys);
      setSelectedDistributors(selectedRows);
    },
    // Optimized for performance
    getCheckboxProps: record => ({
      name: record.key,
    }),
  };

  // Memoized columns and data
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => filteredDistributors, [filteredDistributors]);

  // Function to select all filtered distributors
  const selectAllFiltered = () => {
    // Get keys of all currently filtered distributors
    const filteredKeys = filteredDistributors.map(item => item.key);
    setSelectedDistributorKeys(filteredKeys);
    setSelectedDistributors(filteredDistributors);
  };

  // Function to clear all selections
  const clearAllSelections = () => {
    setSelectedDistributorKeys([]);
    setSelectedDistributors([]);
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  return (
    <div>
      <div style={{
        marginBottom: '10px',
        textAlign: 'left',
        padding: '8px',
        // backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Text strong>Total Selected Distributors: {selectedDistributorKeys.length}</Text>
        <Text strong>Total Groups: {filteredDistributors.length}</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button onClick={selectAllFiltered} size="small">Select All</Button>
        <Button onClick={clearAllSelections} size="small">Clear All</Button>
      </div>

      <Table
        rowSelection={{
          type: 'checkbox',
          ...distributorRowSelection,
          // Optimized for performance
          columnWidth: 40,
          fixed: true
        }}
        columns={memoizedColumns} // Use memoized columns
        dataSource={memoizedData} // Use memoized data
        pagination={{
          ...pagination,
          total: filteredDistributors.length,
          onChange: handlePaginationChange,
          onShowSizeChange: handlePaginationChange,
          showQuickJumper: true,
        }}
        size="small"
        bordered
        loading={loading}
        scroll={{
          y: tableHeight,
          x: tableWidth
        }}
        style={{
          maxHeight: tableHeight,
          width: tableWidth,
        }}
        // Optimized for performance
        virtual={filteredDistributors.length > 200}
      />
    </div>
  );
};

export default DistributorTable;