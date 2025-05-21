import React, { useMemo } from 'react';
import { 
  Input, 
  Button, 
  Space, 
  Checkbox,
  Menu,
  Dropdown,
  Divider,
  Typography,
  Spin
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
  // Get unique values for the field from dataSource - using useMemo for optimization
  const getUniqueValues = useMemo(() => {
    if (filterOptions) return filterOptions;
    
    // Limit to first 1000 items for performance
    const limitedDataSource = dataSource.slice(0, 1000);
    
    const valueMap = new Map();
    limitedDataSource.forEach(item => {
      const value = item[field];
      if (value !== undefined && value !== null) {
        valueMap.set(value, true);
      }
    });
    
    return Array.from(valueMap.keys()).map(value => ({
      label: String(value),
      value: value
    }));
  }, [dataSource, field, filterOptions]);

  // Create the filter dropdown menu
  const createFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    if (useCheckboxFilter) {
      // Checkbox filter for multiple selection
      const options = getUniqueValues;
      
      // Show loading indicator if there are too many options
      if (dataSource.length > 5000) {
        return (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${placeholder || field}`}
              onChange={e => {
                const value = e.target.value;
                setSelectedKeys(value ? [value] : []);
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
            <Divider style={{ margin: '8px 0' }} />
            <Text type="secondary">
              Too many options to display. Please use search instead.
            </Text>
          </div>
        );
      }
      
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