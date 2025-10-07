<template>
  <q-card v-for="client in clients" :key="client.clientId" elevated class="q-mb-md">
    <q-item>
      <q-avatar top left><img src="client.imgUrl" alt="Client Icon" /></q-avatar>

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
import { getClients } from 'src/services/clientService';
import { onMounted, ref } from 'vue';
import type { Client } from './models';

const clients = ref<Client[]>([]);

onMounted(async () => {
  clients.value = await getClients();
});
</script>
