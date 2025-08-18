export interface Reservation {
  _id?: string;
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  guests: number;
  email: string;
  status: string;
  occasion: number;
  requests?: string;
}
