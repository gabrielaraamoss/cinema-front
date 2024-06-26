import axios from 'axios';

const API_URL = 'http://localhost:5222/api/billboards';

interface NewBillboard {
  date: string;
  startTime: string;
  endTime: string;
  movieId: number;
  roomId: number;
}

interface Billboard {
  date: Date;
  startTime: Date;
  endTime: Date;
  movieId: number;
  roomId: number;
  status: boolean;
}


export const getAllBillboards = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching billboards: ${error.message}`);
  }
};


export const createBillboard = async (newBillboard: Billboard) => {
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


