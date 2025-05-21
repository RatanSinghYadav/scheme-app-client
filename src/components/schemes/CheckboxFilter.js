import React, { useState, useEffect, useMemo } from 'react';
import {
  Input,
  Button,
  Checkbox,
  Divider,
  Spin,
  Typography,
  List,
  Tag,
  Space
} from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CheckboxFilter = ({
  options,
  onFilter,
  field,
  placeholder = "Search",
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update local state when selectedKeys changes
  useEffect(() => {
    setSelectedValues(selectedKeys || []);
  }, [selectedKeys]);

  // Filter options based on search text - using useMemo for optimization
  const filteredOptions = useMemo(() => {
    // If there are too many options, only filter when search text is provided
    if (options.length > 1000 && !searchText) {
      return options.slice(0, 100); // Show only first 100 options initially
    }
    
    return options.filter(option =>
      String(option.label).toLowerCase().includes(searchText.toLowerCase())
    ).slice(0, 500); // Limit to 500 results for performance
  }, [options, searchText]);

  // Select all filtered options
  const selectAllFiltered = () => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      // Get values of all filtered options
      const filteredValues = filteredOptions.map(option => option.value);
      
      // Combine with existing selections (avoiding duplicates)
      const combinedValues = [...new Set([...selectedValues, ...filteredValues])];
      
      setSelectedValues(combinedValues);
      setSelectedKeys(combinedValues);
      setLoading(false);
    }, 10);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedValues([]);
    setSelectedKeys([]);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (values) => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      // Get the currently visible checkboxes
      const visibleValues = filteredOptions.map(option => option.value);
      
      // Find which values from the visible options are selected
      const selectedVisibleValues = values.filter(value => visibleValues.includes(value));
      
      // Find which values from the previous selection are not visible (to keep them)
      const selectedHiddenValues = selectedValues.filter(value => !visibleValues.includes(value));
      
      // Combine visible selections with hidden selections
      const newSelectedValues = [...selectedHiddenValues, ...selectedVisibleValues];
      
      setSelectedValues(newSelectedValues);
      setSelectedKeys(newSelectedValues);
      setLoading(false);
    }, 10);
  };

  // Remove a single selected item
  const removeSelectedItem = (value) => {
    const newSelectedValues = selectedValues.filter(v => v !== value);
    setSelectedValues(newSelectedValues);
    setSelectedKeys(newSelectedValues);
  };

  // Get label for a value
  const getLabelForValue = (value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Render selected items section
  const renderSelectedItems = () => {
    if (selectedValues.length === 0) return null;
    
    return (
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text strong>Selected Items ({selectedValues.length}):</Text>
          <Button size="small" type="link" onClick={clearAll}>Clear All</Button>
        </div>
        <div style={{ maxHeight: 100, overflowY: 'auto', padding: '4px 0' }}>
          <Space size={[4, 8]} wrap>
            {selectedValues.map(value => (
              <Tag 
                key={value} 
                closable 
                onClose={() => removeSelectedItem(value)}
                style={{ margin: '2px 0' }}
              >
                {getLabelForValue(value)}
              </Tag>
            ))}
          </Space>
        </div>
      </div>
    );
  };

  // Render virtualized checkbox list for better performance
  const renderCheckboxList = () => {
    if (options.length > 5000) {
      return (
        <div>
          <Text type="secondary">
            Too many options ({options.length}). Please use search to filter.
          </Text>
          {filteredOptions.length > 0 && searchText && (
            <List
              size="small"
              dataSource={filteredOptions.slice(0, 100)}
              renderItem={option => (
                <List.Item>
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={e => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value);
                      setSelectedValues(newValues);
                      setSelectedKeys(newValues);
                    }}
                  >
                    {option.label}
                  </Checkbox>
                </List.Item>
              )}
            />
          )}
        </div>
      );
    }
    
    return (
      <Checkbox.Group
        value={selectedValues.filter(value => 
          filteredOptions.some(option => option.value === value)
        )}
        onChange={handleCheckboxChange}
        style={{ width: '100%' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredOptions.map(option => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    );
  };

  return (
    <div style={{ padding: 8, width: 250, maxHeight: 500, overflow: 'auto' }}>
      <div style={{ marginBottom: 8 }}>
        <Input
          placeholder={placeholder}
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
          }}
          style={{ width: '100%' }}
          allowClear
          onPressEnter={() => {
            confirm();
            onFilter(field, selectedValues);
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Button
          size="small"
          onClick={selectAllFiltered}
          disabled={loading}
        >
          Select All
        </Button>
        <Button
          size="small"
          onClick={clearAll}
          disabled={loading}
        >
          Clear
        </Button>
      </div>

      {/* Show selected items */}
      {renderSelectedItems()}

      <Divider style={{ margin: '8px 0' }} />

      <div style={{ maxHeight: 250, overflow: 'auto', marginBottom: 8 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin size="small" />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Loading...</Text>
            </div>
          </div>
        ) : (
          renderCheckboxList()
        )}
      </div>

      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            confirm();
            onFilter(field, selectedValues);
          }}
          disabled={loading}
        >
          OK
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters();
            setSearchText('');
            setSelectedValues([]);
            onFilter(field, []);
          }}
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CheckboxFilter;