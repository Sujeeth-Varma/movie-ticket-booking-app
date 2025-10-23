import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../axios";

export interface Show {
  id: number;
  hallName: string;
  location: string;
  startTime: string; // ISO string
  price: number;
}

export interface Movie {
  id: number;
  title: string;
  language: string;
  genre: string;
  duration: number;
  shows: Show[];
}

interface MoviesState {
  items: Movie[];
  loading: boolean;
  error: string | null;
  selectedMovieId: number | null;
}

const initialState: MoviesState = {
  items: [],
  loading: false,
  error: null,
  selectedMovieId: null,
};

export const fetchMovies = createAsyncThunk<Movie[] | [], void>(
  "movies/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("api/v1/movies");
      return res.data;
    } catch (err: unknown) {
      // Normalize error message
      let message = "Unknown error";
      if (typeof err === "string") message = err;
      else if (err && typeof err === "object") {
        // Try to pluck message from common axios error shape
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = e?.response?.data?.message || e?.message || String(err);
      }
      return rejectWithValue(message);
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    selectMovie(state, action: PayloadAction<number | null>) {
      state.selectedMovieId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch movies";
      });
  },
});

export const { selectMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
