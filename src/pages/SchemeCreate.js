import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Form, Input, DatePicker, Space, Row, Col, message, Modal, Select } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, FilterOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AuthContext } from '../context/AuthContext';
import DistributorTable from '../components/schemes/DistributorTable';
import ProductTable from '../components/schemes/ProductTable';
import TableFilters from '../components/schemes/TableFilters';
import CheckboxFilter from '../components/schemes/CheckboxFilter';

// Import the AddColumnModal component
import AddColumnModal from '../components/schemes/AddColumnModal';

// Import the new component at the top with other imports
import SchemeConfirmation from '../components/schemes/SchemeConfirmation';
import SchemeColumns from '../components/schemes/SchemeColumns';
import { url } from '../utils/constent.js';
import SelectedProductsTable from '../components/schemes/SelectedProductsTable';

const { Title } = Typography;

const SchemeCreate = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [form] = Form.useForm();

    // Scheme data state
    const [schemeData, setSchemeData] = useState({
        schemeCode: 'SCHM' + Math.floor(Math.random() * 100000).toString().padStart(8, '0'),
        startDate: null,
        endDate: null
    });

    // Add this state variable with other state variables
    const [showConfirmation, setShowConfirmation] = useState(false);


    const [distributorsLoading, setDistributorsLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);

    const [loading, setLoading] = useState(false);

    // Distributors state
    const [distributors, setDistributors] = useState([]);
    const [filteredDistributors, setFilteredDistributors] = useState([]);
    const [selectedDistributorKeys, setSelectedDistributorKeys] = useState([]);
    const [selectedDistributors, setSelectedDistributors] = useState([]);
    const [distributorFilters, setDistributorFilters] = useState({});

    // Products state
    const [productItems, setProductItems] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [productFilters, setProductFilters] = useState({});
    const [visibleColumns, setVisibleColumns] = useState([
        'itemCode', 'flavour', 'brandName', 'itemName', 'packGroup', 'style', 'packType', 'nob', 'mrp', 'discountPrice'
    ]);

    // Custom columns state
    const [customColumns, setCustomColumns] = useState([]);

    // Add Column Modal state
    const [addColumnModalVisible, setAddColumnModalVisible] = useState(false);
    const [columnForm] = Form.useForm();

    // Add new state for final selected products
    const [finalSelectedProducts, setFinalSelectedProducts] = useState([]);

    // Add this function to add selected products to final list
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

    // Add function to remove product from final selection
    const handleRemoveProduct = (productKey) => {
        setFinalSelectedProducts(finalSelectedProducts.filter(product => product.key !== productKey));
    };

    // Load distributors and products
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

    // Handle form field changes
    const handleFormChange = (changedValues) => {
        setSchemeData({
            ...schemeData,
            ...changedValues
        });
    };

    // Handle distributor filter change
    const handleDistributorFilterChange = (field, value) => {
        const newFilters = {
            ...distributorFilters,
            [field]: value
        };
        setDistributorFilters(newFilters);

        // Apply filters
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

    // Handle product filter change
    const handleProductFilterChange = (field, value) => {
        const newFilters = {
            ...productFilters,
            [field]: value
        };
        setProductFilters(newFilters);

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

    // Get unique values for a field
    const getUniqueFieldOptions = (field) => {
        const values = [...new Set(productItems.map(item => item[field]))];
        return values.filter(Boolean).map(value => ({
            label: String(value),
            value: value
        }));
    };

    // Get flavour options for filter
    const getFlavourOptions = () => {
        const flavours = [...new Set(productItems.map(item => item.flavour))];
        return flavours.filter(Boolean).map(flavour => ({
            label: flavour,
            value: flavour
        }));
    };

    // Add this function to handle scheme submission
    const handleSubmitScheme = async () => {
        try {
            setLoading(true);

            // Validate if distributors and products are selected
            if (selectedDistributorKeys.length === 0) {
                message.error('Please select at least one distributor');
                setLoading(false);
                return;
            }

            if (finalSelectedProducts.length === 0) {
                message.error('Please add at least one product to your selection');
                setLoading(false);
                return;
            }

            // Validate scheme data
            if (!schemeData.startDate || !schemeData.endDate) {
                message.error('Please select start and end dates');
                setLoading(false);
                return;
            }

            // Prepare the scheme data for submission
            const schemePayload = {
                schemeCode: schemeData.schemeCode,
                startDate: schemeData.startDate,
                endDate: schemeData.endDate,
                distributors: selectedDistributors.map(dist => dist._id || dist.id), // Send distributor IDs
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

            // Replace mock API call with actual server API call
            const token = localStorage.getItem('token');
            const response = await fetch(`${url}/api/schemes/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(schemePayload)
            });

            const data = await response.json();

            console.log('Server response:', data); // Add this line for debugging the server response

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create scheme');
            }

            message.success('Scheme created successfully!');
            if (response.ok) {
                // Give user time to see the success message before reloading
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // 1.5 seconds delay
            }
        } catch (error) {
            console.error('Error submitting scheme:', error);
            message.error(`Failed to create scheme: ${error.message}`);
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
        handleSubmitScheme();
    };

    // Handle back button
    const handleBack = () => {
        navigate('/schemes');
    };

    // Function to show add column modal
    const showAddColumnModal = () => {
        setAddColumnModalVisible(true);
    };

    // Function to handle adding a new column
    const handleAddColumn = () => {
        columnForm.validateFields().then(columnData => {
            // Process default value based on data type
            let defaultValue = columnData.defaultValue;
            if (columnData.dataType === 'number' && defaultValue !== undefined && defaultValue !== '') {
                defaultValue = parseFloat(defaultValue) || 0;
            } else if (columnData.dataType === 'boolean' && defaultValue !== undefined) {
                defaultValue = defaultValue === 'true' || defaultValue === true;
            }

            console.log(`Adding column with default value: ${defaultValue}, type: ${typeof defaultValue}`);

            // Create the new column definition
            const newColumn = {
                title: columnData.title,
                dataIndex: columnData.key,
                key: columnData.key,
                dataType: columnData.dataType || 'text',
                defaultValue: defaultValue,
                editable: true,
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                    <CheckboxFilter
                        options={[...new Set(productItems.map(item => item[columnData.key] || ''))].map(value => ({
                            label: String(value),
                            value: value
                        }))}
                        onFilter={handleProductFilterChange}
                        field={columnData.key}
                        setSelectedKeys={setSelectedKeys}
                        selectedKeys={selectedKeys}
                        confirm={confirm}
                        clearFilters={clearFilters}
                        placeholder={`Search ${columnData.title.toLowerCase()}`}
                    />
                ),
                filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            };

            // Add the column to the list of columns
            setCustomColumns([...customColumns, newColumn]);

            // Make the column visible by default
            setVisibleColumns([...visibleColumns, columnData.key]);

            // Add default value to all products
            if (defaultValue !== undefined && defaultValue !== '') {
                const updatedItems = productItems.map(item => ({
                    ...item,
                    [columnData.key]: defaultValue
                }));

                setProductItems(updatedItems);

                // Update filtered products while maintaining the filter
                const updatedFilteredProducts = filteredProducts.map(item => {
                    const updatedItem = updatedItems.find(updated => updated.key === item.key);
                    return updatedItem || item;
                });

                setFilteredProducts(updatedFilteredProducts);
            }

            setAddColumnModalVisible(false);
            columnForm.resetFields();

            message.success(`Column "${columnData.title}" added successfully`);
        });
    };

    // Helper function to get default value based on data type
    const getDefaultValueByType = (dataType, defaultValue) => {
        switch (dataType) {
            case 'number':
                return defaultValue ? parseFloat(defaultValue) : 0;
            case 'boolean':
                return defaultValue === 'true';
            case 'date':
                return defaultValue || null;
            default:
                return defaultValue || '';
        }
    };

    // Function to handle editing a column
    const handleEditColumn = (key, values) => {
        // Find the column to edit
        const columnToEdit = customColumns.find(col => col.key === key);

        if (!columnToEdit) {
            message.error(`Column with key "${key}" not found`);
            return;
        }

        // Update the column
        const updatedCustomColumns = customColumns.map(col => {
            if (col.key === key) {
                return {
                    ...col,
                    title: values.title,
                    dataType: values.dataType,
                    defaultValue: values.defaultValue
                };
            }
            return col;
        });

        setCustomColumns(updatedCustomColumns);

        // Update product items with new default value if provided
        if (values.defaultValue !== undefined && values.defaultValue !== '') {
            const updatedItems = productItems.map(item => {
                // Only set default value for items that don't already have a value for this column
                if (item[key] === undefined || item[key] === null || item[key] === '') {
                    return {
                        ...item,
                        [key]: values.defaultValue
                    };
                }
                return item;
            });

            setProductItems(updatedItems);

            // Also update filtered products
            const updatedFilteredProducts = filteredProducts.map(item => {
                if (item[key] === undefined || item[key] === null || item[key] === '') {
                    return {
                        ...item,
                        [key]: values.defaultValue
                    };
                }
                return item;
            });

            setFilteredProducts(updatedFilteredProducts);
        }

        message.success(`Column "${values.title}" updated`);
    };

    // Function to handle deleting a column
    const handleDeleteColumn = (key) => {
        // Find the column to delete
        const columnToDelete = customColumns.find(col => col.key === key);

        if (!columnToDelete) {
            message.error(`Column with key "${key}" not found`);
            return;
        }

        // Remove from custom columns
        const updatedCustomColumns = customColumns.filter(col => col.key !== key);
        setCustomColumns(updatedCustomColumns);

        // Remove from visible columns
        const newVisibleColumns = visibleColumns.filter(colKey => colKey !== key);
        setVisibleColumns(newVisibleColumns);

        // Remove property from product items
        const updatedItems = productItems.map(item => {
            const newItem = { ...item };
            delete newItem[key];
            return newItem;
        });

        setProductItems(updatedItems);

        // Remove property from filtered products
        const updatedFilteredProducts = filteredProducts.map(item => {
            const newItem = { ...item };
            delete newItem[key];
            return newItem;
        });

        setFilteredProducts(updatedFilteredProducts);

        message.success(`Column "${key}" deleted`);
    };

    const distributorColumns = SchemeColumns.getDistributorColumns(
        distributors,
        handleDistributorFilterChange
    );

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

    return (
        <div style={{ padding: '16px' }}>
            {/* Add the SchemeConfirmation component */}
            <SchemeConfirmation
                visible={showConfirmation}
                onCancel={handleConfirmationCancel}
                onConfirm={handleConfirmationSubmit}
                schemeData={schemeData}
                form={form}
                selectedDistributorKeys={selectedDistributorKeys}
                selectedDistributors={selectedDistributors}
                selectedProducts={finalSelectedProducts} // Changed from selectedRowKeys
                productItems={productItems}
                customColumns={customColumns}
            />

            <Card style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Title level={4}>Create New Scheme</Title>
                    <Space>
                        <Button
                            type="default"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleConfirmScheme}
                            loading={loading}
                        >
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
                                name="startDate"
                                label="Start Date"
                                rules={[{ required: true, message: 'Please select start date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="endDate"
                                label="End Date"
                                rules={[{ required: true, message: 'Please select end date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Distributor Selection */}
            <Card title="Select Distributors" style={{ marginBottom: '16px' }}>
                <DistributorTable
                    columns={distributorColumns}
                    filteredDistributors={filteredDistributors}
                    selectedDistributorKeys={selectedDistributorKeys}
                    setSelectedDistributorKeys={setSelectedDistributorKeys}
                    setSelectedDistributors={setSelectedDistributors}
                    loading={distributorsLoading}
                    tableHeight={400}
                    tableWidth="100%"
                />
            </Card>

            {/* Product Selection */}
            <Card title="Select Products">
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    </div>
                    <div>
                        <Space>
                            <Input
                                placeholder="Apply Discount"
                                style={{ width: 150 }}
                                addonBefore="₹"
                                onChange={(e) => {
                                    // Apply discount when value changes (including when cleared)
                                    handleDiscountPriceAll(e.target.value);
                                }}
                                allowClear
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showAddColumnModal}
                            >
                                Add Column
                            </Button>

                            {/* Add button to add selected products */}
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddSelectedProducts}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Add Selected Products
                            </Button>
                        </Space>
                    </div>
                </div>


                <ProductTable
                    productItems={productItems}
                    setProductItems={setProductItems}
                    columns={allProductColumns}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    filteredProducts={filteredProducts}
                    handleDiscountPriceAll={handleDiscountPriceAll}
                    handleEditColumn={handleEditColumn}
                    handleDeleteColumn={handleDeleteColumn}
                    customColumns={customColumns}
                    tableHeight={400}
                    tableWidth="100%"
                    loading={productsLoading}
                />

                {/* Show selected products table if there are any */}
                <Card>
                    {finalSelectedProducts.length > 0 && (
                        <SelectedProductsTable
                            selectedProducts={finalSelectedProducts}
                            removeProduct={handleRemoveProduct}
                            customColumns={customColumns.map(col => ({
                                title: col.title,
                                key: col.key
                            }))}
                        />
                    )}
                </Card>
            </Card>

            {/* Add Column Modal */}
            <Modal
                title="Add Custom Column"
                open={addColumnModalVisible}
                onOk={handleAddColumn}
                onCancel={() => {
                    setAddColumnModalVisible(false);
                    columnForm.resetFields();
                }}
            >
                <Form form={columnForm} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Column Title"
                        rules={[{ required: true, message: 'Please enter column title' }]}
                    >
                        <Input placeholder="Enter column title" />
                    </Form.Item>

                    <Form.Item
                        name="key"
                        label="Column Key"
                        rules={[{ required: true, message: 'Please enter column key' }]}
                    >
                        <Input placeholder="Enter column key (unique identifier)" />
                    </Form.Item>

                    <Form.Item
                        name="dataType"
                        label="Data Type"
                        rules={[{ required: true, message: 'Please select data type' }]}
                        initialValue="text"
                    >
                        <Select>
                            <Select.Option value="text">Text</Select.Option>
                            <Select.Option value="number">Number</Select.Option>
                            <Select.Option value="date">Date</Select.Option>
                            <Select.Option value="boolean">Yes/No</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="defaultValue"
                        label="Default Value"
                    >
                        <Input placeholder="Default value for this column" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SchemeCreate;
