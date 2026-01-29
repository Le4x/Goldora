export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  birthPlace?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  iban?: string;
  bic?: string;
  consentGiven: boolean;
  createdAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  birthPlace?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  iban?: string;
  bic?: string;
  consentGiven: boolean;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface OcrIdentityResult {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  documentNumber?: string;
  expiryDate?: string;
  address?: string;
  nationality?: string;
}

export interface OcrRibResult {
  iban?: string;
  bic?: string;
}
