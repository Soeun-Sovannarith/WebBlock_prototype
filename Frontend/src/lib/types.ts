export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  badge: string;
  previewGradient: string;
  accentColor: string;
  heroHeadline: string;
  heroSubtitle: string;
  sampleProducts: {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    badge: string;
    category: string;
    stock: number;
    features: string[];
  }[];
}

export interface ProductItem {
  id?: string;
  title: string;
  price: number;
  status?: string;
  customFields?: {
    description?: string;
    imageUrl?: string;
    badge?: string;
    category?: string;
    stock?: number;
    features?: string[];
    [key: string]: any;
  };
}

export interface WebsiteData {
  tenantId: string;
  ownerId?: string;
  domainName?: string;
  subdomain: string;
  status: string;
  createdAt: string;
}

export interface SiteSettingData {
  id?: string;
  tenantId: string;
  themeConfig: Record<string, any>;
  allowedCustomFields?: any[];
  updatedAt?: string;
}

export interface TenantDetailResponse {
  website: WebsiteData;
  siteSetting: SiteSettingData;
  products: ProductItem[];
}
