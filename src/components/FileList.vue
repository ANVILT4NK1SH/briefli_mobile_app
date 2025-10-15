<template>
  <!-- Loading overlay displayed when a document is being fetched -->
  <div
    v-if="isLoading"
    class="q-pa-xl text-secondary flex flex-center column z-top bg-primary text-h3 text-center"
    style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; margin: 0"
  >
    Please wait for file to open!
    <q-img src="img\logos\briefli-reveal-light.gif" />
  </div>
  <!-- PDF Modal for displaying document previews -->
  <q-dialog v-model="showPdfModal" full-width maximized>
    <PdfViewer
      :pdf-url="pdfUrl"
      :file-name="currentFileName"
      :is-loading="isLoading"
      :show-close-button="true"
      @close="closePreview"
    />
  </q-dialog>

  <!-- Main page container with custom background and top padding -->
  <q-page-container class="bg-custombg" style="padding-top: 3.5rem">
    <!-- Pull-to-refresh component for updating file list -->
    <q-pull-to-refresh @refresh="refresh" color="secondary">
      <div class="q-pa-xs">
        <!-- Grid layout for displaying file cards -->
        <div class="row q-col-gutter-sm justify-center">
          <q-card
            v-for="file in filteredFiles"
            :key="file.fileName"
            class="q-pa-xs q-ma-sm justify-center"
            style="width: 21rem"
            elevated
          >
            <!-- Clickable area to open document preview -->
            <div
              class="flex row items-center justify-center"
              style="width: 100%"
              @click="showDocument(file.fileName, file.rotations)"
            >
              <!-- Left section with file icon and document type -->
              <q-item-section style="max-width: 60px" class="items-center">
                <q-avatar
                  icon="description"
                  :text-color="getColorByType(file.documentTypes[0] ?? 'Unknown')"
                />
                <q-item-label>
                  {{ docTypeAbbreviation(file.documentTypes[0]!) }}
                </q-item-label>
              </q-item-section>

              <!-- Center section with file name and client name -->
              <q-item-section>
                <q-item-label>{{ file.displayName }}</q-item-label>
                <q-item-label caption>{{ getClientName(file.clientId) }}</q-item-label>
              </q-item-section>

              <!-- Right section with file status badge -->
              <q-item-section side top class="q-mr-xs">
                <q-item-label
                  caption
                  :class="{
                    'bg-positive': getFileCategoryStatus(file.status) === 'completed',
                    'bg-negative': getFileCategoryStatus(file.status) === 'failed',
                    'bg-warning': getFileCategoryStatus(file.status) === 'processing',
                    'bg-info': getFileCategoryStatus(file.status) === 'loading',
                  }"
                  style="border-radius: 1rem; padding: 0.5rem; color: white"
                >
                  {{ getFileCategoryStatus(file.status) }}
                </q-item-label>
              </q-item-section>
            </div>
            <!-- Section below with upload time (outside of row div)-->
            <q-item-section class="items-center">
              <q-item-label caption>{{ timeElapsed(file.createdAt) }} </q-item-label>
            </q-item-section>
          </q-card>
        </div>
      </div>
    </q-pull-to-refresh>

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
          :class="filterByStatus === statusAll ? 'selected q-ma-xs' : 'q-ma-xs bg-white'"
          padding="xs lg"
          @click="((filterByStatus = statusAll), (clientUnassigned = false))"
        >
          <p style="font-size: smaller; margin: 0">All</p>
        </q-btn>
      </q-toolbar>
    </q-page-sticky>
  </q-page-container>
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
  clientUnassigned,
  statusReviewNeeded,
  getFileCategoryStatus,
} from 'src/services/fileService';
import { apiService } from 'src/services/apiService';
import type { Client } from './models';
import { getClients } from 'src/services/clientService';
import PdfViewer from './PdfViewer.vue';
import { onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QNotifyOptions } from 'quasar';

const auth0 = useAuth0();
const clients = ref<Client[]>([]);
const pdfUrl = ref<string>('');
const showPdfModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const currentFileName = ref<string>('');
const $q = useQuasar();

// Lifecycle hook to initialize component
onMounted(async () => {
  // Wait for Auth0 to finish loading
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

  // Redirect to login if not authenticated
  if (!auth0.isAuthenticated.value) {
    await login();
    return;
  }

  // Fetch initial page data
  try {
    await getPageData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Handle pull-to-refresh functionality
const refresh = async (done: (cancel?: boolean) => void) => {
  try {
    await getPageData();
    $q.notify({
      message: 'Data refreshed successfully',
      color: 'positive',
      position: 'top',
    });
    done(); // Signal successful refresh
  } catch (error) {
    $q.notify({
      message: 'Failed to refresh data',
      color: 'negative',
      position: 'top',
    });
    done(); // Signal completion even on error
    console.log('Error refreshing:', error);
  }
};

// Fetch files and clients data from API
const getPageData = async () => {
  try {
    const response = await apiService.getFiles();
    files.value = response.data;
    clients.value = await getClients();
    console.log('Files fetched:', files);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Retrieve client name based on client ID
const getClientName = (clientId: string) => {
  const client = clients.value.find((client) => client.clientId === clientId);
  return client ? client.name : '';
};

// Load and display a document in the PDF viewer
const showDocument = async (filename: string, rotations: number[]) => {
  isLoading.value = true;
  currentFileName.value = filename;

  try {
    // Clean up previous URL if exists
    if (pdfUrl.value) {
      window.URL.revokeObjectURL(pdfUrl.value);
    }

    pdfUrl.value = await apiService.getDocument(filename, rotations);
    console.log('PDF loaded:', filename);
    isLoading.value = false;
    showPdfModal.value = true;
  } catch (error) {
    isLoading.value = false;
    $q.notify({
      message: 'Error loading document',
      color: 'negative',
    } as QNotifyOptions);
    console.error('Error loading document:', error);
  }
};

// Close the PDF preview modal and clean up
const closePreview = () => {
  showPdfModal.value = false;
  currentFileName.value = '';

  // Clean up URL when preview is closed
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
};

// Update the icon color using file type
const getColorByType = (fileType: string): string => {
  switch (fileType) {
    case 'Packing List':
      return 'blue';
    case 'Bill of Lading':
      return 'green';
    case 'Commercial Invoice':
      return 'red';
    case 'Uknown':
      return 'grey';
    default:
      return 'grey';
  }
};

// Calculate time elapsed since upload
const timeElapsed = (timeCreated: string): string => {
  const dateCreated = new Date(timeCreated); //parse string into date object
  const currentTime = Date.now();

  const elapsedTime = currentTime - dateCreated.getTime();

  const hours = elapsedTime / 3600000; // convert milliseconds to hours (3.6e+6ms in 1 hour)

  // send hour v hours conditionally. Using toFixed to avoid floating points
  if (hours.toFixed() === '1') {
    return `Uploaded ${hours.toFixed()} hour ago`;
  } else {
    return `Uploaded ${hours.toFixed()} hours ago`;
  }
};

// Abbreviate file.documentType for display
const docTypeAbbreviation = (docType: string): string => {
  switch (docType) {
    case 'Packing List':
      return 'PL';
    case 'Bill of Lading':
      return 'BOL';
    case 'Commercial Invoice':
      return 'INV';
    case 'Uknown':
      return 'UNK';
    default:
      return 'UNK';
  }
};

// Clean up resources when component is unmounted
onUnmounted(() => {
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>
