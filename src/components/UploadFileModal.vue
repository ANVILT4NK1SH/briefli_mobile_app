<template>
  <div
    v-if="isUploading"
    class="q-pa-xl text-primary flex flex-center column z-top bg-accent text-h3 text-center"
  >
    Please wait for file to upload!
    <q-img src="img\logos\briefli-reveal-light.gif" />
    <!-- <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md z-top" /> -->
  </div>
  <div v-else-if="isUploaded" class="q-pa-md column flex flex-center column">
    <q-btn
      label="Select another File"
      color="primary"
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
    <q-btn
      v-if="selectedFile"
      class="q-pa-lg q-ma-md"
      label="Upload"
      color="primary"
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

const selectedFile = ref<File | null>(null);
const selectedClient = ref(null);
const clients = ref<Client[]>([]);
const clientNames = ref<string[]>([]);
const $q = useQuasar();
const file = ref<File | null>(null);
const filename = ref('');
const isUploaded = ref(false);
const isUploading = ref(false);

onMounted(async () => {
  clients.value = await getClients();
  clientNames.value = clients.value.map((client) => client.name);
});

const onFileSelected = () => {
  file.value = selectedFile.value;
  if (file.value) {
    filename.value = file.value.name;
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
};
const selectAnotherFile = () => {
  selectedClient.value = null;
  file.value = null;
  filename.value = '';
  isUploaded.value = false;
};
</script>
