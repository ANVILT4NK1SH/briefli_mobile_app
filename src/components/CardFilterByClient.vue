<template>
  <q-card class="q-pa-md column flex flex-center column custom-rounded">
    <!-- <q-select
      v-model="selectedClient"
      :options="clientStore.getClientNamesWithUnassignedandAll"
      label="Select Client"
      clearable
      use-input
      class="inherit"
    />
    <q-btn
      @click="clickHandler(selectedClient!)"
      @update:selected-client="selectedClient"
      class="q-mt-md"
      color="secondary"
    >
      Filter
    </q-btn> -->
  </q-card>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFileStore } from 'src/stores/FileStore';
import { useClientStore } from 'src/stores/ClientStore';

const emit = defineEmits(['toggle']);
const fileStore = useFileStore();
const clientStore = useClientStore();
const selectedClient = ref(null);

onMounted(async () => {
  if (clientStore.clients.length === 0) {
    await clientStore.getClients();
  }
});

function clickHandler(selectedClient: string) {
  fileStore
    .filterByClientId(selectedClient)
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
</script> -->
