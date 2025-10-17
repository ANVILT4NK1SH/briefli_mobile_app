import axios from 'axios';
import { ref } from 'vue';
import { authService } from './authService';
import type { Client } from 'src/components/models';

const bearerToken = ref('');
export const clients = ref<Client[]>([]);
export const selectedClient = ref(null);
export const clientNames = ref<string[]>([]);

export const getClients = async () => {
  bearerToken.value = await authService.getBearerToken();
  const response = await axios.get(`${process.env.API_URL}/org/clients`, {
    headers: { Authorization: `Bearer ${bearerToken.value}` },
  });
  console.log(response.data.clients);
  return response.data.clients;
};

// Retrieve client name based on client ID
export const getClientName = (clientId: string) => {
  const client = clients.value.find((client) => client.clientId === clientId);
  return client ? client.name : '';
};
