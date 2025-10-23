/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "../../../../lib/axios";
import { toast } from "sonner";

type SeatStatus = "AVAILABLE" | "CONFIRMED" | string;

interface Seat {
  seatId: number;
  label: string;
  status: SeatStatus;
  row: number;
  col: number;
}

const formatCurrency = (n: number) => `₹${n}`;

export default function ShowPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params?.showId ?? "";

  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<number[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // fetch seats (cache to sessionStorage to avoid refetch on back/forward)
  useEffect(() => {
    if (!showId) return;
    const key = `seats_${showId}`;
    const raw =
      typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    if (raw) {
      try {
        setSeats(JSON.parse(raw));
        return;
      } catch {
        /* fallthrough */
      }
    }

    const fetchSeats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/v1/show/${showId}/seats`);
        setSeats(res.data);
        try {
          sessionStorage.setItem(key, JSON.stringify(res.data));
        } catch {
          // ignore
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showId]);

  // compute grid size and structured grid from seats
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { maxRow, maxCol, grid } = useMemo(() => {
    if (!seats || seats.length === 0)
      return { maxRow: 0, maxCol: 0, grid: [] as (Seat | null)[] };
    const maxRow = Math.max(...seats.map((s) => s.row));
    const maxCol = Math.max(...seats.map((s) => s.col));
    const cells: (Seat | null)[] = Array.from(
      { length: maxRow * maxCol },
      () => null
    );
    seats.forEach((s) => {
      const r = s.row - 1;
      const c = s.col - 1;
      const idx = r * maxCol + c;
      if (idx >= 0 && idx < cells.length) cells[idx] = s;
    });
    return { maxRow, maxCol, grid: cells };
  }, [seats]);

  const toggleSeat = (seat: Seat | null) => {
    if (!seat) return;
    if (seat.status !== "AVAILABLE") return;
    setSelected((prev) =>
      prev.includes(seat.seatId)
        ? prev.filter((id) => id !== seat.seatId)
        : [...prev, seat.seatId]
    );
  };

  const handleBook = async () => {
    if (!showId || selected.length === 0) return;
    setBookingError(null);
    setBookingLoading(true);
    try {
      const res = await axios.post(`/api/v1/booking`, {
        showId: Number(showId),
        seatIds: selected,
      });
      if (res?.data?.success) {
        // clear cached seats to force refresh of booking state
        toast.success("Booking successful!");
        try {
          sessionStorage.removeItem(`seats_${showId}`);
        } catch {}
        router.push("/bookings");
      } else {
        setBookingError("Booking failed. Please try again.");
      }
    } catch (e: any) {
      setBookingError(e?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const seatPrice = 150; // fallback per-seat price; ideally comes from API

  return (
    <div className="p-14 max-w-5xl mx-auto">
      <button
        className="text-sm text-blue-600 mb-4"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">Select seats</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Tap or click available seats to select. Scroll horizontally on small
        screens.
      </p>

      {loading && (
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {!loading && seats && seats.length === 0 && (
        <div className="p-4">No seat data available.</div>
      )}

      {seats && seats.length > 0 && (
        <div className="space-y-6">
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded" /> Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded" /> Selected
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded" /> Booked
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div
              className="inline-grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  1,
                  maxCol
                )}, minmax(44px, 1fr))`,
              }}
            >
              {grid.map((cell, idx) => {
                if (!cell)
                  return (
                    <div key={idx} className="aspect-square p-1 opacity-0" />
                  );
                const isSelected = selected.includes(cell.seatId);
                const isAvailable = cell.status === "AVAILABLE";
                const base =
                  "aspect-square flex flex-col items-center justify-center border rounded p-2 text-sm";
                const cls = isAvailable
                  ? isSelected
                    ? "bg-blue-200 border-blue-500 text-gray-900 cursor-pointer"
                    : "bg-green-200 hover:bg-green-300 text-gray-900 cursor-pointer"
                  : "bg-red-200 text-gray-600 cursor-not-allowed";
                return (
                  <div
                    key={idx}
                    className={`${base} ${cls}`}
                    onClick={() => toggleSeat(cell)}
                  >
                    <div className="font-medium">{cell.label}</div>
                    <div className="text-xs mt-1 hidden lg:block">
                      {isSelected ? "Selected" : cell.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full h-2 bg-muted border-2 border-foreground rounded-full" />
          <div className="text-center text-sm text-muted-foreground">
            Screen
          </div>
        </div>
      )}

      {/* Booking bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-auto md:bottom-6 md:mx-auto md:w-[560px] bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">
              {selected.length} seat(s) selected
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(selected.length * seatPrice)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {bookingError && (
              <div className="text-sm text-red-600">{bookingError}</div>
            )}
            <button
              className="px-4 py-2 bg-background rounded-md"
              onClick={() => setSelected([])}
              disabled={bookingLoading}
            >
              Clear
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
              onClick={handleBook}
              disabled={bookingLoading}
            >
              {bookingLoading
                ? "Booking..."
                : `Confirm (${formatCurrency(selected.length * seatPrice)})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
