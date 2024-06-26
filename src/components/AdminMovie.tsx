import React, { useEffect, useState } from 'react';
import { getAllMovies, addMovie, deleteMovie, updateMovie } from '../services/movieService';
import { MovieDTO } from '../types/types';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';

enum MovieGenreEnum {
    ACTION = 'Action',
    ADVENTURE = 'Adventure',
    COMEDY = 'Comedy',
    DRAMA = 'Drama',
    FANTASY = 'Fantasy',
    HORROR = 'Horror',
    MUSICALS = 'Musicals',
    MYSTERY = 'Mystery',
    ROMANCE = 'Romance',
    SCIENCE_FICTION = 'Science Fiction',
    SPORTS = 'Sports',
    THRILLER = 'Thriller',
    WESTERN = 'Western'
}

const AdminMovie: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<MovieDTO>();
    const [movies, setMovies] = useState<MovieDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const data = await getAllMovies();
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: MovieDTO) => {
        try {
            if (isEditMode && selectedMovieId) {
                await updateMovie(selectedMovieId, data);
            } else {
                await addMovie(data);
            }
            fetchMovies();
            closeAddModal();
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    };

    const handleDeleteMovie = async (movieId: number) => {
        try {
            await deleteMovie(movieId);
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    const openAddModal = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setSelectedMovieId(null);
        reset({
            name: '',
            genre: MovieGenreEnum.ACTION,
            allowedAge: 0,
            lengthMinutes: 0
        });
    };

    const openEditModal = (movie: MovieDTO) => {
        setIsModalOpen(true);
        setIsEditMode(true);
        setSelectedMovieId(movie.id ?? null);
        reset(movie);
    };

    const closeAddModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        reset({
            name: '',
            genre: MovieGenreEnum.ACTION,
            allowedAge: 0,
            lengthMinutes: 0
        });
    };

    return (
        <div className="admin-movies p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Administrar Películas</h1>
            <div className="mb-4 flex justify-end">
                <button
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                    onClick={openAddModal}
                >
                    Agregar Película
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {isEditMode ? 'Editar Película' : 'Agregar Nueva Película'}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    {...register('name', { required: true })}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Género</label>
                                <select
                                    id="genre"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    {...register('genre', { required: true })}
                                >
                                    {Object.values(MovieGenreEnum).map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="allowedAge" className="block text-sm font-medium text-gray-700">Edad Permitida</label>
                                <input
                                    type="number"
                                    id="allowedAge"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    {...register('allowedAge', { required: true, min: 1 })}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="lengthMinutes" className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
                                <input
                                    type="number"
                                    id="lengthMinutes"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    {...register('lengthMinutes', { required: true, min: 1 })}
                                />
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    {isEditMode ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    <p className="col-span-full text-center">Cargando...</p>
                ) : (
                    movies.map((movie) => (
                        <div key={movie.id} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-2">{movie.name}</h2>
                            <p>Género: {movie.genre}</p>
                            <p>Edad Permitida: {movie.allowedAge}+</p>
                            <p>Duración: {movie.lengthMinutes} min</p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => openEditModal(movie)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleDeleteMovie(movie.id!)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminMovie;
