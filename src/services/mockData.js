// Mock data for the scheme management system

// Distributors
export const distributors = [
  { code: 'BR-CG-DI-000004', name: 'SHRINATH ENTERPRISES', city: 'Kashipur', group: 'BR-CG-DI' },
  { code: 'BR-CG-DI-000063', name: 'GURUNANAK ENTERPRISES DINESHPUR', city: 'Dineshpur', group: 'A Pair UK' },
  { code: 'BR-CG-DI-000306', name: 'SHARMA ENTERPRISES', city: 'Delhi', group: 'BR-CG-DI' },
  { code: 'BR-CG-DI-000404', name: 'PATEL DISTRIBUTORS', city: 'Mumbai', group: 'BR-CG-DI' }
];

// Products
export const products = [
  { code: 'FG050259', name: 'Charged by Thums up 2.0 250 ML PET X 30', brand: 'CHARGED BY THUMUPS', packType: 'PET', packSize: '250 ML', mrp: 15 },
  { code: 'FG050256', name: 'Charged by Thums up 250 ML ASSP X 28', brand: 'CHARGED BY THUMUPS', packType: 'ASSP', packSize: '250 ML', mrp: 15 },
  { code: 'FG050203', name: 'Charged by Thums Up 200 ML RGB X 24', brand: 'CHARGED BY THUMUPS', packType: 'RGB', packSize: '200 ML', mrp: 15 },
  { code: 'FG011150', name: 'Coca-Cola 1.50 Ltr PET X12', brand: 'COCA-COLA', packType: 'PET', packSize: '1500 ML', mrp: 70 },
  { code: 'FG012000', name: 'Coca-Cola 2 Ltr PET (9 bottles) X9', brand: 'COCA-COLA', packType: 'PET', packSize: '2000 ML', mrp: 95 },
  { code: 'FG012250', name: 'Coca-Cola 2.25 Ltr PET (9 bottles) X9', brand: 'COCA-COLA', packType: 'PET', packSize: '2250 ML', mrp: 95 },
  { code: 'FG011250', name: 'Coca-Cola 1.25 Ltr PET X12', brand: 'COCA-COLA', packType: 'PET', packSize: '1250 ML', mrp: 65 },
  { code: 'FG090140', name: 'Maaza Refresh 135 ML Tetra X 40', brand: 'Maaza', packType: 'Tetra', packSize: '135 ML', mrp: 10 },
  { code: 'FG011000', name: 'Coca-Cola 1000 ml PET X15', brand: 'COCA-COLA', packType: 'PET', packSize: '1000 ML', mrp: 50 },
  { code: 'FG021000', name: 'Fanta 1000 ml PET X15', brand: 'Fanta', packType: 'PET', packSize: '1000 ML', mrp: 50 },
  { code: 'FG061000', name: 'Limca 1000 ml PET X15', brand: 'Limca', packType: 'PET', packSize: '1000 ML', mrp: 50 },
  { code: 'FG031000', name: 'Sprite 1000 ml PET X15', brand: 'Sprite', packType: 'PET', packSize: '1000 ML', mrp: 50 },
  { code: 'FG051000', name: 'Thums-up 1000 ml PET X15', brand: 'Thums-Up', packType: 'PET', packSize: '1000 ML', mrp: 50 },
  { code: 'FG050255', name: 'Charged by Thums up 250 ML PET X 30', brand: 'CHARGED BY THUMUPS', packType: 'PET', packSize: '250 ML', mrp: 35 },
  { code: 'FG030252', name: 'Sprite 250ML PET X30', brand: 'Sprite', packType: 'PET', packSize: '250 ML', mrp: 25 },
  { code: 'FG050252', name: 'Thums Up 250ML PET X30', brand: 'Thums-Up', packType: 'PET', packSize: '250 ML', mrp: 35 }
];

// Schemes
export const mockSchemes = {
  'SCHM00000135': {
    id: 'SCHM00000135',
    startDate: '10-04-2025',
    endDate: '10-04-2025',
    distributorGroup: 'A Pair UK',
    distributorCode: 'BR-CG-DI-000063',
    distributorName: 'GURUNANAK ENTERPRISES DINESHPUR',
    city: 'Dineshpur',
    status: 'Pending Verification',
    createdBy: 'john.doe',
    createdDate: '15-03-2023',
    items: [
      { itemCode: 'FG050255', itemName: 'Charged by Thums up 250 ML PET X 30', brand: 'CHARGED BY THUMUPS', packType: 'PET', mrp: 35, discountPrice: 30 },
      { itemCode: 'FG030252', itemName: 'Sprite 250ML PET X30', brand: 'Sprite', packType: 'PET', mrp: 25, discountPrice: 22 },
      { itemCode: 'FG050252', itemName: 'Thums Up 250ML PET X30', brand: 'Thums-Up', packType: 'PET', mrp: 35, discountPrice: 30 }
    ]
  },
  'SCHM0000009': {
    id: 'SCHM0000009',
    startDate: '05-04-2024',
    endDate: '05-04-2024',
    distributorGroup: 'BR-CG-DI',
    distributorCode: 'BR-CG-DI-000004',
    distributorName: 'SHRINATH ENTERPRISES',
    city: 'Kashipur',
    status: 'Verified',
    createdBy: 'jane.smith',
    createdDate: '01-03-2023',
    verifiedBy: 'admin.user',
    verifiedDate: '02-03-2023',
    items: [
      { itemCode: 'FG090140', itemName: 'Maaza Refresh 135 ML Tetra X 40', brand: 'Maaza', packType: 'Tetra', mrp: 10, discountPrice: 8 },
      { itemCode: 'FG011000', itemName: 'Coca-Cola 1000 ml PET X15', brand: 'COCA-COLA', packType: 'PET', mrp: 50, discountPrice: 45 },
      { itemCode: 'FG021000', itemName: 'Fanta 1000 ml PET X15', brand: 'Fanta', packType: 'PET', mrp: 50, discountPrice: 45 },
      { itemCode: 'FG061000', itemName: 'Limca 1000 ml PET X15', brand: 'Limca', packType: 'PET', mrp: 50, discountPrice: 45 },
      { itemCode: 'FG031000', itemName: 'Sprite 1000 ml PET X15', brand: 'Sprite', packType: 'PET', mrp: 50, discountPrice: 45 },
      { itemCode: 'FG051000', itemName: 'Thums-up 1000 ml PET X15', brand: 'Thums-Up', packType: 'PET', mrp: 50, discountPrice: 45 }
    ]
  }
};

// Pending schemes for verification
export const pendingSchemes = [
  {
    id: 'SCHM00000135',
    startDate: '10-04-2025',
    endDate: '10-04-2025',
    distributorGroup: 'A Pair UK',
    distributorCode: 'BR-CG-DI-000063',
    distributorName: 'GURUNANAK ENTERPRISES DINESHPUR',
    city: 'Dineshpur',
    status: 'Pending Verification',
    createdBy: 'john.doe',
    createdDate: '15-03-2023',
    items: [
      { itemCode: 'FG050255', itemName: 'Charged by Thums up 250 ML PET X 30', brand: 'CHARGED BY THUMUPS', packType: 'PET', mrp: 35, discountPrice: 30 },
      { itemCode: 'FG030252', itemName: 'Sprite 250ML PET X30', brand: 'Sprite', packType: 'PET', mrp: 25, discountPrice: 22 },
      { itemCode: 'FG050252', itemName: 'Thums Up 250ML PET X30', brand: 'Thums-Up', packType: 'PET', mrp: 35, discountPrice: 30 }
    ]
  }
];