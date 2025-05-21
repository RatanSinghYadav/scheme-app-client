import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Form, Input, DatePicker, Space, Row, Col, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import DistributorTable from '../components/schemes/DistributorTable';
// Import the new component at the top with other imports
import BaseSchemeConfirmation from '../components/schemes/BaseSchemeConfirmation';
import ProductTable from '../components/schemes/ProductTable';
import TableFilters from '../components/schemes/TableFilters';
import CheckboxFilter from '../components/schemes/CheckboxFilter';
import SchemeColumns from '../components/schemes/SchemeColumns';
import SelectedProductsTable from '../components/schemes/SelectedProductsTable';
import FilterPresets from '../components/schemes/FilterPresets';
// Import the ActiveFilters component
import ActiveFilters from '../components/schemes/ActiveFilters';

import BaseSchemeTableColumns from '../components/schemes/BaseSchemeTableColumns';

import { url } from '../utils/constent';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const BaseSchemeCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Scheme data state
    const [schemeData, setSchemeData] = useState({
        schemeCode: 'SCHM' + Math.floor(Math.random() * 100000).toString().padStart(8, '0'),
        startDate: null,
        endDate: null
    });

    const [loading, setLoading] = useState(false);
    const [distributorsLoading, setDistributorsLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);

    // Add this state variable with other state variables
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Distributors state
    const [distributors, setDistributors] = useState([]);
    const [filteredDistributors, setFilteredDistributors] = useState([]);
    const [selectedDistributorKeys, setSelectedDistributorKeys] = useState([]);
    const [selectedDistributors, setSelectedDistributors] = useState([]);
    const [distributorFilters, setDistributorFilters] = useState({});

    // Groups state
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [selectedGroupKeys, setSelectedGroupKeys] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [groupFilters, setGroupFilters] = useState({});

    // Products state
    const [productItems, setProductItems] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentProductFilters, setCurrentProductFilters] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [productFilters, setProductFilters] = useState({});
    const [visibleColumns, setVisibleColumns] = useState([
        'itemCode', 'flavour', 'brandName', 'itemName', 'packGroup', 'style', 'packType', 'nob', 'mrp', 'discountPrice'
    ]);

    // Final selected products
    const [finalSelectedProducts, setFinalSelectedProducts] = useState([]);

    // Custom columns for product table
    const [customColumns, setCustomColumns] = useState([]);

    // Load distributors, groups and products
    useEffect(() => {
        const fetchDistributors = async () => {
            setDistributorsLoading(true);
            try {
                const response = await fetch(`${url}/api/distributors/getAllDistributors`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    const distributorsWithKeys = data.data.map((dist, index) => ({
                        ...dist,
                        key: `dist-${index}`,
                        code: dist.CUSTOMERACCOUNT || '',
                        sm: dist.SMCODE || '',
                        group: dist.CUSTOMERGROUPID || dist.group || '',
                        name: dist.ORGANIZATIONNAME || dist.name || '',
                        city: dist.ADDRESSCITY || dist.city || '',
                    }));
                    setDistributors(distributorsWithKeys);
                    setFilteredDistributors(distributorsWithKeys);

                    // Extract unique groups
                    const uniqueGroups = [...new Set(distributorsWithKeys.map(dist => dist.group))].filter(group => group && group.trim() !== '');
                    const groupsWithKeys = uniqueGroups.map((group, index) => {
                        // Find all cities for this group
                        const citiesForGroup = [...new Set(
                            distributorsWithKeys
                                .filter(d => d.group === group)
                                .map(d => d.city)
                                .filter(Boolean) // Remove empty cities
                        )];

                        return {
                            key: `group-${index}`,
                            group: group,
                            city: citiesForGroup.join(', '), // Join all cities with comma
                        };
                    });
                    setGroups(groupsWithKeys);
                    setFilteredGroups(groupsWithKeys);
                } else {
                    message.error('Failed to load distributors');
                }
            } catch (error) {
                console.error('Error fetching distributors:', error);
                message.error('Failed to load distributors from server');
            } finally {
                setDistributorsLoading(false);
            }
        };

        const fetchProducts = async () => {
            setProductsLoading(true);
            try {
                const response = await fetch(`${url}/api/products/getAllProducts`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    const productsWithKeys = data.data.map((prod, index) => ({
                        ...prod,
                        key: `prod-${index}`,
                        itemCode: prod.ITEMID || '',
                        itemName: prod.ITEMNAME || '',
                        flavour: prod.FLAVOURTYPE || '',
                        brandName: prod.BRANDNAME || '',
                        packGroup: prod.PACKTYPEGROUPNAME || '',
                        style: prod.Style || '',
                        packType: prod.PACKTYPE || '',
                        nob: prod.NOB || '',
                        mrp: prod.Configuration || '',
                        discountPrice: 0,
                    }));
                    setProductItems(productsWithKeys);
                    setFilteredProducts(productsWithKeys);
                } else {
                    message.error('Failed to load products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                message.error('Failed to load products from server');
            } finally {
                setProductsLoading(false);
            }
        };

        fetchDistributors();
        fetchProducts();
    }, []);

    // Handle scheme code change
    const handleSchemeCodeChange = (e) => {
        setSchemeData({
            ...schemeData,
            schemeCode: e.target.value
        });
    };

    // Handle date range change
    const handleDateRangeChange = (dates) => {
        if (dates) {
            setSchemeData({
                ...schemeData,
                startDate: dates[0],
                endDate: dates[1]
            });
        } else {
            setSchemeData({
                ...schemeData,
                startDate: null,
                endDate: null
            });
        }
    };

    // Handle group filter
    const handleGroupFilter = (field, value) => {
        const newFilters = { ...groupFilters, [field]: value };
        setGroupFilters(newFilters);

        // Apply filters to groups
        let filtered = [...groups];
        Object.keys(newFilters).forEach(key => {
            const filterValue = newFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredGroups(filtered);
    };

    // Handle distributor filter
    const handleDistributorFilter = (field, value) => {
        const newFilters = { ...distributorFilters, [field]: value };
        setDistributorFilters(newFilters);

        // Apply filters to distributors
        let filtered = [...distributors];
        Object.keys(newFilters).forEach(key => {
            const filterValue = newFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredDistributors(filtered);
    };

    // Handle product filter
    const handleProductFilter = (field, value) => {
        const newFilters = { ...productFilters, [field]: value };
        setProductFilters(newFilters);

        // Apply filters to products
        let filtered = [...productItems];
        Object.keys(newFilters).forEach(key => {
            const filterValue = newFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredProducts(filtered);
    };

    // Handle add selected products
    const handleAddSelectedProducts = () => {
        if (selectedRowKeys.length === 0) {
            message.error('Please select at least one product');
            return;
        }

        // Get selected products from productItems
        const productsToAdd = selectedRowKeys.map(key => {
            const product = productItems.find(item => item.key === key);
            return { ...product };
        });

        // Add to final selected products
        setFinalSelectedProducts([...finalSelectedProducts, ...productsToAdd]);

        // Clear selection
        setSelectedRowKeys([]);

        message.success(`${productsToAdd.length} products added to selection`);
    };

    // Handle remove product from final selection
    const handleRemoveProduct = (productKey) => {
        setFinalSelectedProducts(finalSelectedProducts.filter(product => product.key !== productKey));
    };

    // Get unique values for a field
    const getUniqueFieldOptions = (field) => {
        if (field === 'group') {
            const values = [...new Set(groups.map(item => item[field]))];
            return values.filter(Boolean).map(value => ({
                label: String(value),
                value: value
            }));
        } else if (field === 'city') {
            const values = [...new Set(groups.map(item => item[field]))];
            return values.filter(Boolean).map(value => ({
                label: String(value),
                value: value
            }));
        } else {
            const values = [...new Set(productItems.map(item => item[field]))];
            return values.filter(Boolean).map(value => ({
                label: String(value),
                value: value
            }));
        }
    };

    // Get flavour options for filter
    const getFlavourOptions = () => {
        const flavours = [...new Set(productItems.map(item => item.flavour))];
        return flavours.filter(Boolean).map(flavour => ({
            label: flavour,
            value: flavour
        }));
    };

    // Handle save scheme
    const handleSaveScheme = async () => {
        if (!schemeData.schemeCode) {
            message.error('Please enter scheme code');
            return;
        }

        if (!schemeData.startDate || !schemeData.endDate) {
            message.error('Please select scheme duration');
            return;
        }

        if (selectedGroupKeys.length === 0 && selectedDistributorKeys.length === 0) {
            message.error('Please select at least one distributor group or distributor');
            return;
        }

        if (finalSelectedProducts.length === 0) {
            message.error('Please select at least one product');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Prepare the scheme data for submission
            const schemePayload = {
                schemeCode: schemeData.schemeCode,
                startDate: schemeData.startDate,
                endDate: schemeData.endDate,
                distributorType: selectedGroupKeys.length > 0 ? 'group' : 'individual',
                distributors: selectedGroupKeys.length > 0
                    ? selectedGroups.map(group => (group.group))
                    : selectedDistributors.map(dist => dist._id || dist.id), // Send distributor IDs
                products: finalSelectedProducts.map(product => {
                    return {
                        itemCode: product.itemCode,
                        itemName: product.itemName,
                        brandName: product.brandName,
                        flavour: product.flavour,
                        packType: product.packType,
                        packGroup: product.packGroup,
                        Style: product.style,
                        NOB: product.nob,
                        Configuration: product.mrp,
                        discountPrice: product.discountPrice,
                        customFields: product.customFields || {}
                    };
                })
            };

            console.log('Scheme payload:', schemePayload);
            console.log('Selected distributors:', selectedDistributors);
            console.log('selected groupus:', selectedGroups);

            const response = await fetch(`${url}/api/base/schemes/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(schemePayload)
            });

            const data = await response.json();

            console.log('Scheme creation response:', data);

            if (data.success) {
                message.success('Base scheme created successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to create scheme');
            }
        } catch (error) {
            console.error('Error creating scheme:', error);
            message.error('Failed to create scheme: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


    // Add this function to handle confirmation modal
    const handleConfirmScheme = () => {
        setShowConfirmation(true);
    };

    // Add this function to handle confirmation cancel
    const handleConfirmationCancel = () => {
        setShowConfirmation(false);
    };

    // Add this function to handle confirmation submit
    const handleConfirmationSubmit = () => {
        setShowConfirmation(false);
        handleSaveScheme();
    };

    // Handle back button
    const handleBack = () => {
        navigate('/schemes');
    };

    // Handle product filter change
    const handleProductFilterChange = (field, value) => {
        const newFilters = {
            ...productFilters,
            [field]: value
        };
        setProductFilters(newFilters);
        setCurrentProductFilters(newFilters);

        // Apply filters
        let filtered = [...productItems];
        Object.keys(newFilters).forEach(key => {
            const filterValue = newFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredProducts(filtered);
    };

    // Get filtered products based on current filters
    const getFilteredProducts = () => {
        // Start with all products
        let filtered = [...productItems];

        // Apply each active filter
        Object.entries(productFilters).forEach(([field, values]) => {
            if (values && values.length > 0) {
                filtered = filtered.filter(item => values.includes(item[field]));
            }
        });

        return filtered;
    };

    // Handle discount price for all filtered products
    // Add this function to calculate discount based on flavour type
    const calculateDiscountByFlavour = (flavour, discountValue) => {
        // Convert discount value to number if it's a string
        const discountAmount = typeof discountValue === 'string' ? parseFloat(discountValue) : discountValue;

        // Default denominator
        let denominator = 100;

        // Apply discount based on flavour type according to the chart
        switch (flavour?.toUpperCase()) {
            case 'JUICE':
            case 'JUICE RGB':
                denominator = 112;
                break;
            case 'SPARKLING':
            case 'SPARKLING RGB':
            case 'SPARKLE JUICE':
                denominator = 140;
                break;
            case 'WATER':
            case 'SMART WATER':
            case 'SODA':
            case 'SODA RGB':
            case 'SCHWEPPES':
                denominator = 118;
                break;
            default:
                denominator = 100;
        }

        // Calculate discount amount based on the formula (discount × 100 / denominator)
        // This gives us the correct discount value according to the formula
        return parseFloat(((discountAmount * 100) / denominator).toFixed(2));
    };

    // Modify the handleDiscountPriceAll function to use flavour-based calculation
    const handleDiscountPriceAll = (value) => {
        // Get currently filtered products
        const productsToUpdate = getFilteredProducts();

        if (productsToUpdate.length === 0) {
            message.info('No products to apply discount');
            return;
        }

        const updatedItems = [...productItems];

        // Apply discount to all filtered products
        productsToUpdate.forEach(filteredProduct => {
            const index = updatedItems.findIndex(item => item.key === filteredProduct.key);
            if (index !== -1) {
                // If value is empty, remove discount by setting to 0
                if (value === undefined || value === null || value === '') {
                    updatedItems[index] = {
                        ...updatedItems[index],
                        discountPrice: 0
                    };
                } else {
                    // Calculate discount based on flavour using the user-provided discount value
                    const discountValue = calculateDiscountByFlavour(
                        updatedItems[index].flavour,
                        value // Use the user-provided discount value instead of MRP
                    );

                    updatedItems[index] = {
                        ...updatedItems[index],
                        discountPrice: discountValue
                    };
                }
            }
        });

        setProductItems(updatedItems);

        // Update filtered products with new discount prices
        // But DO NOT reset the filters
        setFilteredProducts(productsToUpdate.map(item => {
            const updatedItem = updatedItems.find(updated => updated.key === item.key);
            return updatedItem || item;
        }));

        if (value === undefined || value === null || value === '') {
            message.success(`Discount removed from ${productsToUpdate.length} products`);
        } else {
            message.success(`Flavour-based discount applied to ${productsToUpdate.length} products`);
        }
    };

    // Handle form field changes
    const handleFormChange = (changedValues) => {
        setSchemeData({
            ...schemeData,
            ...changedValues
        });
    };

    // Handle product filter preset application
    const handleApplyProductPreset = (presetFilters) => {
        setProductFilters(presetFilters);
        setCurrentProductFilters(presetFilters);

        // Apply filters to products
        let filtered = [...productItems];
        Object.keys(presetFilters).forEach(key => {
            const filterValue = presetFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredProducts(filtered);
    };

    // Define columns for groups table
    const groupColumns = BaseSchemeTableColumns.getGroupColumns(groups, handleGroupFilter, getUniqueFieldOptions);

    // Define distributor columns
    const distributorColumns = BaseSchemeTableColumns.getDistributorColumns(distributors, handleDistributorFilter);

    // Define all possible product columns using the SchemeColumns component
    const allProductColumns = SchemeColumns.getProductColumns(
        getUniqueFieldOptions,
        getFlavourOptions,
        handleProductFilterChange,
        productItems,
        setProductItems,
        filteredProducts,
        setFilteredProducts,
        customColumns
    );

    // Handle removing a single product filter
    const handleRemoveProductFilter = (field) => {
        const newFilters = { ...productFilters };
        delete newFilters[field];
        setProductFilters(newFilters);
        setCurrentProductFilters(newFilters);

        // Re-apply remaining filters
        let filtered = [...productItems];
        Object.keys(newFilters).forEach(key => {
            const filterValue = newFilters[key];
            if (filterValue && filterValue.length > 0) {
                filtered = filtered.filter(item => {
                    if (Array.isArray(filterValue)) {
                        return filterValue.includes(item[key]);
                    }
                    return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
                });
            }
        });

        setFilteredProducts(filtered);
    };

    // Handle clearing all product filters
    const handleClearProductFilters = () => {
        setProductFilters({});
        setCurrentProductFilters({});
        setFilteredProducts([...productItems]);
    };

    return (
        <div style={{ padding: '16px', marginBottom: '46px' }}>

            {/* Add the BaseSchemeConfirmation component */}
            <BaseSchemeConfirmation visible={showConfirmation} onCancel={handleConfirmationCancel} onConfirm={handleConfirmationSubmit} schemeData={schemeData} form={form} selectedDistributorKeys={selectedDistributorKeys} selectedDistributors={selectedDistributors} selectedProducts={finalSelectedProducts} productItems={productItems} selectedGroups={selectedGroups} customColumns={customColumns} />

            <Card style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Title level={4}>Create Base Scheme</Title>
                    <Space>
                        <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                            Back
                        </Button>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleConfirmScheme} loading={loading}>
                            Save Scheme
                        </Button>
                    </Space>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={schemeData}
                    onValuesChange={handleFormChange}
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="schemeCode"
                                label="Scheme Code"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="dateRange"
                                label="Scheme Duration"
                                rules={[{ required: true, message: 'Please select date range' }]}
                            >
                                <DatePicker.RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Start date', 'End date']}
                                    format="DD-MM-YYYY"
                                    onChange={(dates) => {
                                        if (dates) {
                                            setSchemeData({
                                                ...schemeData,
                                                startDate: dates[0],
                                                endDate: dates[1]
                                            });

                                            // Set individual fields so they can be used in BaseSchemeConfirmation
                                            form.setFieldsValue({
                                                startDate: dates[0],
                                                endDate: dates[1]
                                            });
                                        } else {
                                            setSchemeData({
                                                ...schemeData,
                                                startDate: null,
                                                endDate: null
                                            });

                                            // Reset individual fields
                                            form.setFieldsValue({
                                                startDate: null,
                                                endDate: null
                                            });
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="Select Groups" style={{ marginBottom: '46px' }}>
                        <DistributorTable
                            columns={groupColumns}
                            filteredDistributors={filteredGroups}
                            selectedDistributorKeys={selectedGroupKeys}
                            setSelectedDistributorKeys={setSelectedGroupKeys}
                            setSelectedDistributors={setSelectedGroups}
                            tableHeight={300}
                            loading={distributorsLoading}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card title="Select Distributors" style={{ marginBottom: '16px' }}>
                        <DistributorTable
                            columns={distributorColumns}
                            filteredDistributors={filteredDistributors}
                            selectedDistributorKeys={selectedDistributorKeys}
                            setSelectedDistributorKeys={setSelectedDistributorKeys}
                            setSelectedDistributors={setSelectedDistributors}
                            tableHeight={300}
                            loading={distributorsLoading}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Product Selection */}
            <Card title="Select Products">
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Add FilterPresets component here */}
                        <FilterPresets
                            onApplyPreset={handleApplyProductPreset}
                            currentFilters={currentProductFilters}
                            productFilters={true}
                        />

                        {/* Add ActiveFilters component here */}
                        <ActiveFilters
                            filters={productFilters}
                            onRemoveFilter={handleRemoveProductFilter}
                            onClearFilters={handleClearProductFilters}
                        />
                    </div>
                    <div>
                        <Space>
                            <Input placeholder="Apply Discount" style={{ width: 150 }} addonBefore="₹" onChange={(e) => {
                                // Apply discount when value changes (including when cleared)
                                handleDiscountPriceAll(e.target.value);
                            }}
                                allowClear
                            />

                            {/* Add button to add selected products */}
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSelectedProducts} disabled={selectedRowKeys.length === 0}>
                                Add Selected Products
                            </Button>
                        </Space>
                    </div>
                </div>


                <ProductTable productItems={productItems} setProductItems={setProductItems} columns={allProductColumns} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} filteredProducts={filteredProducts} handleDiscountPriceAll={handleDiscountPriceAll} customColumns={customColumns} tableHeight={400} tableWidth="100%" loading={productsLoading} />

                {/* Show selected products table if there are any */}
                {finalSelectedProducts.length > 0 && (
                    <Card title="Selected Products" style={{ marginBottom: '20px' }}>
                        <SelectedProductsTable
                            selectedProducts={finalSelectedProducts}
                            removeProduct={handleRemoveProduct}
                            customColumns={customColumns}
                        />
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default BaseSchemeCreate;
