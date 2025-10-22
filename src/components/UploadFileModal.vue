<template>
  <div
    v-if="isUploading"
    class="q-pa-xl text-accent flex flex-center column z-top bg-primary text-h3 text-center"
  >
    Please wait for file to upload!
    <q-img src="img\logos\briefli-reveal-light.gif" />
  </div>
  <div v-else-if="isUploaded" class="q-pa-md column flex flex-center column">
    <q-btn
      label="Select another File"
      color="secondary"
      @click="selectAnotherFile"
      style="padding: 1rem; margin: 1rem"
    />
  </div>
  <q-card v-else class="q-pa-md column flex flex-center column custom-rounded">
    <q-select
      v-model="clientStore.selectedClient"
      :options="clientStore.getAllClientNames"
      label="Select Client"
      clearable
      use-input
    />
    <q-file
      class="q-pa-md q-ma-md bg-white text-subtitle1 text-primary"
      v-model="selectedFile"
      label="Select a file"
      filled
      bottom-slots
      clearable
      accept=".pdf,image/*"
      @update:model-value="onFileSelected"
    />
    <div v-if="showPdfModal" class="container q-pa-lg">
      <PdfViewer
        :pdf-url="pdfUrl"
        :file-name="currentFileName"
        :is-loading="isLoading"
        :show-close-button="true"
        @close="closePreview"
      />
    </div>
    <div v-else-if="isImage && previewUrl">
      <img :src="previewUrl" alt="Captured Image" style="max-width: 300px" />
    </div>
    <q-btn
      v-if="selectedFile"
      class="q-pa-lg q-ma-md"
      label="Upload"
      color="secondary"
      @click="uploadSelectedFile"
    />
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { QFile, useQuasar } from 'quasar';
import { apiService } from 'src/services/apiService';
import type { QNotifyOptions } from 'quasar';
import PdfViewer from './PdfViewer.vue';
import { useClientStore } from 'src/stores/ClientStore';
import { useFileStore } from 'src/stores/FileStore';

const clientStore = useClientStore();
const fileStore = useFileStore();

const selectedFile = ref<File | null>(null); //keep; used for upload, not state

const $q = useQuasar();
const file = ref<File | null>(null);
const filename = ref('');
const isUploaded = ref(false);
const isUploading = ref(false);
const pdfUrl = ref<string>('');
const previewUrl = ref<string>('');
const isLoading = ref<boolean>(false);
const currentFileName = ref<string>('');
const showPdfModal = ref<boolean>(false);
const isImage = ref<boolean>(false);

onMounted(async () => {
  await clientStore.getClients();
});

// Watch for changes to selectedFile to clean up previous URLs
watch(selectedFile, (newFile, oldFile) => {
  // Clean up previous URL to prevent memory leaks
  if (oldFile && previewUrl.value) {
    window.URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  if (oldFile && pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
});

const onFileSelected = () => {
  file.value = selectedFile.value;
  if (file.value) {
    filename.value = file.value.name;
    isImage.value = file.value.type.startsWith('image/');

    if (isImage.value) {
      // Create a URL for image preview
      previewUrl.value = window.URL.createObjectURL(file.value);
    } else if (file.value.type === 'application/pdf') {
      // Create a URL for PDF preview
      const blob = new Blob([file.value], { type: file.value.type });
      pdfUrl.value = window.URL.createObjectURL(blob);
      showPdfModal.value = true;
    }
    console.log('File selected:', filename.value, 'Type:', file.value.type);
  } else {
    // Reset when no file is selected
    isImage.value = false;
    showPdfModal.value = false;
    previewUrl.value = '';
    pdfUrl.value = '';
    filename.value = '';
  }
};

const uploadSelectedFile = async () => {
  // ensure file attached
  if (!file.value) {
    $q.notify({
      message: 'No file selected',
      color: 'negative',
    } as QNotifyOptions);
    return;
  }

  isUploading.value = true;
  try {
    const clientId = clientStore.selectedClient
      ? clientStore.getClientIdByName(clientStore.selectedClient)
      : '';

    const responseStatus = await apiService.uploadFile(filename.value, clientId, file.value);

    if (responseStatus === 200) {
      $q.notify({
        message: 'File successfully uploaded',
        color: 'positive',
      } as QNotifyOptions);

      await fileStore.getFilesFromApi(); //refresh files on upload success

      isUploaded.value = true;
      isUploading.value = false;
    } else {
      $q.notify({
        message: 'Failed file upload',
        color: 'negative',
      } as QNotifyOptions);
      console.error('Response status:', responseStatus);
      isUploading.value = false;
    }
  } catch (err: unknown) {
    $q.notify({
      message: 'Failed to upload file',
      color: 'negative',
    } as QNotifyOptions);
    console.error('Upload error:', err);
    isUploading.value = false;
  }
};

const closePreview = () => {
  showPdfModal.value = false;
  currentFileName.value = '';

  // Clean up PDF URL when preview is closed
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
};

const selectAnotherFile = () => {
  clientStore.clearSelectedClient();
  file.value = null;
  selectedFile.value = null;
  filename.value = '';
  isUploaded.value = false;
  isImage.value = false;
  previewUrl.value = '';
  showPdfModal.value = false;
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
};
</script>
