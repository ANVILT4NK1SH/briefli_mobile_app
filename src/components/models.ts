export interface Client {
  clientId: string;
  createdAt: string;
  imgUrl: string;
  integrationPartners: IntegrationPartners[];
  name: string;
  orgId: string;
}

export interface IntegrationPartners {
  type: string;
  credentialId: string;
}

export interface ImportedDocument {
  fileName: string;
  displayName: string;
  status: string;
  createdAt: string;
  processedAt: string;
  orgId: string;
  clientId: string;
  fileSize: string;
  rotations: number[];
  documentTypes: string[];
}
