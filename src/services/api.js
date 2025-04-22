// Mock API service for the scheme management system
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

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schemes/create`, {
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

  getProducts: async () => {
    await delay(800);
    return products;
  }
};
