<template>
  <div
    v-if="isUploading"
    class="q-pa-xl text-secondary flex flex-center column z-top bg-primary text-h3 text-center"
  >
    Please wait for Photo to upload!
    <q-img src="img\logos\briefli-reveal-light.gif" />
  </div>
  <div v-else-if="isUploaded" class="q-pa-md bg-tranparentBlack flex flex-center column">
    <q-btn
      label="Take another Photo"
      color="secondary"
      @click="takeNewPhoto"
      style="padding: 1rem; margin: 1rem"
    />
  </div>
  <q-card v-else class="q-pa-md custom-rounded column justify center">
    <q-select
      v-model="selectedClient"
      :options="clientStore.getAllClientNames"
      label="Select Client"
      clearable
      use-input
      style="padding: 0.5rem; margin: 1rem; background-color: white; border-radius: 3px"
    />
    <q-btn
      label="Capture Photo"
      color="secondary"
      @click="capturePhoto"
      style="padding: 1rem; margin: 1rem"
    />

    <div
      v-if="imageUrl"
      class="q-mt-md"
      style="display: flex; flex-direction: column; align-items: center; justify-content: center"
    >
      <img :src="imageUrl" alt="Captured Image" style="max-width: 100%" />
      <p color="primary">FILENAME: {{ filename }}</p>
      <q-btn label="Upload" color="secondary" @click="uploadPhoto" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar, type QNotifyOptions } from 'quasar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { apiService } from 'src/services/apiService';
import { useClientStore } from 'src/stores/ClientStore';
import { useFileStore } from 'src/stores/FileStore';

const clientStore = useClientStore();
const fileStore = useFileStore();
const $q = useQuasar();

const selectedClient = ref<string | null>(null);
const imageUrl = ref<string>('');
const file = ref<File | null>(null);
const filename = ref('');
const isUploaded = ref(false);
const isUploading = ref(false);

onMounted(async () => {
  await clientStore.getClients();
});

const capturePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Returns a file URI
      source: CameraSource.Camera, // Forces camera (not gallery)
    });

    if (image.webPath) {
      filename.value = `${Date.now()}.${image.format}`;
      imageUrl.value = image.webPath; // For preview
      // Convert URI to File (if needed)
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      file.value = new File([blob], `${filename.value}`, { type: `${image.format}` });
      console.log('Captured image as File:', file);
      console.log('Image object', image);

      $q.notify({
        message: 'Photo captured successfully',
        color: 'positive',
      } as QNotifyOptions);
    }
  } catch (err: unknown) {
    $q.notify({
      message: 'Failed to capture photo',
      color: 'negative',
    } as QNotifyOptions);
    console.error('Camera error:', err);
  }
};

const uploadPhoto = async () => {
  // ensure upload has a file to send (to prevent error regarding file.value)
  if (!file.value) {
    $q.notify({
      message: 'No file to upload',
      color: 'negative',
    } as QNotifyOptions);
    return;
  }

  isUploading.value = true;
  try {
    const clientId = selectedClient.value
      ? clientStore.getClientIdByName(selectedClient.value)
      : '';

    const responseStatus = await apiService.uploadFile(filename.value, clientId, file.value);

    if (responseStatus === 200) {
      $q.notify({
        message: 'Photo uploaded successfully',
        color: 'positive',
      } as QNotifyOptions);

      await fileStore.getFilesFromApi(); //refresh file list

      isUploaded.value = true;
    } else {
      $q.notify({
        message: 'Failed to upload photo',
        color: 'negative',
      } as QNotifyOptions);
      console.error('Upload failed with status:', responseStatus);
    }
  } catch (err: unknown) {
    $q.notify({
      message: 'Failed to upload photo',
      color: 'negative',
    } as QNotifyOptions);
    console.error('Upload error:', err);
  } finally {
    isUploading.value = false; //use here eliminates need in other blocks of statement
  }
};

const takeNewPhoto = () => {
  selectedClient.value = null;
  imageUrl.value = '';
  file.value = null;
  filename.value = '';
  isUploaded.value = false;
};
</script>
