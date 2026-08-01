export interface Warehouse {
  id: number;
  name: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseFormData {
  name: string;
  location?: string;
  isActive?: boolean;
}

export interface StockMovement {
  id: number;
  inventoryId: number;
  type: StockMovementType;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

export enum StockMovementType {
  In = "In",
  Out = "Out",
  Adjustment = "Adjustment",
  Transfer = "Transfer",
  Return = "Return",
}

export interface InventoryItem {
  id: number;
  productId: number | null;
  productTitle: string | null;
  productSku: string | null;
  productImage: string | null;
  combinationRowId: number | null;
  variantLabel: string | null;
  warehouseId: number;
  warehouseName: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface InventoryFormData {
  productId?: number | null;
  combinationRowId?: number | null;
  warehouseId: number;
  quantityOnHand: number;
  lowStockThreshold?: number;
}

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  warehouseCount: number;
}

export interface InventoryListParams {
  search?: string;
  warehouseId?: number;
  lowStockOnly?: boolean;
  productId?: number;
  skip?: number;
  pageSize?: number;
}
