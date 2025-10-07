import axios from 'axios';
import { ref } from 'vue';
import { authService } from './authService';

const bearerToken = ref('');

export const getClients = async () => {
  bearerToken.value = await authService.getBearerToken();
  const response = await axios.get(`${process.env.API_URL}/org/clients`, {
    headers: { Authorization: `Bearer ${bearerToken.value}` },
  });
  console.log(response.data.clients);
  return response.data.clients;
};
