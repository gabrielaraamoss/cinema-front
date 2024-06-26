import axios from 'axios';

const API_URL = 'http://localhost:5222/api/billboards';

interface NewBillboard {
  date: string;
  startTime: string;
  endTime: string;
  movieId: number;
  roomId: number;
}



export const getAllBillboards = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching billboards: ${error.message}`);
  }
};


export const createBillboard = async (newBillboard: NewBillboard) => {
  try {
    const response = await axios.post(API_URL, {
      date: newBillboard.date,
      startTime: newBillboard.startTime,
      endTime: newBillboard.endTime,
      movieId: newBillboard.movieId,
      roomId: newBillboard.roomId,
      status: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      throw new Error(`Validation errors occurred: ${JSON.stringify(validationErrors)}`);
    } else {
      console.error('Error creating billboard:', error.message);
      throw new Error(`Error creating billboard: ${error.message}`);
    }
  }
};

export const updateBillboard = async (id: number, updatedBillboard: NewBillboard) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        date: updatedBillboard.date,
        startTime: updatedBillboard.startTime,
        endTime: updatedBillboard.endTime,
        movieId: updatedBillboard.movieId,
        roomId: updatedBillboard.roomId,
        status: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(`Validation errors occurred: ${JSON.stringify(validationErrors)}`);
      } else {
        console.error('Error updating billboard:', error.message);
        throw new Error(`Error updating billboard: ${error.message}`);
      }
    }
  };

  
  export const deleteBillboard = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting billboard:', error.message);
      throw new Error(`Error deleting billboard: ${error.message}`);
    }
  };
  
