import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { authService } from 'src/services/authService';
import type { Client } from 'src/components/models';

export const useClientStore = defineStore('ClientStore', {
  state: () => ({
    clients: ref<Client[]>([]),
    selectedClient: ref(''),
    clientNames: ref<string[]>([]),
    bearerToken: ref(''),
  }),

  getters: {
    getAllClients: (state) => state.clients,
    getAllClientNames: (state) => state.clientNames,
    getSelectedClient: (state) => state.selectedClient,

    // Client names including "Unassigned"
    getClientNamesWithUnassignedandAll: (state) => {
      return [...state.clientNames, 'Unassigned', 'All'];
    },

    // Get client name by ID
    getClientNameById: (state) => (clientId: string) => {
      const client = state.clients.find((client) => client.clientId === clientId);
      return client ? client.name : '';
    },

    // Get client ID by name
    getClientIdByName: (state) => (clientName: string | null) => {
      const client = state.clients.find((client) => client.name === clientName);
      return client ? client.clientId : '';
    },
  },

  actions: {
    // GET clients from api
    async getClients() {
      try {
        this.bearerToken = await authService.getBearerToken();
        const response = await axios.get(`${process.env.API_URL}/org/clients`, {
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        });

        this.clients = response.data.clients;
        this.updateClientNames();
        return this.clients;
      } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
    },

    // update client names in state
    updateClientNames() {
      this.clientNames = this.clients.map((client: Client) => client.name);
    },

    // set selected client state
    setSelectedClient(client: string) {
      this.selectedClient = client;
    },

    // reset selected client state
    clearSelectedClient() {
      this.selectedClient = '';
    },
  },
});
