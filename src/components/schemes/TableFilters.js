import React from 'react';
import { 
  Input, 
  Button, 
  Space, 
  Checkbox,
  Menu,
  Dropdown,
  Divider,
  Typography
} from 'antd';
import { 
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// This is a regular function, not a React component
// It returns the filter configuration for a table column
const TableFilters = ({ 
  field, 
  placeholder, 
  onFilter, 
  filterOptions = null,
  useCheckboxFilter = false,
  dataSource = []
}) => {
  // Get unique values for the field from dataSource
  const getUniqueValues = () => {
    if (filterOptions) return filterOptions;
    
    const values = dataSource
      .map(item => item[field])
      .filter((value, index, self) => 
        value !== undefined && 
        value !== null && 
        self.indexOf(value) === index
      );
    
    return values.map(value => ({
      label: String(value),
      value: value
    }));
  };

  // Create the filter dropdown menu
  const createFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    if (useCheckboxFilter) {
      // Checkbox filter for multiple selection
      const options = getUniqueValues();
      
      return (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={options}
            value={selectedKeys}
            onChange={values => {
              setSelectedKeys(values.length ? values : []);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          />
          <Divider style={{ margin: '8px 0' }} />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                onFilter(field, selectedKeys);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                onFilter(field, []);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      );
    } else {
      // Text search filter
      return (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${placeholder || field}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => {
              confirm();
              onFilter(field, selectedKeys[0]);
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                onFilter(field, selectedKeys[0]);
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                onFilter(field, '');
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      );
    }
  };

  // Return the filter configuration for the column
  return {
    filterDropdown: createFilterDropdown,
    filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      if (!value) return true;
      
      if (useCheckboxFilter && Array.isArray(value)) {
        return value.includes(record[field]);
      }
      
      const fieldValue = record[field];
      if (fieldValue === undefined || fieldValue === null) return false;
      
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    }
  };
};

export default TableFilters;