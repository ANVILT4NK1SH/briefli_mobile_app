<template>
  <div
    v-if="isUploading"
    class="q-pa-xl text-accent flex flex-center column z-top bg-primary text-h3 text-center"
  >
    Please wait for file to upload!
    <q-img src="img\logos\briefli-reveal-light.gif" />
    <!-- <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md z-top" /> -->
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
import { onMounted, ref } from 'vue';
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
const isLoading = ref<boolean>(false);
const currentFileName = ref<string>('');
const showPdfModal = ref<boolean>(false);

onMounted(async () => {
  clients.value = await getClients();
  clientNames.value = clients.value.map((client) => client.name);
});

const onFileSelected = () => {
  //check type of file
  showPdfModal.value = true;
  file.value = selectedFile.value;
  if (file.value) {
    filename.value = file.value.name;
    const blob = new Blob([file.value], { type: 'application/pdf' });
    pdfUrl.value = window.URL.createObjectURL(blob);
    console.log('File selected:', filename);
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

  // Clean up URL when preview is closed
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
};
</script>
