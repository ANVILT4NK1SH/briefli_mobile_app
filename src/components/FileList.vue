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
        <div class="row justify-center">
          <q-card
            v-for="file in fileStore.files"
            :key="file.fileName"
            class="q-pa-sm q-ma-xs justify-center"
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
                  :text-color="fileStore.getColorByType(file.documentTypes[0] ?? 'Unknown')"
                />
                <q-item-label>
                  {{ fileStore.docTypeAbbreviation(file.documentTypes[0]!) }}
                </q-item-label>
              </q-item-section>

              <!-- Center section with file name and client name -->
              <q-item-section>
                <q-item-label class="ellipsis">{{ file.displayName }}</q-item-label>
                <q-item-label caption>{{
                  clientStore.getClientNameById(file.clientId)
                }}</q-item-label>
              </q-item-section>

              <!-- Right section with file status badge -->
              <q-item-section side top class="q-mr-md">
                <q-item-label
                  caption
                  :class="{
                    'bg-positive': fileStore.getFileCategoryStatus(file.status) === 'completed',
                    'bg-negative': fileStore.getFileCategoryStatus(file.status) === 'failed',
                    'bg-warning': fileStore.getFileCategoryStatus(file.status) === 'processing',
                    'bg-info': fileStore.getFileCategoryStatus(file.status) === 'loading',
                  }"
                  style="border-radius: 1rem; padding: 0.5rem; color: white"
                >
                  {{ fileStore.getFileCategoryStatus(file.status) }}
                </q-item-label>
              </q-item-section>
            </div>
            <!-- Timestamp outside 'row' div (below all in UI)-->
            <q-item-section side left class="q-pt-sm q-pl-md">
              <q-item-label caption>{{ fileStore.timeElapsed(file.createdAt) }} </q-item-label>
            </q-item-section>
          </q-card>
        </div>
      </div>
    </q-pull-to-refresh>
    <StatusToolbar />
  </q-page-container>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { login } from 'src/services/authService';
import { onMounted, ref, watch } from 'vue';
import PdfViewer from './PdfViewer.vue';
import { onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QNotifyOptions } from 'quasar';
import StatusToolbar from './StatusToolbar.vue';
import { useFileStore } from 'src/stores/FileStore';
import { useClientStore } from 'src/stores/ClientStore';

const clientStore = useClientStore();

const auth0 = useAuth0();
const pdfUrl = ref<string>('');
const showPdfModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const currentFileName = ref<string>('');
const $q = useQuasar();
const fileStore = useFileStore();

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
    await fileStore.getFilesFromApi();
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
  console.log('getPageData Fires');
  try {
    await clientStore.getClients();
    console.log('Files fetched:', fileStore.files);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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

    await fileStore.getDocumentByFileName(filename, rotations); //make call using params
    pdfUrl.value = fileStore.pdfUrl; //set new value from store
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

// Calculate time elapsed since upload
/* const timeElapsed = (timeCreated: string): string => {
  const elapsedTime = (new Date().getTime() - new Date(timeCreated).getTime()) / (1000 * 60);

  const result =
    elapsedTime < 60
      ? `uploaded ${elapsedTime.toFixed()} minutes ago`
      : elapsedTime / 60 < 24
        ? elapsedTime / 60 < 2 && elapsedTime / 60 > 0
          ? `uploaded ${(elapsedTime / 60).toFixed()} hour ago`
          : `uploaded ${(elapsedTime / 60).toFixed()} hours ago`
        : elapsedTime / (60 * 24) < 2 && elapsedTime / (60 * 24) > 0
          ? `uploaded ${(elapsedTime / (60 * 24)).toFixed()} day ago`
          : `uploaded ${(elapsedTime / (60 * 24)).toFixed()} days ago`;

  return result;
}; */

// Clean up resources when component is unmounted
onUnmounted(() => {
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>
