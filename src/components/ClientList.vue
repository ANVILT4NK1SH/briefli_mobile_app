<template>
  <q-card v-for="client in clients" :key="client.clientId" elevated class="q-mb-md">
    <q-item>
      <q-avatar icon="apartment" top left></q-avatar>

      <q-item-section top left>
        <q-item-label class="text-h6">{{ client.name }}</q-item-label>
        <div v-for="partner in client.integrationPartners" :key="partner.credentialId">
          <q-item-label>Type: {{ partner.type }}</q-item-label>
          <q-item-label caption lines="2">Organization ID: </q-item-label>
          <q-item> {{ partner.credentialId }}</q-item>
        </div>
      </q-item-section>

      <q-item-section top right>
        <q-item-label caption> Client ID: </q-item-label>
        {{ client.clientId }}
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

interface Clients {
  orgId: string;
  clientId: string;
  name: string;
  imgUrl: string;
  integrationPartners: IntegrationPartners[];
}

interface IntegrationPartners {
  type: string;
  credentialId: string;
}

const clients = ref<Clients[]>([]);

onMounted(async () => {
  //fetch bearer token for API calls
  const auth0 = useAuth0();

  const bearerToken = await auth0.getAccessTokenSilently();

  axios
    .get('https://demo-api.project-onyx-test.com/org/clients', {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      console.log(response.data);
      clients.value = response.data.clients;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});
</script>
