import React, { useEffect, useState } from 'react';
import { getAllRooms, createRoom, deleteRoom, updateRoom } from '../services/roomService';
import { RoomDTO } from '../types/types';
import { useForm } from 'react-hook-form';

const AdminRoom: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<{
        name: string;
        number: number;
    }>();
    const [rooms, setRooms] = useState<RoomDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await getAllRooms();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: RoomDTO) => {
        try {
            if (selectedRoomId !== null) {
                await updateRoom(selectedRoomId, data);
            } else {
                await createRoom(data);
            }
            fetchRooms();
            closeAddModal();
            reset();
        } catch (error) {
            console.error('Error submitting room:', error);
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        try {
            await deleteRoom(roomId);
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const openAddModal = () => {
        setIsModalOpen(true);
        setSelectedRoomId(null);
    };

    const openEditModal = (room: RoomDTO) => {
        setIsModalOpen(true);
        setSelectedRoomId(room.id ?? null);
        reset(room);
    };

    const closeAddModal = () => {
        setIsModalOpen(false);
        setSelectedRoomId(null);
        reset(); 
    };

    return (
        <div className="admin-rooms p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Administrar Salas</h1>
            <div className="mb-4 flex justify-end">
                <button
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                    onClick={openAddModal}
                >
                    Agregar Sala
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">{selectedRoomId !== null ? 'Editar Sala' : 'Agregar Nueva Sala'}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { required: true })}
                                    className="mt-1 block w-full px-3 py-2 uppercase border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
                                <input
                                    type="number"
                                    id="number"
                                    {...register('number', { required: true, min: 1 })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300"
                                    onClick={closeAddModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                                >
                                    {selectedRoomId !== null ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {rooms.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p className="text-lg">No existen salas disponibles.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-center bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">ID</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">Nombre</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">Número</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="px-4 py-2 border-b border-gray-200">{room.id}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{room.name}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{room.number}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <button
                                            className="mr-2 font-bold py-1 px-3"
                                            onClick={() => room.id && handleDeleteRoom(room.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg>
                                        </button>
                                        <button
                                            className=" font-bold py-1 px-3"
                                            onClick={() => openEditModal(room)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
                                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminRoom;
