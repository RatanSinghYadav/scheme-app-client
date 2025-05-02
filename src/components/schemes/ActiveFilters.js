import React from 'react';
import { Tag, Button, Space, Typography } from 'antd';
import { CloseOutlined, ClearOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * ActiveFilters Component
 * 
 * This component displays all currently active filters and allows users to remove them
 * individually or clear all filters at once.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Object containing active filters
 * @param {Function} props.onRemoveFilter - Function to call when removing a single filter
 * @param {Function} props.onClearFilters - Function to call when clearing all filters
 * @returns {JSX.Element} ActiveFilters component
 */
const ActiveFilters = ({ filters, onRemoveFilter, onClearFilters }) => {
  // Check if there are any active filters
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] && (
      (Array.isArray(filters[key]) && filters[key].length > 0) || 
      (!Array.isArray(filters[key]) && filters[key])
    )
  );

  if (!hasActiveFilters) {
    return null; // Don't render anything if no active filters
  }

  // Format filter values for display
  const formatFilterValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Active Filters:</Text>
          <Button 
            type="link" 
            icon={<ClearOutlined />} 
            onClick={onClearFilters}
            size="small"
          >
            Clear All
          </Button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(filters).map(([field, value]) => {
            // Skip empty filters
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return null;
            }
            
            return (
              <Tag 
                key={field}
                closable
                onClose={() => onRemoveFilter(field)}
                color="blue"
              >
                <span style={{ fontWeight: 'bold' }}>{field}:</span> {formatFilterValue(value)}
              </Tag>
            );
          })}
        </div>
      </Space>
    </div>
  );
};

export default ActiveFilters;