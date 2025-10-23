"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { fetchMovies } from "../../lib/redux/features/movies/moviesSlice";
import axios from "../../lib/axios";
import type { Show } from "../../lib/redux/features/movies/moviesSlice";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";

const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.movies);
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const selectedMovie = items.find((m) => m.id === selectedMovieId) ?? null;

  const openShowsDialog = (movieId: number) => {
    setSelectedMovieId(movieId);
    setDialogOpen(true);
  };

  const handleShowClick = async (showId: number) => {
    try {
      // fetch seats from backend (explicit port 8080 as requested)
      const res = await axios.get(
        `http://localhost:8080/api/v1/show/${showId}/seats`
      );
      const seats = res.data;

      try {
        sessionStorage.setItem(`seats_${showId}`, JSON.stringify(seats));
      } catch {
        // ignore storage errors
      }

      setDialogOpen(false);
      router.push(`/movies/${showId}/show`);
    } catch (err) {
      console.error(err);
      setDialogOpen(false);
      // fallback: navigate to show page which will fetch if no sessionStorage
      router.push(`/movies/${showId}/show`);
    }
  };

  return (
    <div className="p-6 container mx-auto pt-20">
      <h1 className="text-2xl font-semibold mb-4">Now Showing</h1>

      {loading && <div>Loading movies...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((movie) => (
          <div
            key={movie.id}
            className={`p-4 border rounded cursor-pointer hover:shadow`}
            onClick={() => openShowsDialog(movie.id)}
          >
            <h2 className="text-lg font-medium">{movie.title}</h2>
            <p className="text-sm text-muted-foreground">
              {movie.genre} • {movie.language} • {movie.duration}m
            </p>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shows</DialogTitle>
            <DialogDescription>
              Available shows for the selected movie
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            {selectedMovie ? (
              selectedMovie.shows.map((show: Show) => (
                <button
                  key={show.id}
                  className="w-full text-left p-3 rounded border hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleShowClick(show.id)}
                >
                  <div className="font-medium">
                    {new Date(show.startTime).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {show.hallName} • {show.location} • ₹{show.price}
                  </div>
                </button>
              ))
            ) : (
              <div>No shows available.</div>
            )}
          </div>

          <DialogClose className="mt-4">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoviesPage;
