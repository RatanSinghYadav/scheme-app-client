import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select 
} from 'antd';

const { Option } = Select;

const AddColumnModal = ({ 
  visible, 
  onCancel, 
  onAdd,
  initialValues = null
}) => {
  const [form] = Form.useForm();
  
  React.useEffect(() => {
    if (initialValues && visible) {
      console.log("Setting form values with:", initialValues);
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [form, initialValues, visible]);
  
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log("Form values on submit:", values);
        onAdd(values);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  return (
    <Modal
      title={initialValues ? "Edit Custom Column" : "Add Custom Column"}
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form 
        form={form}
        layout="vertical"
      >
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
          rules={[
            { required: true, message: 'Please enter column key' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Key can only contain letters, numbers and underscore' }
          ]}
        >
          <Input placeholder="Enter column key (unique identifier)" />
        </Form.Item>
        
        <Form.Item
          name="dataType"
          label="Data Type"
          rules={[{ required: true, message: 'Please select data type' }]}
        >
          <Select placeholder="Select data type">
            <Option value="text">Text</Option>
            <Option value="number">Number</Option>
            <Option value="boolean">Yes/No</Option>
            <Option value="date">Date</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label="Default Value"
        >
          <Input placeholder="Enter default value (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColumnModal;