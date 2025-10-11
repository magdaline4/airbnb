import axios from "axios";

// For development with proxy, use empty base URL
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? ''  // Empty for proxy to work
  : 'https://airbnbbackend-5us6w3kx0-hyasas-projects.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const roomService = {
  createRoom: async (roomData) => {
    const response = await api.post("/api/rooms", roomData);
    return response.data;
  },
  
  getAllRooms: async () => {
    const response = await api.get("/api/rooms");
    return response.data;
  },
  
  getRoomById: async (id) => {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
  },
  
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/api/rooms/${id}`, roomData);
    return response.data;
  },
  
  deleteRoom: async (id) => {
    const response = await api.delete(`/api/rooms/${id}`);
    return response.data;
  }
};

export default roomService;