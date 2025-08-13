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

export async function createBooking(prevState: InitialState, formData: FormData): Promise<InitialState> {
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const service = formData.get("service") as string;
  const barber = formData.get("barber") as string;
  const bookingDate = formData.get("bookingDate") as string;
  const bookingTime = formData.get("bookingTime") as string;

  if (!clientName || !clientPhone || !service || !barber || !bookingDate || !bookingTime) {
    return {
      success: false,
      id: null,
      error: "Please fill out all required fields."
    };
  }

  if (!validatePhoneNumber(clientPhone)) {
    return {
      success: false,
      id: null,
      error: "Invalid phone number."
    };
  }

  const combinedDateTimeString = `${bookingDate}T${bookingTime}:00`;
  try {
    const newBooking: NewBooking = {
      clientName,
      clientPhone,
      service,
      barber,
      bookingTime: Timestamp.fromDate(new Date(combinedDateTimeString)),
      status: BookingStatus.Pending,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    console.log("Successfully created new booking with ID:", docRef.id);

    revalidatePath("/");

    return {
      success: true,
      id: docRef.id,
      error: null
    };

  } catch (e) {
    console.error("Error adding booking to Firestore:", e);
    return {
      success: false,
      id: null,
      error: "An error occurred while creating the booking."
    };
  }
}