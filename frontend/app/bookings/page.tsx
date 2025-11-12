"use client";

import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/hooks";

interface Booking {
  bookingId: number;
  bookingStatus: string;
  bookedAt: string;
  show: {
    showId: number;
    movieTitle: string;
    startTime: string;
    hall: string;
  };
  seats: string[];
  pricePerSeat: number;
  totalPrice: number;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { isAuthenticated, user } = useAppSelector((s) => s.user);

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      setDeleting(true);
      const res = await axios.delete(
        `http://localhost:8080/api/v1/booking/${bookingId}`
      );
      if (res.status === 200) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
        setDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewBooking = async (bookingId: number) => {
    try {
      if (isAuthenticated) {
        const res = await axios.get(
          `http://localhost:8080/api/v1/booking/${bookingId}`
        );
        if (res.data.success) {
          setSelectedBooking(res.data);
          setDialogOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load booking details");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await axios.get(
            "http://localhost:8080/api/v1/booking/user"
          );
          setBookings(res.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="p-6 container mx-auto pt-20">
        <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
        <div className="text-muted-foreground">
          Please log in to view your bookings.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto pt-20">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse flex flex-col gap-4 w-full">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border rounded p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewBooking(booking.bookingId)}
          >
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-medium truncate">
                  {booking.show.movieTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {booking.show.hall} •{" "}
                  {new Date(booking.show.startTime).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {booking.seats.map((seat) => (
                  <span
                    key={seat}
                    className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs"
                  >
                    {seat}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-end pt-2 border-t">
                <div>
                  <div className="font-semibold">₹{booking.totalPrice}</div>
                  <div className="text-xs text-muted-foreground">
                    (₹{booking.pricePerSeat} × {booking.seats.length})
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.bookingStatus === "CONFIRMED"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.bookingStatus}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Booked on {new Date(booking.bookedAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Movie</h3>
                  <p className="text-muted-foreground">
                    {selectedBooking.show.movieTitle}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Hall</h3>
                  <p className="text-muted-foreground">
                    {selectedBooking.show.hall}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Show Time</h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedBooking.show.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Seats</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Price Details</h3>
                  <p className="text-muted-foreground">
                    ₹{selectedBooking.pricePerSeat} ×{" "}
                    {selectedBooking.seats.length} seats = ₹
                    {selectedBooking.totalPrice}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Booking Status</h3>
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedBooking.bookingStatus === "CONFIRMED"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedBooking.bookingStatus}
                  </div>
                </div>
              </div>
              <DialogFooter>
                {selectedBooking.bookingStatus === "CONFIRMED" && (
                  <Button
                    variant="destructive"
                    disabled={deleting}
                    onClick={() =>
                      handleDeleteBooking(selectedBooking.bookingId)
                    }
                  >
                    {deleting ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBookingsPage;
