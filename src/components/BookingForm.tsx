"use client"

import { createBooking } from "@/app/actions/actions";
import SubmitButton from "@/components/SubmitButton";
import { Calendar24 } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, FormEventHandler } from "react";
import { useActionState } from "react";
import { InitialState } from "@/app/actions/types";
import { toast } from "sonner"

import { getServices, getBarbers } from "../lib/get-services"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Service = {
  name: string | undefined,
  index: number | undefined
}

type Barber = {
  name: string | undefined,
  avatarUrl: string,
}

export default function BookingForm({ onSubmit }: { onSubmit: FormEventHandler<HTMLDivElement> | undefined}) {
  
  const initialState: InitialState = {
    success: false,
    error: null,
    id: null
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [formState, formAction] = useActionState<InitialState, FormData>(createBooking, initialState);
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[] | []>([])
  const [barbers, setBarbers] = useState<Barber[] | []>([])

  useEffect(() => {
    const loadServices = async (): Promise<void> => {
      setLoading(true)
      try {
        const servicesData = await getServices();
        setServices(servicesData.services)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching services", error)
      }
    }
    const loadBarbers = async (): Promise<void> => {
      setLoading(true)
      try {
        const barbersData = await getBarbers();
        setBarbers(barbersData.barbers)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching services", error)
      }
    }
    loadServices()
    loadBarbers()
  }, [])
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : "";

  return (
    <div className={`fixed z-100 backdrop-blur-3xl bg-primary-foreground top-16  p-8 rounded-lg shadow-2xl w-full max-w-md`}>
      <h2 className="text-2xl font-bold mb-6 text-center ">Book Appointment</h2>
      <form
        action={formAction}
        onError={() => toast("Check your form fields.")}
        onSubmit={() => toast("Booking has been made")}
      >
        <div className="mb-4">
          <Label htmlFor="clientName" className="mb-2 text-muted-foreground">Your Name</Label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="clientPhone" className="mb-2 text-muted-foreground">Phone Number</Label>
          <Input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            placeholder="083 456 7890"
            required
          />

          {formState?.error && (
            <p className="mt-2 text-sm text-destructive">{formState.error}</p>
          )}
        </div>

        <div className="mb-4">
          <Select name="service" required>
            <SelectTrigger id="service" className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {services.map((service: Service, index: number) => (
                  <SelectItem className="outline" key={index} value={`${service.name}`}>{service.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Select name="barber">
            <SelectTrigger id="barber" className="w-full">
              <SelectValue placeholder="Select barber" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {barbers.map((barber: Barber, index: number) => (
                  <SelectItem className="outline" key={index} value={`${barber.name}`}>
                    <Avatar className="w-8">
                      <AvatarImage src={barber.avatarUrl}></AvatarImage>
                      <AvatarFallback>{barber.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Calendar24
            date={selectedDate}
            time={selectedTime}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
          <input type="hidden" name="bookingDate" value={formattedDate} />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}