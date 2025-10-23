<template>
  <!-- Sticky toolbar for filtering files by status -->
  <q-page-sticky expand position="top">
    <q-toolbar class="items-stretch bg-custombg justify-center z-top q-pa-none q-pt-xs">
      <!-- Filter buttons for different file statuses -->
      <q-btn
        :class="
          fileStore.statusBeingFiltered === fileStore.statusReviewNeeded
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-white'
        "
        padding="xs lg"
        @click="
          fileStore.filterByStatus(
            fileStore.statusReviewNeeded,
            (fileStore.clientUnassigned = false),
          )
        "
      >
        <p style="font-size: smaller; margin: 0">Review Needed</p>
      </q-btn>
      <q-btn
        v-if="$route.path === '/home'"
        :class="
          fileStore.clientUnassigned === true
            ? 'q-ma-xs justify-center items-center selected'
            : 'q-ma-xs bg-primary justify-center items-center'
        "
        @click="fileStore.filterByStatus(fileStore.statusAll, (fileStore.clientUnassigned = true))"
      >
        <p style="font-size: smaller; margin: 0">Unassigned</p>
      </q-btn>
      <q-btn
        :class="
          fileStore.statusBeingFiltered === fileStore.statusOk
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-white'
        "
        padding="xs lg"
        @click="fileStore.filterByStatus(fileStore.statusOk, (fileStore.clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">Exported</p>
      </q-btn>
      <q-btn
        :class="
          fileStore.statusBeingFiltered === fileStore.statusError
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-white'
        "
        padding="xs lg"
        @click="
          fileStore.filterByStatus(fileStore.statusError, (fileStore.clientUnassigned = false))
        "
      >
        <p style="font-size: smaller; margin: 0">Failed</p>
      </q-btn>
      <q-btn
        v-if="$route.path === '/home'"
        :class="
          fileStore.statusBeingFiltered === fileStore.statusAll
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-white'
        "
        padding="xs lg"
        @click="fileStore.filterByStatus(fileStore.statusAll, (fileStore.clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">All</p>
      </q-btn>
      <q-btn-dropdown
        v-else-if="$route.path === '/review'"
        :class="
          fileStore.statusBeingFiltered === fileStore.statusAll
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-white'
        "
        padding="xs lg"
        :label="selectedClient"
      >
        <q-list>
          <q-item-section
            v-for="client in clientStore.getClientNamesWithUnassignedandAll"
            :key="client"
            @click="onItemClick(client)"
          >
            <q-item-label>{{ client }}</q-item-label>
          </q-item-section>
        </q-list>
        <!-- <q-icon stack name="search" size="inherit"></q-icon>
        <p style="font-size: smaller; margin: 0">{{ clientStore.getSelectedClient }}</p> -->
      </q-btn-dropdown>
    </q-toolbar>

    <!-- dialog for filtering by client -->
    <q-dialog
      v-if="toggleSelectClient"
      v-model="toggleSelectClient"
      class="q-pa-md column flex flex-center column custom-rounded"
    >
      <CardFilterByClient @toggle="toggleSelectClientState" />
    </q-dialog>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFileStore } from 'src/stores/FileStore';
import CardFilterByClient from './CardFilterByClient.vue';
import { useClientStore } from 'src/stores/ClientStore';

const clientStore = useClientStore();
const fileStore = useFileStore();
const toggleSelectClient = ref(false);
const selectedClient = ref<string>('All Clients');

onMounted(async () => {
  await clientStore.getClients(); //client names update within
});

function onItemClick(client: string) {
  selectedClient.value = client;
  fileStore.filterByClientId(client).catch((error) => {
    console.error('Error filtering files: ', error);
  });
}

function toggleSelectClientState() {
  toggleSelectClient.value = !toggleSelectClient.value;
}
</script>
