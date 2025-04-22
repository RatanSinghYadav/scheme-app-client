import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Attempt to recover by reloading the page
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh', 
          padding: '24px' 
        }}>
          <Card style={{ maxWidth: 600, width: '100%' }}>
            <Result
              status="error"
              icon={<ExclamationCircleOutlined style={{ fontSize: 60, color: '#ff4d4f' }} />}
              title="Something went wrong"
              subTitle="We're sorry, but an error occurred while rendering this page."
              extra={
                <Button type="primary" onClick={this.handleReset}>
                  Return to Dashboard
                </Button>
              }
            />
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div style={{ marginTop: 16, textAlign: 'left' }}>
                <Title level={5} type="danger">Error details:</Title>
                <Card
                  style={{
                    backgroundColor: '#f5f5f5',
                    marginTop: 8,
                    overflow: 'auto'
                  }}
                >
                  <pre style={{ fontSize: '14px' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </Card>
              </div>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;