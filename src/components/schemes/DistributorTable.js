import React, { useState, useMemo, useCallback } from 'react';
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

  // Distributor row selection - optimized with useCallback
  const distributorRowSelection = useMemo(() => ({
    selectedRowKeys: selectedDistributorKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDistributorKeys(selectedRowKeys);
      setSelectedDistributors(selectedRows);
    },
    // Optimized for performance
    getCheckboxProps: record => ({
      name: record.key,
    }),
    columnWidth: 40,
    fixed: true
  }), [selectedDistributorKeys, setSelectedDistributorKeys, setSelectedDistributors]);

  // Memoized columns and data
  const memoizedColumns = useMemo(() => columns, [columns]);
  
  // Function to select all filtered distributors - optimized with useCallback
  const selectAllFiltered = useCallback(() => {
    // For large datasets, use a more efficient approach
    if (filteredDistributors.length > 1000) {
      // Process in batches to prevent UI freeze
      const batchSize = 1000;
      const totalBatches = Math.ceil(filteredDistributors.length / batchSize);
      
      let currentBatch = 0;
      const allKeys = [];
      const allDistributors = [];
      
      const processBatch = () => {
        if (currentBatch >= totalBatches) {
          // All batches processed, update state
          setSelectedDistributorKeys(allKeys);
          setSelectedDistributors(allDistributors);
          return;
        }
        
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, filteredDistributors.length);
        
        for (let i = start; i < end; i++) {
          allKeys.push(filteredDistributors[i].key);
          allDistributors.push(filteredDistributors[i]);
        }
        
        currentBatch++;
        setTimeout(processBatch, 0);
      };
      
      processBatch();
    } else {
      // For smaller datasets, use the original approach
      const filteredKeys = filteredDistributors.map(item => item.key);
      setSelectedDistributorKeys(filteredKeys);
      setSelectedDistributors(filteredDistributors);
    }
  }, [filteredDistributors, setSelectedDistributorKeys, setSelectedDistributors]);

  // Function to clear all selections - optimized with useCallback
  const clearAllSelections = useCallback(() => {
    setSelectedDistributorKeys([]);
    setSelectedDistributors([]);
  }, [setSelectedDistributorKeys, setSelectedDistributors]);

  // Handle pagination change - optimized with useCallback
  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  }, [pagination]);

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
          ...distributorRowSelection
        }}
        columns={memoizedColumns}
        dataSource={filteredDistributors}
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