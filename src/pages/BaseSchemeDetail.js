import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Row, Col, Table, Tag, Spin, Tabs, Space, Divider, message, Modal, Input } from 'antd';
import { ArrowLeftOutlined, HistoryOutlined, FileTextOutlined, InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import SchemeHistory from '../components/schemes/SchemeHistory';
import ExportScheme from '../components/schemes/ExportScheme';
import { formatDate } from '../utils/helpers';
import { url } from '../utils/constent';

const { Title, Text, TextArea } = Typography;
const { TabPane } = Tabs;

// Remove mock history data
// const mockHistory = [ ... ];

const BaseSchemeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole, currentUser } = useContext(AuthContext);
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1');
    const [history, setHistory] = useState([]);

    // Add new state variables for verification/rejection
    const [verifyModalVisible, setVerifyModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [verificationNotes, setVerificationNotes] = useState('');
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSchemeDetails = async () => {
        setLoading(true);
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Get scheme details from real API
            const response = await fetch(`${url}/api/base/schemes/getScheme/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // console.log(data);

            if (data.success) {
                // Transform API data to match the expected format
                const schemeData = data.data;

                // Format the scheme data
                const formattedScheme = {
                    id: schemeData.schemeCode,
                    startDate: formatDate(schemeData.startDate),
                    endDate: formatDate(schemeData.endDate),
                    status: schemeData.status === 'pending'
                        ? 'Pending Verification'
                        : schemeData.status.charAt(0).toUpperCase() + schemeData.status.slice(1),
                    createdBy: schemeData.createdBy && schemeData.createdBy.name
                        ? schemeData.createdBy.name
                        : 'Unknown',
                    createdDate: formatDate(schemeData.createdDate),
                    distributors: schemeData.distributors || [],
                    products: schemeData.products || [],
                    history: schemeData.history || [],
                    distributorType: schemeData.distributorType || 'individual'  // distributorType को स्टोर करें
                };

                setScheme(formattedScheme);
                setHistory(formattedScheme.history);
            } else {
                message.error(data.error || 'Failed to load scheme details');
            }
        } catch (error) {
            console.error('Error fetching scheme details:', error);
            message.error('Failed to load scheme details: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemeDetails();
    }, [id]);

    // Add new function to handle scheme verification
    const handleVerifyScheme = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${url}/api/base/schemes/verify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes: verificationNotes })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                message.success('Scheme verified successfully');
                // Update the scheme status in the UI
                setScheme({
                    ...scheme,
                    status: 'Verified'
                });
                // Close the modal
                setVerifyModalVisible(false);
                // Refresh the scheme details to get updated history
                fetchSchemeDetails();
            } else {
                throw new Error(data.error || 'Failed to verify scheme');
            }
        } catch (error) {
            console.error('Error verifying scheme:', error);
            message.error('Failed to verify scheme: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Add new function to handle scheme rejection
    const handleRejectScheme = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${url}/api/base/schemes/reject/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes: rejectionNotes })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            if (data.success) {
                message.success('Scheme rejected successfully');
                // Update the scheme status in the UI
                setScheme({
                    ...scheme,
                    status: 'Rejected'
                });
                // Close the modal
                setRejectModalVisible(false);
                // Refresh the scheme details to get updated history
                fetchSchemeDetails();
            } else {
                throw new Error(data.error || 'Failed to reject scheme');
            }
        } catch (error) {
            console.error('Error rejecting scheme:', error);
            message.error('Failed to reject scheme: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Product columns for the table
    const productColumns = [
        { title: 'Item Code', dataIndex: 'ITEMID', key: 'ITEMID' },
        { title: 'Flavour', dataIndex: 'FLAVOURTYPE', key: 'FLAVOURTYPE' },
        { title: 'Brand', dataIndex: 'BRANDNAME', key: 'BRANDNAME' },
        { title: 'Item Name', dataIndex: 'ITEMNAME', key: 'ITEMNAME' },
        { title: 'Pack Type', dataIndex: 'PACKTYPE', key: 'PACKTYPE' },
        { title: 'Pack Group', dataIndex: 'PACKTYPEGROUPNAME', key: 'PACKTYPEGROUPNAME' },
        { title: 'Style', dataIndex: 'Style', key: 'Style' },
        { title: 'NOB', dataIndex: 'NOB', key: 'NOB' },
        {
            title: 'MRP',
            dataIndex: 'Configuration',
            key: 'Configuration',
            render: (text) => text ? `₹${text}` : '-'
        },
        {
            title: 'Discount Price',
            dataIndex: 'discountPrice',
            key: 'discountPrice',
            render: (text) => text ? `₹${text}` : '-'
        },
        // {
        //   title: 'Discount %',
        //   key: 'discount',
        //   render: (_, record) => {
        //     if (!record.discountPrice || record.discountPrice === 0 || !record.Configuration) return '-';
        //     const discount = ((record.Configuration - record.discountPrice) / record.Configuration) * 100;
        //     return `${discount.toFixed(2)}%`;
        //   }
        // },
    ];

    // Distributor columns for the table
    const distributorColumns = [
        { title: 'Sr.', render: (_, __, index) => index + 1, width: 60 },
        { title: 'Group', dataIndex: 'CUSTOMERGROUPID', key: 'CUSTOMERGROUPID' },
        { title: 'SM', dataIndex: 'SMCODE', key: 'SMCODE' },
        { title: 'Distributor Code', dataIndex: 'CUSTOMERACCOUNT', key: 'CUSTOMERACCOUNT' },
        { title: 'Distributor Name', dataIndex: 'ORGANIZATIONNAME', key: 'ORGANIZATIONNAME' },
        { title: 'City', dataIndex: 'ADDRESSCITY', key: 'ADDRESSCITY' },
    ];

    // Group columns for the table - ग्रुप्स के लिए नया कॉलम्स एरे
    const groupColumns = [
        { title: 'Sr.', render: (_, __, index) => index + 1, width: 60 },
        { title: 'Group Code', render: (text) => text, key: 'groupCode' }
    ];

    // Format history data for display
    const formattedHistory = history.map((item, index) => {
        // Handle user data properly
        let userName = 'Unknown';
        if (item.user) {
            if (typeof item.user === 'object') {
                // If user is an object with name property
                userName = item.user.name || item.user.username || 'Unknown';
            } else if (typeof item.user === 'string') {
                // If user is just a string
                userName = item.user;
            }
        }

        // Format timestamp properly
        let formattedTimestamp = 'Unknown Date';
        try {
            if (item.timestamp) {
                formattedTimestamp = formatDate(item.timestamp);
            }
        } catch (error) {
            console.error('Error formatting timestamp:', error);
        }

        return {
            key: index,
            action: item.action,
            user: userName,
            timestamp: formattedTimestamp,
            notes: item.notes
        };
    });

    const tableHeight = 400;
    const tableWidth = "100%";

    return (
        <div style={{ padding: '16px' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : scheme ? (
                <>
                    <Card style={{ marginBottom: '16px' }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Title level={4} style={{ margin: 0 }}>Scheme Details: {scheme.id}</Title>
                                    <Text type="secondary">Created by {scheme.createdBy} on {scheme.createdDate}</Text>
                                </Space>
                            </Col>
                            <Col>
                                <Space>
                                    <Button
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => navigate('/schemes')}
                                    >
                                        Back
                                    </Button>
                                    {hasRole('verifier') && scheme.status === 'Pending Verification' && (
                                        <>
                                            <Button
                                                type="primary"
                                                icon={<CheckCircleOutlined />}
                                                onClick={handleVerifyScheme}
                                            >
                                                Verify
                                            </Button>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                onClick={handleRejectScheme}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <ExportScheme schemeId={scheme.id} schemeName={scheme.id} />
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Add verification modal */}
                    <Modal
                        title="Verify Scheme"
                        open={verifyModalVisible}
                        onOk={handleVerifyScheme}
                        onCancel={() => setVerifyModalVisible(false)}
                        confirmLoading={actionLoading}
                        okText="Verify"
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to verify this scheme?</p>
                        <div style={{ marginTop: '16px' }}>
                            <Text strong>Notes:</Text>
                            <Input.TextArea
                                rows={4}
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                placeholder="Add verification notes (optional)"
                            />
                        </div>
                    </Modal>

                    {/* Add rejection modal */}
                    <Modal
                        title="Reject Scheme"
                        open={rejectModalVisible}
                        onOk={handleRejectScheme}
                        onCancel={() => setRejectModalVisible(false)}
                        confirmLoading={actionLoading}
                        okText="Reject"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to reject this scheme?</p>
                        <div style={{ marginTop: '16px' }}>
                            <Text strong>Reason for rejection:</Text>
                            <Input.TextArea
                                rows={4}
                                value={rejectionNotes}
                                onChange={(e) => setRejectionNotes(e.target.value)}
                                placeholder="Please provide a reason for rejection"
                                required
                            />
                        </div>
                    </Modal>

                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane
                            tab={<span><InfoCircleOutlined />Details</span>}
                            key="1"
                        >
                            {/* Rest of the component remains the same */}
                            <Card title="Scheme Information">
                                <Row gutter={[24, 24]}>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>Scheme Code:</Text>
                                            <div>{scheme.id}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>Status:</Text>
                                            <div>
                                                <Tag color={
                                                    scheme.status === 'Verified' ? 'green' :
                                                        scheme.status === 'Pending Verification' ? 'warning' :
                                                            scheme.status === 'Rejected' ? 'error' : 'default'
                                                }>
                                                    {scheme.status}
                                                </Tag>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>Created By:</Text>
                                            <div>{scheme.createdBy}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>Start Date:</Text>
                                            <div>{scheme.startDate}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>End Date:</Text>
                                            <div>{scheme.endDate}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <Text strong>Created Date:</Text>
                                            <div>{scheme.createdDate}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Divider />

                            {scheme.distributorType === 'group' ? (
                                <Card title="Groups" style={{ marginBottom: '16px' }}>
                                    <Table
                                        columns={groupColumns}
                                        dataSource={scheme.distributors || []}
                                        rowKey="key"
                                        pagination={false}
                                        size="small"
                                        bordered
                                        loading={loading}
                                        scroll={{
                                            y: tableHeight,
                                            x: tableWidth
                                        }}
                                        style={{
                                            maxHeight: tableHeight,
                                            width: tableWidth
                                        }}
                                    />
                                </Card>
                            ) : (
                                <Card title="Distributors" style={{ marginBottom: '16px' }}>
                                    <Table
                                        columns={distributorColumns}
                                        dataSource={scheme.distributors || []}
                                        rowKey={(record, index) => `dist-${index}`}
                                        pagination={false}
                                        size="small"
                                        bordered
                                        loading={loading}
                                        scroll={{
                                            y: tableHeight,
                                            x: tableWidth
                                        }}
                                        style={{
                                            maxHeight: tableHeight,
                                            width: tableWidth
                                        }}
                                    />
                                </Card>
                            )}

                            <Card title="Products">
                                <Table
                                    columns={productColumns}
                                    dataSource={scheme.products || []}
                                    rowKey={(record, index) => `prod-${index}`}
                                    pagination={false}
                                    size="small"
                                    bordered
                                    loading={loading}
                                    scroll={{
                                        y: tableHeight,
                                        x: tableWidth
                                    }}
                                    style={{
                                        maxHeight: tableHeight,
                                        width: tableWidth
                                    }}
                                />
                            </Card>
                        </TabPane>

                        <TabPane
                            tab={<span><HistoryOutlined />History</span>}
                            key="2"
                        >
                            <SchemeHistory history={formattedHistory} />
                        </TabPane>

                        <TabPane
                            tab={<span><FileTextOutlined />Documents</span>}
                            key="3"
                        >
                            <Card>
                                <div style={{ textAlign: 'center', padding: '50px' }}>
                                    <Text type="secondary">No documents available</Text>
                                </div>
                            </Card>
                        </TabPane>
                    </Tabs>
                </>
            ) : (
                <Card>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Title level={4}>Scheme not found</Title>
                        <Button
                            type="primary"
                            onClick={() => navigate('/schemes')}
                            style={{ marginTop: '16px' }}
                        >
                            Back to Schemes
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BaseSchemeDetail;