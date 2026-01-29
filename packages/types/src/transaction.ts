export interface TransactionDto {
  id: string;
  invoiceNumber: string;
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  notes?: string;
  policeRegisterNumber?: string;
  customerId: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  userId: string;
  items: TransactionItemDto[];
  createdAt: string;
}

export interface TransactionItemDto {
  id: string;
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  weightGrams: number;
  purity: string;
  purityFactor: number;
  description?: string;
  spotPricePerGram: number;
  marginPercent: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateTransactionRequest {
  customerId: string;
  notes?: string;
  items: CreateTransactionItemRequest[];
}

export interface CreateTransactionItemRequest {
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  weightGrams: number;
  purity: string;
  description?: string;
}

export interface TransactionListQuery {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  dateFrom?: string;
  dateTo?: string;
}
