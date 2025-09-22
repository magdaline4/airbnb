import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/listings';

// Get all listings
export const getListings = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Get single listing by ID
export const getListingById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Create new listing
export const createListing = async (listing) => {
    const response = await axios.post(BASE_URL, listing);
    return response.data;
};

// Update listing
export const updateListing = async (id, updatedData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
    return response.data;
};

// Delete listing
export const deleteListing = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};
