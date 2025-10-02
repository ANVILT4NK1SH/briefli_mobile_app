<template>
  <div>Clients component</div>
  <div v-for="client in clients" :key="client.clientId">
    <p>{{ client.name }}</p>
    <p>{{ client.imgUrl }}</p>
    <div v-for="partner in client.integrationPartners" :key="partner.credentialId">
      <p>Type: {{ partner.type }}</p>
      <p>Credential ID: {{ partner.credentialId }}</p>
    </div>
  </div>
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
