<template>
  <!-- Sticky toolbar for filtering files by status -->
  <q-page-sticky expand position="top">
    <q-toolbar class="items-stretch bg-custombg justify-center z-top q-pa-none q-pt-xs">
      <!-- Filter buttons for different file statuses -->
      <q-btn
        :class="filterByStatus === statusReviewNeeded ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
        padding="xs lg"
        @click="((filterByStatus = statusReviewNeeded), (clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">Review Needed</p>
      </q-btn>
      <q-btn
        :class="
          clientUnassigned === true
            ? 'q-ma-xs justify-center items-center selected'
            : 'q-ma-xs bg-primary justify-center items-center'
        "
        @click="((clientUnassigned = true), (filterByStatus = ['']))"
      >
        <p style="font-size: smaller; margin: 0">Unassigned</p>
      </q-btn>
      <q-btn
        :class="filterByStatus === statusOk ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
        padding="xs lg"
        @click="((filterByStatus = statusOk), (clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">Exported</p>
      </q-btn>
      <q-btn
        :class="filterByStatus === statusError ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
        padding="xs lg"
        @click="((filterByStatus = statusError), (clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">Failed</p>
      </q-btn>
      <q-btn
        v-if="$route.path === '/home'"
        :class="filterByStatus === statusAll ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
        padding="xs lg"
        @click="((filterByStatus = statusAll), (clientUnassigned = false))"
      >
        <p style="font-size: smaller; margin: 0">All</p>
      </q-btn>
      <q-btn
        v-else-if="$route.path === '/review'"
        :class="filterByStatus === statusAll ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
        padding="xs lg"
        @click="toggleSelectClient = !toggleSelectClient"
      >
        <p style="font-size: smaller; margin: 0" icon="magnify">Filter By Client</p>
      </q-btn>
    </q-toolbar>
    <q-card v-if="toggleSelectClient" class="q-pa-md column flex flex-center column custom-rounded">
      <q-select
        v-model="selectedClient"
        :options="clientNames"
        label="Select Client"
        clearable
        use-input
      />
    </q-card>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { clientNames, getAllClientNames, selectedClient } from 'src/services/clientService';
import {
  filterByStatus,
  statusAll,
  statusError,
  statusOk,
  clientUnassigned,
  statusReviewNeeded,
} from 'src/services/fileService';
import { onMounted, ref } from 'vue';

const toggleSelectClient = ref(false);

onMounted(() => {
  getAllClientNames();
});
</script>
