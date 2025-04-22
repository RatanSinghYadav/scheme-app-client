import React from 'react';
import { FilterOutlined } from '@ant-design/icons';
import CheckboxFilter from './CheckboxFilter';
import {Input} from 'antd';

// This component defines and exports column definitions for scheme tables
const SchemeColumns = {
  // Get distributor table columns
  getDistributorColumns: (distributors, handleDistributorFilterChange) => [
    { title: 'Sr.', dataIndex: 'sr', key: 'sr', width: 60, render: (_, __, index) => index + 1 },
    {
      title: 'Distributor Group',
      dataIndex: 'group',
      key: 'group',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <CheckboxFilter
          options={[...new Set(distributors.map(item => item.group))].map(group => ({
            label: group,
            value: group
          }))}
          onFilter={handleDistributorFilterChange}
          field="group"
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          placeholder="Search group"
        />
      ),
      filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'SM',
      dataIndex: 'SMCODE',
      key: 'SMCODE',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <CheckboxFilter
          options={[...new Set(distributors.map(item => item.sm))].map(sm => ({
            label: sm,
            value: sm
          }))}
          onFilter={handleDistributorFilterChange}
          field="sm"
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          placeholder="Search SM"
        />
      ),
      filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Distributor Code',
      dataIndex: 'CUSTOMERACCOUNT',
      key: 'CUSTOMERACCOUNT',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <CheckboxFilter
          options={[...new Set(distributors.map(item => item.code))].map(code => ({
            label: code,
            value: code
          }))}
          onFilter={handleDistributorFilterChange}
          field="code"
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          placeholder="Search code"
        />
      ),
      filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Distributor Name',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <CheckboxFilter
          options={[...new Set(distributors.map(item => item.name))].map(name => ({
            label: name,
            value: name
          }))}
          onFilter={handleDistributorFilterChange}
          field="name"
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          placeholder="Search name"
        />
      ),
      filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <CheckboxFilter
          options={[...new Set(distributors.map(item => item.city))].map(city => ({
            label: city,
            value: city
          }))}
          onFilter={handleDistributorFilterChange}
          field="city"
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          placeholder="Search city"
        />
      ),
      filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    }
  ],

  // Get product table columns
  getProductColumns: (getUniqueFieldOptions, getFlavourOptions, handleProductFilterChange, productItems, setProductItems, filteredProducts, setFilteredProducts, customColumns) => {
    const baseColumns = [
      {
        title: 'Sr.',
        dataIndex: 'sr',
        key: 'sr',
        width: 60,
        render: (_, __, index) => index + 1,
        fixed: 'left'
      },
      {
        title: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('itemCode')}
            onFilter={handleProductFilterChange}
            field="itemCode"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search item code"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Flavour',
        dataIndex: 'flavour',
        key: 'flavour',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getFlavourOptions()}
            onFilter={handleProductFilterChange}
            field="flavour"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search flavours"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Brand Name',
        dataIndex: 'brandName',
        key: 'brandName',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('brandName')}
            onFilter={handleProductFilterChange}
            field="brandName"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search item code"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Item Name',
        dataIndex: 'itemName',
        key: 'itemName',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('itemName')}
            onFilter={handleProductFilterChange}
            field="itemName"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search item name"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Pack Group',
        dataIndex: 'packGroup',
        key: 'packGroup',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('packGroup')}
            onFilter={handleProductFilterChange}
            field="packGroup"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search pack group"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Style',
        dataIndex: 'style',
        key: 'style',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('style')}
            onFilter={handleProductFilterChange}
            field="style"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search style"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Pack Type',
        dataIndex: 'packType',
        key: 'packType',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('packType')}
            onFilter={handleProductFilterChange}
            field="packType"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search pack type"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'NOB',
        dataIndex: 'nob',
        key: 'nob',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('nob')}
            onFilter={handleProductFilterChange}
            field="nob"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search NOB"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'MRP',
        dataIndex: 'mrp',
        key: 'mrp',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <CheckboxFilter
            options={getUniqueFieldOptions('mrp')}
            onFilter={handleProductFilterChange}
            field="mrp"
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            placeholder="Search MRP"
          />
        ),
        filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      },
      {
        title: 'Discount Price',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        render: (text, record) => (
          <Input
            value={text || ''}
            onChange={(e) => {
              const value = e.target.value;
              const price = parseFloat(value);

              // Update in main product items array
              const updatedItems = [...productItems];
              const itemIndex = updatedItems.findIndex(item => item.key === record.key);
              if (itemIndex !== -1) {
                updatedItems[itemIndex] = {
                  ...updatedItems[itemIndex],
                  discountPrice: isNaN(price) ? 0 : price
                };
                setProductItems(updatedItems);
              }

              // Also update in filtered products array
              const updatedFilteredProducts = [...filteredProducts];
              const filteredIndex = updatedFilteredProducts.findIndex(item => item.key === record.key);
              if (filteredIndex !== -1) {
                updatedFilteredProducts[filteredIndex] = {
                  ...updatedFilteredProducts[filteredIndex],
                  discountPrice: isNaN(price) ? 0 : price
                };
                setFilteredProducts(updatedFilteredProducts);
              }
            }}
            type="number"
            min={0}
            style={{ width: '100%' }}
          />
        )
      }
    ];

    // Return combined columns
    return [...baseColumns, ...customColumns];
  }
};

export default SchemeColumns;