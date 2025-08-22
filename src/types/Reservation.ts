export interface Reservation {
  _id?: string;
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  duration: number;
  guests: number;
  email: string;
  status: string;
  occasion: number;
  requests?: string;
  tableId?: string;
}
