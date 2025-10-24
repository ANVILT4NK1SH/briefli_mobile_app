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
          (fileStore.filterByStatus(fileStore.statusReviewNeeded),
          $route.path === '/home'
            ? (clientStore.selectedClient = 'All')
            : (clientStore.selectedClient = clientStore.selectedClient))
        "
      >
        <p style="font-size: smaller; margin: 0">Review Needed</p>
      </q-btn>
      <q-btn
        v-if="$route.path === '/home'"
        :class="
          clientStore.selectedClient === 'Unassigned'
            ? 'q-ma-xs justify-center items-center selected'
            : 'q-ma-xs bg-primary justify-center items-center'
        "
        @click="
          (fileStore.filterByStatus(fileStore.statusAll),
          (clientStore.selectedClient = 'Unassigned'))
        "
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
        @click="
          (fileStore.filterByStatus(fileStore.statusOk),
          $route.path === '/home'
            ? (clientStore.selectedClient = 'All')
            : (clientStore.selectedClient = clientStore.selectedClient))
        "
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
          (fileStore.filterByStatus(fileStore.statusError),
          $route.path === '/home'
            ? (clientStore.selectedClient = 'All')
            : (clientStore.selectedClient = clientStore.selectedClient))
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
        @click="
          (fileStore.filterByStatus(fileStore.statusAll), (clientStore.selectedClient = 'All'))
        "
      >
        <p style="font-size: smaller; margin: 0">All</p>
      </q-btn>
      <q-btn-dropdown
        v-else-if="$route.path === '/review'"
        :class="
          selectedClient !== 'All Clients' && selectedClient !== 'All'
            ? 'selected q-ma-xs'
            : 'q-ma-xs bg-primary'
        "
        padding="xs lg"
        :label="selectedClient"
      >
        <q-list
          class="q-ma-none q-pa-none column ellipsis"
          style="
            width: 60vw;
            justify-content: center;
            align-items: center;
            left: 1;
            top: 20;
            z-index: 110;
          "
        >
          <q-item-section
            style="border-bottom: 1px solid black; width: 100%; text-align: center"
            v-for="client in clientStore.getClientNamesWithUnassignedandAll"
            :key="client"
            :class="
              client === clientStore.selectedClient
                ? 'selected q-ma-none q-pa-md'
                : 'q-ma-none q-pa-md'
            "
            @click="onItemClick(client)"
          >
            <q-item-label class="q-ma-none q-pa-none ellipsis">{{ client }}</q-item-label>
          </q-item-section>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFileStore } from 'src/stores/FileStore';
import { useClientStore } from 'src/stores/ClientStore';
import { useRoute } from 'vue-router';

const clientStore = useClientStore();
const fileStore = useFileStore();
const selectedClient = ref<string>('All Clients');
const route = useRoute();

onMounted(async () => {
  await clientStore.getClients(); //client names update within
  if (route.path === '/home') {
    await fileStore.filterByStatus(fileStore.statusAll);
  } else await fileStore.filterByStatus(fileStore.statusReviewNeeded);
});

function onItemClick(client: string) {
  selectedClient.value = client;
  clientStore.setSelectedClient(client);
  fileStore.filterByClientId(client).catch((error) => {
    console.error('Error filtering files: ', error);
  });
}
</script>
