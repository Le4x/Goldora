export interface OrganizationDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  siret?: string;
  subscriptionPlan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  metalMargins: Record<string, number>;
  createdAt: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  metalMargins?: Record<string, number>;
}
