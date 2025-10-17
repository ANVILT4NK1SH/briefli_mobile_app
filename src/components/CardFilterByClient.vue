<template>
  <q-card>
    <q-select
      v-model="selectedClient"
      :options="clientNames"
      label="Select Client"
      clearable
      use-input
      class="q-pa-md column flex flex-center column custom-rounded"
    />
  </q-card>
</template>

<script setup lang="ts">
import { clientNames, selectedClient } from 'src/services/clientService';
</script>
