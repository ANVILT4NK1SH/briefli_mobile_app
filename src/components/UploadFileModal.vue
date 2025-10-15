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
  <div v-else class="q-pa-md column flex flex-center column">
    <q-select
      v-model="selectedClient"
      :options="clientNames"
      label="Select Client"
      clearable
      use-input
      style="padding: 0.5rem; background-color: white; border-radius: 3px"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { QFile, useQuasar } from 'quasar';
import { apiService } from 'src/services/apiService';
import { getClients } from 'src/services/clientService';
import type { Client } from './models';
import type { QNotifyOptions } from 'quasar';
import PdfViewer from './PdfViewer.vue';

const selectedFile = ref<File | null>(null);
const selectedClient = ref(null);
const clients = ref<Client[]>([]);
const clientNames = ref<string[]>([]);
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
  clients.value = await getClients();
  clientNames.value = clients.value.map((client) => client.name);
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
  isUploading.value = true;
  try {
    const clientId = ref('');
    if (selectedClient.value) {
      clientId.value = clients.value.find(
        (client) => client.name === selectedClient.value,
      )!.clientId;
    }

    const responseStatus = ref(
      await apiService.uploadFile(filename.value, clientId.value, file.value!),
    );
    if (responseStatus.value === 200) {
      $q.notify({
        message: 'File successfully uploaded',
        color: 'positive',
      } as QNotifyOptions);
      isUploaded.value = true;
      isUploading.value = false;
    } else {
      $q.notify({
        message: 'Failed file upload',
        color: 'negative',
      } as QNotifyOptions);
      console.error('Response status:', responseStatus.value);
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
  console.log(await apiService.getFiles());
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
  selectedClient.value = null;
  file.value = null;
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
