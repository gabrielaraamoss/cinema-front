const API_BASE_URL = 'http://localhost:5222/api';

interface RoomData {
  name: string;
  number: number;
}

export const getAllRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  if (!response.ok) {
    const errorMessage = `Failed to fetch rooms: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

export const getRoomById = async (roomId: number) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
  if (!response.ok) {
    const errorMessage = `Failed to fetch room: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

export const createRoom = async (roomData: RoomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    const errorMessage = `Failed to create room: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateRoom = async (roomId: number, roomData: RoomData) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
    });

    if (!response.ok) {
        const errorMessage = `Failed to update room: ${response.status}`;
        throw new Error(errorMessage);
    }

    try {
        return null;
    } catch (error) {
        throw new Error('Error parsing JSON response');
    }
};


export const deleteRoom = async (roomId: number) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorMessage = `Failed to delete room: ${response.status}`;
        throw new Error(errorMessage);
    }

    return null; 
};
