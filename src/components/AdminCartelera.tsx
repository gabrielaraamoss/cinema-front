import React, { useEffect, useState } from 'react';
import { useReservationContext } from '../contexts/ReservationContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { deleteBillboard, updateBillboard } from '../services/billBoardsService';
import { useForm } from 'react-hook-form';

interface NewBillboardData {
  date: Date;
  startTime: Date;
  endTime: Date;
  movieId: number;
  roomId: number;
  status: boolean;
}

const AdminCartelera: React.FC = () => {
  const { billboards, loading, fetchBillboards, createBillboard, movies, rooms } = useReservationContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBillboardData, setNewBillboardData] = useState<NewBillboardData>({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 90 * 60000),
    movieId: 0,
    roomId: 0,
    status: true
  });

  const [selectedBillboardId, setSelectedBillboardId] = useState<number | null>(null);

  const { register, handleSubmit } = useForm<NewBillboardData>();

  useEffect(() => {
    fetchBillboards();
  }, []);

  const handleAddBillboard = async () => {
    try {
      if (newBillboardData.movieId === 0 || newBillboardData.roomId === 0) {
        console.error('Debe seleccionar una película y una sala.');
        return;
      }

      const selectedMovie = movies.find(movie => movie.id === newBillboardData.movieId);
      if (!selectedMovie) {
        throw new Error(`Película con ID ${newBillboardData.movieId} no encontrada.`);
      }
      const endTime = new Date(newBillboardData.startTime.getTime() + selectedMovie.lengthMinutes * 60000);

      const billboardToCreate: NewBillboardData = {
        ...newBillboardData,
        endTime
      };

      await createBillboard(billboardToCreate);
      await fetchBillboards();
      closeAddModal();
    } catch (error) {
      console.error('Error al agregar la cartelera:', error);
    }
  };

  const handleEditBillboard = async () => {
    try {
      if (!selectedBillboardId || newBillboardData.movieId === 0 || newBillboardData.roomId === 0) {
        console.error('Debe seleccionar una cartelera válida, película y sala.');
        return;
      }
  
      const selectedMovie = movies.find(movie => movie.id === newBillboardData.movieId);
      if (!selectedMovie) {
        throw new Error(`Película con ID ${newBillboardData.movieId} no encontrada.`);
      }
  
      const startTime = new Date(newBillboardData.startTime);
      const endTime = new Date(startTime.getTime() + selectedMovie.lengthMinutes * 60000);
  
      const billboardToUpdate = {
        ...newBillboardData,
        endTime: endTime.toISOString().split("T")[1].substring(0, 8), 
        date: new Date(newBillboardData.date).toISOString().split("T")[0], 
        startTime: startTime.toISOString().split("T")[1].substring(0, 8)
      };
  
      await updateBillboard(selectedBillboardId, billboardToUpdate);
      await fetchBillboards();
      closeAddModal();
    } catch (error) {
      console.error('Error al actualizar la cartelera:', error);
    }
  };
  
  const openAddModal = () => {
    const now = new Date();
    const selectedMovie = movies.find(movie => movie.id === newBillboardData.movieId);
    const endTime = selectedMovie ? new Date(now.getTime() + selectedMovie.lengthMinutes * 60000) : new Date(now.getTime() + 90 * 60000);
    setNewBillboardData({
      ...newBillboardData,
      date: now,
      startTime: now,
      endTime: endTime
    });
    setIsModalOpen(true);
  };

  const openEditModal = (billboardId: number) => {
    const billboard = billboards.find(billboard => billboard.id === billboardId);
    if (billboard) {
      const { date, startTime, endTime, movieId, roomId } = billboard;
      const baseDate = new Date(date);
  
      // Extract hours, minutes, and seconds from time strings
      const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
      const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);
  
      // Create full Date objects for startTime and endTime
      const fullStartTime = new Date(baseDate);
      fullStartTime.setHours(startHours, startMinutes, startSeconds);
  
      const fullEndTime = new Date(baseDate);
      fullEndTime.setHours(endHours, endMinutes, endSeconds);
  
      setNewBillboardData({
        date: baseDate,
        startTime: fullStartTime,
        endTime: fullEndTime,
        movieId,
        roomId,
        status: true
      });
  
      setSelectedBillboardId(billboardId);
      setIsModalOpen(true);
    } else {
      console.error(`No se encontró la cartelera con ID ${billboardId}.`);
    }
  };
  

  const closeAddModal = () => {
    setIsModalOpen(false);
    setSelectedBillboardId(null);
    const now = new Date();
    setNewBillboardData({
      date: now,
      startTime: now,
      endTime: new Date(now.getTime() + 90 * 60000),
      movieId: 0,
      roomId: 0,
      status: true
    });
  };

  const handleDeleteBillboard = async (billboardId: number) => {
    try {
      await deleteBillboard(billboardId);
      await fetchBillboards();
    } catch (error) {
      console.error('Error al eliminar la cartelera:', error);
    }
  };

  const handleStartTimeChange = (date: Date | null) => {
    if (date && newBillboardData.movieId !== 0) {
      const selectedMovie = movies.find(movie => movie.id === newBillboardData.movieId);
      if (!selectedMovie) {
        console.error(`No se encontró ninguna película con ID ${newBillboardData.movieId}.`);
        return;
      }

      const startTime = new Date(date);
      const endTime = new Date(startTime.getTime() + selectedMovie.lengthMinutes * 60000);

      setNewBillboardData({ ...newBillboardData, startTime, endTime });
    }
  };

  const getMovieNameById = (movieId: number) => {
    const movie = movies.find(movie => movie.id === movieId);
    return movie ? movie.name : 'Película no encontrada';
  };

  return (
    <div className="admin-cartelera p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Administrar Cartelera</h1>
      <div className="mb-4 flex justify-end">
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
          onClick={openAddModal}
        >
          Agregar Cartelera
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedBillboardId ? 'Editar' : 'Agregar Nueva'} Cartelera</h2>
            <form onSubmit={handleSubmit(selectedBillboardId ? handleEditBillboard : handleAddBillboard)}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
                <DatePicker
                  id="date"
                  selected={newBillboardData.date}
                  onChange={(date: Date | null) => date && setNewBillboardData({ ...newBillboardData, date })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione una fecha"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="movie" className="block text-sm font-medium text-gray-700">Película</label>
                <select
                  id="movie"
                  value={newBillboardData.movieId}
                  onChange={(e) => {
                    const movieId = parseInt(e.target.value);
                    setNewBillboardData({ ...newBillboardData, movieId });
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={0}>Seleccione una película</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="room" className="block text-sm font-medium text-gray-700">Sala</label>
                <select
                  id="room"
                  value={newBillboardData.roomId}
                  onChange={(e) => {
                    const roomId = parseInt(e.target.value);
                    setNewBillboardData({ ...newBillboardData, roomId });
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={0}>Seleccione una sala</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
                <DatePicker
                  id="startTime"
                  selected={newBillboardData.startTime}
                  onChange={(date: Date | null) => handleStartTimeChange(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="HH:mm"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholderText="Seleccione una hora de inicio"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                >
                  {selectedBillboardId ? 'Guardar cambios' : 'Agregar'}
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
          billboards.map(billboard => (
            <div key={billboard.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">{getMovieNameById(billboard.movieId)}</h2>
              <p>Fecha: {billboard.date.split('T')[0]}</p>
              <p>Hora de inicio: {billboard.startTime}</p>
              <p>Hora de fin: {billboard.endTime}</p>
              <p>Sala: {billboard.roomId}</p>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDeleteBillboard(billboard.id)}
                >
                  Eliminar
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openEditModal(billboard.id)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCartelera;
