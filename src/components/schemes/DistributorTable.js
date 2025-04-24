import React from 'react';
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
  // Distributor row selection
  const distributorRowSelection = {
    selectedRowKeys: selectedDistributorKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDistributorKeys(selectedRowKeys);
      setSelectedDistributors(selectedRows);
    }
  };

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
        <Text strong>Total Distributors: {filteredDistributors.length}</Text>
      </div>


      <Table
        rowSelection={{
          type: 'checkbox',
          ...distributorRowSelection
        }}
        columns={columns} // Use the columns prop
        dataSource={filteredDistributors} // Use the filtered distributors directly
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
          width: tableWidth,
        }}
      />
    </div>
  );
};

export default DistributorTable;