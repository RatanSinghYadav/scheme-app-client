import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Checkbox,
  Divider
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';

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

  // Update local state when selectedKeys changes
  useEffect(() => {
    setSelectedValues(selectedKeys || []);
  }, [selectedKeys]);

  // Filter options based on search text
  const filteredOptions = options.filter(option =>
    String(option.label).toLowerCase().includes(searchText.toLowerCase())
  );

  // Select all filtered options
  const selectAllFiltered = () => {
    // Get values of all filtered options
    const filteredValues = filteredOptions.map(option => option.value);
    
    // Combine with existing selections (avoiding duplicates)
    const combinedValues = [...new Set([...selectedValues, ...filteredValues])];
    
    setSelectedValues(combinedValues);
    setSelectedKeys(combinedValues);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedValues([]);
    setSelectedKeys([]);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (values) => {
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
  };

  return (
    <div style={{ padding: 8, width: 220, maxHeight: 500, overflow: 'auto' }}>
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
        >
          Select All
        </Button>
        <Button
          size="small"
          onClick={clearAll}
        >
          Clear
        </Button>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      <div style={{ maxHeight: 250, overflow: 'auto', marginBottom: 8 }}>
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
      </div>

      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            confirm();
            onFilter(field, selectedValues);
          }}
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
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CheckboxFilter;