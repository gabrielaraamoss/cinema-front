import axios from 'axios';
import { MovieDTO } from '../types/types';

const API_URL = 'http://localhost:5222/api/movies';

export const getAllMovies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const addMovie = async (movie: MovieDTO) => {
  try {
    const response = await axios.post(API_URL, movie);
    return response.data;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const deleteMovie = async (movieId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting movie with ID ${movieId}:`, error);
    throw error;
  }
};

export const updateMovie = async (movieId: number, updatedMovieData: MovieDTO) => {
    try {
      const response = await axios.put(`${API_URL}/${movieId}`, updatedMovieData);
      return response.data;
    } catch (error) {
      console.error(`Error updating movie with ID ${movieId}:`, error);
      throw error;
    }
  };
  