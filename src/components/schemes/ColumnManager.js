import React, { useState } from 'react';
import { 
  Button, 
  Popover, 
  Checkbox
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const ColumnManager = ({ 
  columns, 
  visibleColumns, 
  onColumnChange,
  excludeKeys = ['sr']
}) => {
  const [visible, setVisible] = useState(false);

  const handleVisibilityChange = (columnKey) => {
    if (visibleColumns.includes(columnKey)) {
      onColumnChange(visibleColumns.filter(key => key !== columnKey));
    } else {
      onColumnChange([...visibleColumns, columnKey]);
    }
  };

  const columnSettingsContent = (
    <div style={{ padding: 8, width: 200 }}>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <Checkbox 
          indeterminate={
            visibleColumns.length > 0 && 
            visibleColumns.length < columns.filter(col => !excludeKeys.includes(col.key)).length
          }
          checked={
            visibleColumns.length === columns.filter(col => !excludeKeys.includes(col.key)).length
          }
          onChange={e => {
            const allColumnKeys = columns
              .filter(col => !excludeKeys.includes(col.key))
              .map(col => col.key);
            onColumnChange(e.target.checked ? allColumnKeys : []);
          }}
          style={{ marginBottom: 8 }}
        >
          (Select All)
        </Checkbox>
      </div>
      
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {columns
          .filter(col => !excludeKeys.includes(col.key))
          .map(column => (
            <div key={column.key} style={{ marginBottom: 8 }}>
              <Checkbox
                checked={visibleColumns.includes(column.key)}
                onChange={() => handleVisibilityChange(column.key)}
              >
                {column.title}
              </Checkbox>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <Popover
      content={columnSettingsContent}
      title="Column Settings"
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
    >
      <Button 
        icon={<SettingOutlined />}
        onClick={() => setVisible(!visible)}
      >
        Columns
      </Button>
    </Popover>
  );
};

export default ColumnManager;