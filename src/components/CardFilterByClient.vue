<template>
  <q-card>
    <q-select
      v-model="selectedClient"
      :options="clientNames"
      label="Select Client"
      clearable
      use-input
      class="q-pa-md custom-rounded"
    />
    <q-btn
      @click="filterFilesByClientId(selectedClient)"
      class="q-pa-lg q-ma-md center-items"
      color="secondary"
    >
      Filter
    </q-btn>
  </q-card>
</template>

<script setup lang="ts">
import { clientNames, selectedClient } from 'src/services/clientService';
import { filterFilesByClientId } from 'src/services/fileService';
</script>
