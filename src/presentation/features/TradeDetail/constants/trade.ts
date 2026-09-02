export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchaseDate: string;
  saleDate: string | null;
  unitsBought: number;
  unitsSold: number;
  unitCost: number;
  unitPrice: number;
  status: 'sold' | 'partial' | 'in-stock';
};

export const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Industrial', 'Beauty'] as const;

export const products: Product[] = [
  {
    id: 'p1',
    name: 'LED Monitor 27" QHD',
    sku: 'ELC-2701',
    category: 'Electronics',
    supplier: 'Shenzhen Optics Ltd',
    purchaseDate: '2026-06-04',
    saleDate: '2026-07-12',
    unitsBought: 120,
    unitsSold: 120,
    unitCost: 128.4,
    unitPrice: 219.0,
    status: 'sold',
  },
  {
    id: 'p2',
    name: 'Wireless Mouse Pro',
    sku: 'ELC-1140',
    category: 'Electronics',
    supplier: 'Shenzhen Optics Ltd',
    purchaseDate: '2026-06-18',
    saleDate: '2026-07-28',
    unitsBought: 500,
    unitsSold: 410,
    unitCost: 8.9,
    unitPrice: 24.5,
    status: 'partial',
  },
  {
    id: 'p3',
    name: 'Merino Wool Sweater',
    sku: 'APP-3390',
    category: 'Apparel',
    supplier: 'Porto Textiles',
    purchaseDate: '2026-05-22',
    saleDate: '2026-08-02',
    unitsBought: 300,
    unitsSold: 268,
    unitCost: 31.0,
    unitPrice: 79.0,
    status: 'partial',
  },
  {
    id: 'p4',
    name: 'Ceramic Cookware Set',
    sku: 'HOM-5512',
    category: 'Home',
    supplier: 'Verona Home Goods',
    purchaseDate: '2026-04-11',
    saleDate: '2026-06-30',
    unitsBought: 180,
    unitsSold: 180,
    unitCost: 44.75,
    unitPrice: 96.0,
    status: 'sold',
  },
  {
    id: 'p5',
    name: 'Industrial Air Filter',
    sku: 'IND-7781',
    category: 'Industrial',
    supplier: 'NordFlow AB',
    purchaseDate: '2026-07-02',
    saleDate: null,
    unitsBought: 90,
    unitsSold: 0,
    unitCost: 210.0,
    unitPrice: 349.0,
    status: 'in-stock',
  },
  {
    id: 'p6',
    name: 'Vitamin C Serum 30ml',
    sku: 'BTY-2210',
    category: 'Beauty',
    supplier: 'Lumière Labs',
    purchaseDate: '2026-06-25',
    saleDate: '2026-08-14',
    unitsBought: 800,
    unitsSold: 735,
    unitCost: 4.2,
    unitPrice: 18.9,
    status: 'partial',
  },
  {
    id: 'p7',
    name: 'Mechanical Keyboard TKL',
    sku: 'ELC-4402',
    category: 'Electronics',
    supplier: 'Taipei Input Co',
    purchaseDate: '2026-03-30',
    saleDate: '2026-05-18',
    unitsBought: 260,
    unitsSold: 244,
    unitCost: 39.5,
    unitPrice: 88.0,
    status: 'partial',
  },
  {
    id: 'p8',
    name: 'Linen Bedding Set',
    sku: 'HOM-6621',
    category: 'Home',
    supplier: 'Riga Linen House',
    purchaseDate: '2026-05-09',
    saleDate: '2026-07-21',
    unitsBought: 210,
    unitsSold: 210,
    unitCost: 52.0,
    unitPrice: 118.0,
    status: 'sold',
  },
  {
    id: 'p9',
    name: 'Running Jacket Shell',
    sku: 'APP-8814',
    category: 'Apparel',
    supplier: 'Porto Textiles',
    purchaseDate: '2026-07-15',
    saleDate: '2026-08-20',
    unitsBought: 340,
    unitsSold: 96,
    unitCost: 28.5,
    unitPrice: 64.0,
    status: 'partial',
  },
  {
    id: 'p10',
    name: 'Hydraulic Hose 5m',
    sku: 'IND-3320',
    category: 'Industrial',
    supplier: 'NordFlow AB',
    purchaseDate: '2026-04-27',
    saleDate: '2026-06-11',
    unitsBought: 150,
    unitsSold: 150,
    unitCost: 66.0,
    unitPrice: 112.0,
    status: 'sold',
  },
  {
    id: 'p11',
    name: 'Bluetooth Speaker Mini',
    sku: 'ELC-9903',
    category: 'Electronics',
    supplier: 'Taipei Input Co',
    purchaseDate: '2026-08-01',
    saleDate: null,
    unitsBought: 420,
    unitsSold: 0,
    unitCost: 17.25,
    unitPrice: 45.0,
    status: 'in-stock',
  },
  {
    id: 'p12',
    name: 'Matte Lip Set (6pc)',
    sku: 'BTY-7745',
    category: 'Beauty',
    supplier: 'Lumière Labs',
    purchaseDate: '2026-06-08',
    saleDate: '2026-07-30',
    unitsBought: 640,
    unitsSold: 588,
    unitCost: 6.8,
    unitPrice: 14.5,
    status: 'partial',
  },
];

export function revenueOf(p: Product) {
  return p.unitsSold * p.unitPrice;
}
export function costOf(p: Product) {
  return p.unitsBought * p.unitCost;
}
export function cogsOf(p: Product) {
  return p.unitsSold * p.unitCost;
}
export function profitOf(p: Product) {
  return revenueOf(p) - cogsOf(p);
}
export function marginOf(p: Product) {
  const r = revenueOf(p);
  return r === 0 ? 0 : (profitOf(p) / r) * 100;
}

export function summarize(list: Product[]) {
  const revenue = list.reduce((s, p) => s + revenueOf(p), 0);
  const cost = list.reduce((s, p) => s + costOf(p), 0);
  const cogs = list.reduce((s, p) => s + cogsOf(p), 0);
  const profit = revenue - cogs;
  const unitsBought = list.reduce((s, p) => s + p.unitsBought, 0);
  const unitsSold = list.reduce((s, p) => s + p.unitsSold, 0);
  const inventoryValue = list.reduce((s, p) => s + (p.unitsBought - p.unitsSold) * p.unitCost, 0);
  return {
    revenue,
    cost,
    cogs,
    profit,
    margin: revenue === 0 ? 0 : (profit / revenue) * 100,
    unitsBought,
    unitsSold,
    inventoryValue,
    sellThrough: unitsBought === 0 ? 0 : (unitsSold / unitsBought) * 100,
  };
}

export const monthlySeries = [
  { month: 'Mar', revenue: 21472, cost: 10270, profit: 11202 },
  { month: 'Apr', revenue: 34320, cost: 17955, profit: 16365 },
  { month: 'May', revenue: 46180, cost: 22140, profit: 24040 },
  { month: 'Jun', revenue: 58940, cost: 29760, profit: 29180 },
  { month: 'Jul', revenue: 72310, cost: 35980, profit: 36330 },
  { month: 'Aug', revenue: 64150, cost: 33420, profit: 30730 },
];

export const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const currency2 = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export type ExtractedRow = {
  document: string;
  sku: string;
  product: string;
  type: 'Purchase' | 'Sale';
  date: string;
  units: number;
  unitValue: number;
  confidence: number;
};

export const extractedRows: ExtractedRow[] = [
  {
    document: 'invoice-supplier-aug.pdf',
    sku: 'ELC-2701',
    product: 'LED Monitor 27" QHD',
    type: 'Purchase',
    date: '2026-08-04',
    units: 60,
    unitValue: 126.9,
    confidence: 0.98,
  },
  {
    document: 'invoice-supplier-aug.pdf',
    sku: 'ELC-1140',
    product: 'Wireless Mouse Pro',
    type: 'Purchase',
    date: '2026-08-04',
    units: 250,
    unitValue: 8.75,
    confidence: 0.96,
  },
  {
    document: 'sales-export-q3.csv',
    sku: 'BTY-2210',
    product: 'Vitamin C Serum 30ml',
    type: 'Sale',
    date: '2026-08-12',
    units: 310,
    unitValue: 18.9,
    confidence: 0.99,
  },
  {
    document: 'sales-export-q3.csv',
    sku: 'APP-3390',
    product: 'Merino Wool Sweater',
    type: 'Sale',
    date: '2026-08-15',
    units: 74,
    unitValue: 79.0,
    confidence: 0.94,
  },
  {
    document: 'warehouse-photo.jpg',
    sku: 'IND-7781',
    product: 'Industrial Air Filter',
    type: 'Purchase',
    date: '2026-08-18',
    units: 24,
    unitValue: 208.5,
    confidence: 0.81,
  },
  {
    document: 'contract-nordflow.docx',
    sku: 'IND-3320',
    product: 'Hydraulic Hose 5m',
    type: 'Sale',
    date: '2026-08-21',
    units: 40,
    unitValue: 112.0,
    confidence: 0.88,
  },
];
