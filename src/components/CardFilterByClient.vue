<template>
  <q-card class="q-pa-md column flex flex-center column custom-rounded">
    <q-select
      v-model="selectedClient"
      :options="clientNames"
      label="Select Client"
      clearable
      use-input
      class="inherit"
    />
    <q-btn @click="clickHandler(selectedClient!)" class="q-mt-md" color="secondary"> Filter </q-btn>
  </q-card>
</template>

<script setup lang="ts">
import { clientNames, getAllClientNames, selectedClient } from 'src/services/clientService';
import { filterFilesByClientId } from 'src/services/fileService';
import { onMounted } from 'vue';

const emit = defineEmits(['toggle']);

onMounted(() => {
  clientNamesPlusUnassigned();
});

function clickHandler(selectedClient: string) {
  filterFilesByClientId(selectedClient)
    .then(() => {
      toggleCard();
    })
    .catch((error) => {
      console.error('Error filtering files: ', error);
    });
}

function toggleCard() {
  emit('toggle');
}

function clientNamesPlusUnassigned() {
  getAllClientNames(); //set all names
  clientNames.value.push('Unassigned'); //push unassigned
}
</script>
