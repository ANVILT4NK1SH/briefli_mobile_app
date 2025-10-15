<template>
  <q-page-container class="row justify-center" style="padding: 0; margin: 0">
    <q-card
      v-for="client in clients"
      :key="client.clientId"
      elevated
      class="q-ma-sm q-pa-sm"
      style="max-width: 360px"
    >
      <q-item>
        <q-avatar top left v-if="client.imgUrl" class="q-mr-md">
          <q-img :src="client.imgUrl" alt="Client Icon" />
        </q-avatar>

        <q-avatar top left class="q-mr-md" v-else color="secondary" text-color="white">
          {{ client.name.slice(0, 1) }}
        </q-avatar>

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
  </q-page-container>
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
