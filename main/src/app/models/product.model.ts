import { DateTimezoneSetter } from "date-fns/parse/_lib/Setter";

export interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    createdDate?: Date | null;
    updateDate?: Date | null;
    Image?: string;
  }