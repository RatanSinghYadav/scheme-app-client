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
            const filtered = filteredOptions.map(o => o.value);
            setSelectedValues(filtered);
            setSelectedKeys(filtered);
            confirm();
            onFilter(field, filtered);
          }}
        />
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => {
            const allValues = options.map(o => o.value);
            setSelectedValues(allValues);
            setSelectedKeys(allValues);
          }}
        >
          Select All
        </Button>
        <Button
          size="small"
          onClick={() => {
            setSelectedValues([]);
            setSelectedKeys([]);
          }}
        >
          Clear
        </Button>
      </div>
      
      <div style={{ maxHeight: 250, overflow: 'auto', marginBottom: 8 }}>
        <Checkbox.Group 
          options={filteredOptions}
          value={selectedValues}
          onChange={values => {
            setSelectedValues(values);
            setSelectedKeys(values);
          }}
          style={{ display: 'flex', flexDirection: 'column' }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          onClick={() => {
            confirm();
            onFilter(field, selectedValues);
          }}
          size="small"
        >
          OK
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            setSelectedValues([]);
            setSearchText('');
            onFilter(field, []);
          }}
          size="small"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CheckboxFilter;