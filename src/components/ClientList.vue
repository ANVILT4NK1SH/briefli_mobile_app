<template>
  <q-card v-for="client in clients" :key="client.clientId" elevated class="q-mb-md">
    <q-item>
      <q-item-section left>
        <q-avatar icon="apartment"></q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ client.name }}</q-item-label>
        <q-item-section v-for="partner in client.integrationPartners" :key="partner.credentialId">
          <q-item-label>Type: {{ partner.type }}</q-item-label>
          <q-item-label caption lines="2">Credential ID: </q-item-label>
          <q-item> {{ partner.credentialId }}</q-item>
        </q-item-section>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption>{{ client.clientId }}</q-item-label>
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
