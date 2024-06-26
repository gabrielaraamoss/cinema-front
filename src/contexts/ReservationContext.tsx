import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllBillboards, createBillboard} from '../services/billBoardsService';
import { getAllMovies } from '../services/movieService';
import { getAllRooms } from '../services/roomService';

interface Billboard {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  movieId: number;
  roomId: number;
  status: boolean;
}

interface Movie {
  id: number;
  name: string;
  lengthMinutes: number;
}

interface Room {
  id: number;
  name: string;
  number: number;
}

interface ReservationContextType {
  billboards: Billboard[];
  movies: Movie[];
  rooms: Room[];
  loading: boolean;
  fetchBillboards: () => void;
  fetchMovies: () => void;
  fetchRooms: () => void;
  createBillboard: (newBillboard: NewBillboardData) => Promise<void>;
  formatTime: (date: Date) => void
}

interface NewBillboardData {
  date: Date;
  startTime: Date;
  movieId: number;
  roomId: number;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservationContext must be used within a ReservationContextProvider');
  }
  return context;
};

export const ReservationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillboards();
    fetchMovies();
    fetchRooms();
  }, []);

  const fetchBillboards = async () => {
    try {
      const data = await getAllBillboards();
      setBillboards(data);
    } catch (error) {
      console.error('Error fetching billboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const data: any[] = await getAllMovies();

      const formattedMovies: Movie[] = data.map(movie => ({
        id: movie.id,
        name: movie.name,
        lengthMinutes: movie.lengthMinutes,
      }));

      setMovies(formattedMovies);

    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };


  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const addNewBillboard = async (newBillboard: NewBillboardData) => {
    try {
        await fetchMovies();

        const selectedMovie = movies.find(movie => movie.id === newBillboard.movieId);
        if (!selectedMovie) {
            throw new Error(`Movie with ID ${newBillboard.movieId} not found.`);
        }

        const endTime = new Date(newBillboard.startTime.getTime() + selectedMovie.lengthMinutes * 60000);

        const billboardToCreate = {
            date: newBillboard.date.toISOString().split('T')[0],
            startTime: formatTime(newBillboard.startTime),
            endTime: formatTime(endTime),
            movieId: newBillboard.movieId ,
            roomId: newBillboard.roomId,
            status: true,
        };

        await createBillboard(billboardToCreate);
        await fetchBillboards();

    } catch (error: any) {
        console.error('Error creating billboard:', error);
        throw new Error(`Error creating billboard: ${error.message}`);
    }
};


  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };



  const contextValue: ReservationContextType = {
    formatTime,
    billboards,
    movies,
    rooms,
    loading,
    fetchBillboards,
    fetchMovies,
    fetchRooms,
    createBillboard: addNewBillboard,
  };

  return (
    <ReservationContext.Provider value={contextValue}>
      {children}
    </ReservationContext.Provider>
  );
};
