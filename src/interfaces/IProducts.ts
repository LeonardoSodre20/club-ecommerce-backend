export interface IProductsTypes {
  name: string;
  quantity: string;
  status: string;
  price: string;
  categoryName?: string;
}

export interface IDataQrCode {
  version: string;
  key: string;
  city: string;
  name: string;
  value?: number;
  transactionId?: string;
  message?: string;
  cep?: string;
  currency?: number; //default: 986 ('R$')
  countryCode?: string; //default: 'BR'
}
