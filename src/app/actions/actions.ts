"use server";

import { db } from "../../../firebase/firebase.config";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { InitialState, BookingStatus, NewBooking } from "./types";

function validatePhoneNumber(phoneNumber: string): boolean {
  const strippedNumber = phoneNumber.replace(/\s/g, "");
  const phoneRegex = /^(?:\+\d{11}|\d{10}|\d{12})$/;
  return phoneRegex.test(strippedNumber);
}

function parseLocalDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes); // month is 0-indexed
}

export async function createBooking(
  prevState: InitialState,
  formData: FormData
): Promise<InitialState> {
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const service = formData.get("service") as string;
  const barber = formData.get("barber") as string;
  const bookingDate = formData.get("bookingDate") as string;
  const bookingTime = formData.get("bookingTime") as string;

  // Validate required fields
  if (!clientName || !clientPhone || !service || !barber || !bookingDate || !bookingTime) {
    return { success: false, id: null, error: "Please fill out all required fields." };
  }

  // Validate phone number
  if (!validatePhoneNumber(clientPhone)) {
    return { success: false, id: null, error: "Invalid phone number." };
  }

  // Parse date & time in local timezone
  const requiredDate = parseLocalDateTime(bookingDate, bookingTime);
  const now = new Date();

  // Validate future date
  if (requiredDate < now) {
    return { success: false, id: null, error: "Please choose a date in the future." };
  }

  try {
    const newBooking: NewBooking = {
      clientName,
      clientPhone,
      service,
      barber,
      bookingTime: Timestamp.fromDate(requiredDate),
      status: BookingStatus.Pending,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    console.log("Successfully created new booking with ID:", docRef.id);

    // Optional: refresh UI after booking
    revalidatePath("/");

    return { success: true, id: docRef.id, error: null };
  } catch (e) {
    console.error("Error adding booking to Firestore:", e);
    return { success: false, id: null, error: "An error occurred while creating the booking." };
  }
}
