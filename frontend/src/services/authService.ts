import axios from "axios";

const API_URL = "https://api.medipaws-expert.my.id/api/admin";

export const loginAdmin = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};
