// Mock API service for the scheme management system
import { url } from '../utils/constent';
import { mockSchemes, pendingSchemes, distributors, products } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication
  login: async (credentials) => {
    await delay(800);
    // In a real app, this would validate credentials with a backend
    if (credentials.username && credentials.password) {
      return {
        id: credentials.username,
        name: credentials.username,
        role: credentials.role || 'viewer',
        token: 'sample-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  // Schemes
  getSchemes: async () => {
    await delay(1000);
    return Object.values(mockSchemes);
  },

  getSchemeById: async (id) => {
    await delay(800);
    
    // First check mock data
    const scheme = mockSchemes[id];
    
    if (scheme) {
      return scheme;
    }
    
    // If not found in mock data, check local storage
    const localSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
    const localScheme = localSchemes.find(s => s.id === id);
    
    if (localScheme) {
      return localScheme;
    }
    
    // If not found anywhere
    throw new Error('Scheme not found');
  },

  getPendingSchemes: async () => {
    await delay(1000);
    return pendingSchemes;
  },

  // Create a new scheme
  createScheme: async (schemeData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${url || 'http://localhost:8000'}/api/schemes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(schemeData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create scheme');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating scheme:', error);
      throw error;
    }
  },

  verifyScheme: async (id, approved, rejectReason) => {
    await delay(1200);
    // In a real app, this would update the scheme status in the backend
    console.log(`Scheme ${id} ${approved ? 'approved' : 'rejected'}`);
    if (!approved) {
      console.log('Rejection reason:', rejectReason);
    }
    return { success: true };
  },

  exportScheme: async (id) => {
    await delay(1000);
    // In a real app, this would generate an export file
    console.log(`Exporting scheme ${id}`);
    return { fileUrl: '#' };
  },

  // Reference data
  getDistributors: async () => {
    await delay(800);
    return distributors;
  },

  // प्रोडक्ट API कॉल्स
  getProducts: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/getAllProducts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update product');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // डिस्ट्रीब्यूटर API कॉल्स
  getDistributors: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/distributors/getAllDistributors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch distributors');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching distributors:', error);
      throw error;
    }
  },

  createDistributor: async (distributorData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/distributors/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(distributorData)
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create distributor');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating distributor:', error);
      throw error;
    }
  },

  updateDistributor: async (id, distributorData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/distributors/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(distributorData)
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update distributor');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating distributor:', error);
      throw error;
    }
  },

  findDuplicateProducts: async (criteria = 'itemid') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/find-duplicates?criteria=${criteria}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to find duplicate products');
      }
      
      return data;
    } catch (error) {
      console.error('Error finding duplicate products:', error);
      throw error;
    }
  },

  deleteDuplicateProducts: async (ids, keepId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/products/delete-duplicates`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids, keepId })
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete duplicate products');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting duplicate products:', error);
      throw error;
    }
  },

  deleteDistributor: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`${url || 'http://localhost:8000'}/api/distributors/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete distributor');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error deleting distributor:', error);
      throw error;
    }
  },
};
