import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Menu, Space, Typography, message, Popconfirm } from 'antd';
import { SaveOutlined, DeleteOutlined, LoadingOutlined, FilterOutlined, DownOutlined } from '@ant-design/icons';
import { url } from '../../utils/constent'; // Import API base URL

const { Title } = Typography;

/**
 * FilterPresets Component
 * 
 * This component allows users to save, load, and manage filter presets.
 * It can be used for both product and distributor filters.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onApplyPreset - Function to apply a preset filter
 * @param {Object} props.currentFilters - Current active filters
 * @param {Boolean} props.productFilters - Flag to indicate if these are product filters
 * @returns {JSX.Element} FilterPresets component
 */
const FilterPresets = ({ onApplyPreset, currentFilters, productFilters = false }) => {
    // State for presets and UI
    const [presets, setPresets] = useState([]);
    const [presetName, setPresetName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveMode, setSaveMode] = useState(false);
    
    // Determine preset type based on filter type
    const presetType = productFilters ? 'product' : 'distributor';
    
    // Load saved presets on component mount
    useEffect(() => {
        fetchPresets();
    }, [presetType]);
    
    // Fetch presets from the server
    const fetchPresets = async () => {
        try {
            setLoading(true);
            // Get auth token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${url}/api/filter-presets?type=${presetType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data && data.success) {
                setPresets(data.data);
            }
        } catch (error) {
            console.error('Error loading filter presets:', error);
            message.error('Failed to load filter presets');
        } finally {
            setLoading(false);
        }
    };
    
    // Save current filters as a new preset
    const savePreset = async () => {
        if (!presetName.trim()) {
            message.error('Please enter a preset name');
            return;
        }
        
        if (Object.keys(currentFilters || {}).length === 0) {
            message.error('No active filters to save');
            return;
        }
        
        try {
            setLoading(true);
            
            // Get auth token from localStorage
            const token = localStorage.getItem('token');
            
            // Check if preset name already exists
            const existingPreset = presets.find(p => p.name === presetName);
            
            const presetData = {
                name: presetName,
                type: presetType,
                filters: currentFilters
            };
            
            let response;
            
            if (existingPreset) {
                // Update existing preset
                response = await fetch(`${url}/api/filter-presets/${existingPreset._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(presetData)
                });
                
                if (response.ok) {
                    message.success(`Preset "${presetName}" updated`);
                } else {
                    throw new Error('Failed to update preset');
                }
            } else {
                // Create new preset
                response = await fetch(`${url}/api/filter-presets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(presetData)
                });
                
                if (response.ok) {
                    message.success(`New preset "${presetName}" saved`);
                } else {
                    throw new Error('Failed to create preset');
                }
            }
            
            // Refresh presets list
            fetchPresets();
            
            // Reset form
            setPresetName('');
            setSaveMode(false);
        } catch (error) {
            console.error('Error saving filter preset:', error);
            message.error('Failed to save filter preset');
        } finally {
            setLoading(false);
        }
    };
    
    // Delete a preset
    const deletePreset = async (presetId, e) => {
        if (e) e.stopPropagation();
        
        try {
            setLoading(true);
            
            // Get auth token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${url}/api/filter-presets/${presetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                message.success('Preset deleted');
                // Refresh presets list
                fetchPresets();
            } else {
                throw new Error('Failed to delete preset');
            }
        } catch (error) {
            console.error('Error deleting filter preset:', error);
            message.error('Failed to delete filter preset');
        } finally {
            setLoading(false);
        }
    };
    
    // Apply a preset to the filters
    const handleApplyPreset = (preset) => {
        setLoading(true);
        
        // Small delay to show loading state
        setTimeout(() => {
            onApplyPreset(preset.filters);
            setLoading(false);
        }, 300);
    };
    
    // Generate menu items for dropdown
    const menuItems = presets.map(preset => ({
        key: preset._id,
        label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                    <div>{preset.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {Object.keys(preset.filters).length} filters • {new Date(preset.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <Space>
                    <Button 
                        type="link" 
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleApplyPreset(preset);
                        }}
                    >
                        {loading ? <LoadingOutlined /> : 'Apply'}
                    </Button>
                    <Popconfirm
                        title="Delete this preset?"
                        onConfirm={(e) => deletePreset(preset._id, e)}
                        okText="Yes"
                        cancelText="No"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button 
                            type="link" 
                            danger 
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                </Space>
            </div>
        ),
        onClick: () => handleApplyPreset(preset)
    }));
    
    // Add a "Save New Preset" option at the bottom
    menuItems.push({
        type: 'divider'
    });
    
    menuItems.push({
        key: 'save-new',
        label: 'Save New Preset',
        onClick: () => setSaveMode(true)
    });
    
    const menu = {
        items: menuItems
    };
    
    return (
        <div style={{ marginTop: '16px' }}>
            {saveMode ? (
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Enter preset name"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        onPressEnter={savePreset}
                        autoFocus
                    />
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={savePreset}
                        disabled={!presetName.trim() || Object.keys(currentFilters || {}).length === 0}
                        loading={loading}
                    >
                        Save
                    </Button>
                    <Button onClick={() => setSaveMode(false)}>
                        Cancel
                    </Button>
                </Space.Compact>
            ) : (
                <Dropdown menu={menu} trigger={['click']}>
                    <Button style={{ width: '100%' }}>
                        <Space>
                            <FilterOutlined />
                            Filter Presets
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            )}
        </div>
    );
};

export default FilterPresets;