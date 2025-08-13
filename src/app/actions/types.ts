import { FieldValue, Timestamp } from "firebase/firestore";

export enum BookingStatus {
    Pending = "pending",
    Rejected = "rejected",
    Accepted = "accepted",
    Done = "done",
    NoShow = "no-show",
}

export type NewBooking = {
  clientName: string;
  clientPhone: string;
  service: string;
  barber: string;
  bookingTime: Timestamp;
  status: BookingStatus;
  createdAt: FieldValue;
};

export type InitialState = {
    success: string | boolean | undefined,
    error: string | undefined | null,
    id: string | undefined | null
  }