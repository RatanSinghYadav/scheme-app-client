import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Card,
    Input,
    Button,
    Space,
    Tag,
    DatePicker,
    Tabs,
    Spin,
    message
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { url } from '../utils/constent';
import { AuthContext } from '../context/AuthContext';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const CombinedSchemeList = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                message.error('Authentication required');
                return;
            }

            const response = await fetch(`${url}/api/combined/schemes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSchemes(data.data);
            } else {
                message.error(data.message || 'Failed to fetch schemes');
            }
        } catch (error) {
            console.error('Error fetching schemes:', error);
            message.error('Error fetching schemes');
        } finally {
            setLoading(false);
        }
    };
 
    // Filter schemes based on search text
    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch =
            !searchText ||
            scheme.schemeCode?.toLowerCase().includes(searchText.toLowerCase()) ||
            scheme.salesDescription?.toLowerCase().includes(searchText.toLowerCase()) ||
            scheme.itemName?.toLowerCase().includes(searchText.toLowerCase());

        // Filter by date range if selected
        const matchesDateRange = !dateRange ||
            (moment(scheme.startDate).isSameOrBefore(dateRange[1]) &&
                moment(scheme.endDate).isSameOrAfter(dateRange[0]));

        // Filter by status tab
        const today = moment();
        const isActive = moment(scheme.endDate).isSameOrAfter(today);
        const isExpired = moment(scheme.endDate).isBefore(today);

        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'active' && isActive) ||
            (activeTab === 'expired' && isExpired);

        return matchesSearch && matchesDateRange && matchesTab;
    });

    // Define table columns
    const columns = [
        {
            title: 'Scheme Code',
            dataIndex: 'schemeCode',
            key: 'schemeCode',
            sorter: (a, b) => a.schemeCode.localeCompare(b.schemeCode),
        },
        {
            title: 'Customer Type',
            dataIndex: 'salesType',
            key: 'salesType',
            filters: [
                { text: 'Distributor', value: 'Distributor' },
                { text: 'Retailer', value: 'Retailer' },
            ],
            onFilter: (value, record) => record.salesType === value,
        },
        {
            title: 'Customer Code',
            dataIndex: 'salesCode',
            key: 'salesCode',
            sorter: (a, b) => a.salesCode.localeCompare(b.salesCode),
        },
        {
            title: 'Customer',
            dataIndex: 'salesDescription',
            key: 'salesDescription',
            sorter: (a, b) => a.salesDescription.localeCompare(b.salesDescription),
        },
        {
            title: 'Product',
            dataIndex: 'itemName',
            key: 'itemName',
            sorter: (a, b) => a.itemName.localeCompare(b.itemName),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: date => moment(date).format('DD-MM-YYYY'),
            sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: date => moment(date).format('DD-MM-YYYY'),
            sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const today = moment();
                const isActive = moment(record.endDate).isSameOrAfter(today);
                return isActive ?
                    <Tag color="green">Active</Tag> :
                    <Tag color="red">Expired</Tag>;
            },
        },
        {
            title: 'Discount',
            dataIndex: 'lineDiscount',
            key: 'lineDiscount',
            render: (discount, record) => {
                return record.schemeCalculationType === 'Percentage' ?
                    `${discount}%` :
                    `₹${discount}`;
            },
            sorter: (a, b) => a.lineDiscount - b.lineDiscount,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/combined/schemes/customer/details/${record.salesCode}`}>
                        <Button type="primary" icon={<EyeOutlined />} size="small">
                            View
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Combined Schemes" className="scheme-list-card">
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Space>
                    <Input
                        placeholder="Search by scheme code, customer or product"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <RangePicker
                        onChange={dates => setDateRange(dates)}
                        format="DD-MM-YYYY"
                    />
                </Space>
            </Space>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginBottom: 16 }}
            >
                <TabPane tab="All Schemes" key="all" />
                <TabPane tab="Active Schemes" key="active" />
                <TabPane tab="Expired Schemes" key="expired" />
            </Tabs>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredSchemes.map((scheme, index) => ({ ...scheme, key: scheme._id || index }))}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                />
            </Spin>
        </Card>
    );
};

export default CombinedSchemeList;