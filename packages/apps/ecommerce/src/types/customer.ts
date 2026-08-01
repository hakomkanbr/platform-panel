export interface Customer {
  id: number;
  name: string;
  sureName: string;
  email: string;
  phoneNumber: string;
  type: number;
  taxOffice: string | null;
  taxNumber: number | null;
  unvan: string | null;
}
