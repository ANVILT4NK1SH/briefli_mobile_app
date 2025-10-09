<template>
  <q-toolbar class="q-pa-sm items-stretch bg-primary justify-center">
    <!-- would it be better to make this toolbar its own component-->
    <q-btn
      style="background-color: white"
      padding="xs lg"
      @click="filterByStatus = statusReviewNeeded"
    >
      Review Needed
    </q-btn>
    <q-btn
      style="background-color: white"
      padding="xs lg"
      @click="filterByStatus = statusUnassigned"
      >Unassigned</q-btn
    >
    <q-btn style="background-color: white" padding="xs lg" @click="filterByStatus = statusOk">
      Exported
    </q-btn>
    <q-btn style="background-color: white" padding="xs lg" @click="filterByStatus = statusError">
      Failed
    </q-btn>
    <q-btn style="background-color: white" padding="xs lg" @click="filterByStatus = statusAll">
      All
    </q-btn>
  </q-toolbar>

  <q-item v-for="file in filteredFiles" :key="file.fileName" class="justify-center">
    <q-item-section side left>
      <q-avatar icon="description" />
      <q-item-label>
        {{ file.documentTypes[0] }}
      </q-item-label>
    </q-item-section>

    <q-item-section class="items-center">
      <q-item-label class="text-center">{{ file.displayName }}</q-item-label>
      <q-item-label caption class="text-center">{{ getClientName(file.clientId) }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <!-- UNSURE OF ALL POSSIBLE STATUS CODES; failed, review etc? -->
      <q-item-label
        caption
        :class="{
          'bg-positive': file.status === 'EXPORTED',
          'bg-negative': file.status === 'ERROR' || file.status === 'INVALID',
          'bg-warning': file.status === 'REJECTED',
          'bg-info': file.status === 'PROCESSED',
        }"
      >
        {{ file.status }}
      </q-item-label>
    </q-item-section>
    <q-separator spaced inset />
  </q-item>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { login } from 'src/services/authService';
import { onMounted, ref, watch } from 'vue';
import {
  filteredFiles,
  filterByStatus,
  files,
  statusAll,
  statusError,
  statusOk,
  statusUnassigned,
  statusReviewNeeded,
} from 'src/services/fileService';
import { apiService } from 'src/services/apiService';
import type { Client } from './models';
import { getClients } from 'src/services/clientService';

const auth0 = useAuth0();
const clients = ref<Client[]>([]);

onMounted(async () => {
  if (auth0.isLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(auth0.isLoading, (loading) => {
        if (!loading) {
          stop(); // Stop the watcher
          resolve();
        }
      });
    });
  }

  if (!auth0.isAuthenticated.value) {
    await login();
    return;
  }

  try {
    const response = await apiService.getFiles();
    files.value = response.data;
    clients.value = await getClients();

    console.log('Files fetched:');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const getClientName = (clientId: string) => {
  const client = clients.value.find((client) => client.clientId === clientId);

  if (client) {
    return client.name;
  }

  return '';
};
</script>
