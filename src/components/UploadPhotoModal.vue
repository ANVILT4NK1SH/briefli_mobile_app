<template>
  <div
    v-if="isUploading"
    class="q-pa-md text-primary flex flex-center column absolute-full z-top bg-accent text-h3"
  >
    Please wait for picture to upload!
    <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md z-top" />
  </div>
  <div v-else-if="isUploaded" class="q-pa-md bg-tranparentBlack flex flex-center column">
    <q-btn
      label="Take another Photo"
      color="primary"
      @click="takeNewPhoto"
      style="padding: 1rem; margin: 1rem"
    />
  </div>
  <div
    v-else
    class="q-pa-md"
    style="display: flex; flex-direction: column; align-items: center; justify-content: center"
  >
    <q-select
      v-model="selectedClient"
      :options="clientNames"
      label="Select Client"
      clearable
      use-input
      style="padding: 0.5rem; margin: 1rem; background-color: white; border-radius: 3px"
    />
    <q-btn
      label="Capture Photo"
      color="primary"
      @click="capturePhoto"
      style="padding: 1rem; margin: 1rem"
    />

    <div
      v-if="imageUrl"
      class="q-mt-md"
      style="display: flex; flex-direction: column; align-items: center; justify-content: center"
    >
      <img :src="imageUrl" alt="Captured Image" style="max-width: 300px" />
      <p style="color: white">FILENAME: {{ filename }}</p>
      <q-btn label="Upload" color="primary" @click="uploadPhoto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar, type QNotifyOptions } from 'quasar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-vue';
import { uploadFile } from 'src/services/apiService';
import type { Client } from './models';

const selectedClient = ref(null);
const clients = ref<Client[]>([]);
const clientNames = ref<string[]>([]);
const auth0 = useAuth0();
const $q = useQuasar();
const imageUrl = ref<string>('');
const bearerToken = ref<string>('');
const file = ref<File | null>(null);
const filename = ref('');
const isUploaded = ref(false);
const isUploading = ref(false);

onMounted(async () => {
  bearerToken.value = await auth0.getAccessTokenSilently();
  console.log(bearerToken.value);

  const response = await axios.get(`${process.env.API_URL}/org/clients`, {
    headers: { Authorization: `Bearer ${bearerToken.value}` },
  });
  console.log(response.data.clients);
  clients.value = response.data.clients;
  clientNames.value = clients.value.map((client) => client.name);
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
      //Error if filename ends in .jpg
      filename.value = `${Date.now()}.png`;
      imageUrl.value = image.webPath; // For preview
      // Convert URI to File (if needed)
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      file.value = new File([blob], `${filename.value}`, { type: 'image/png' });
      console.log('Captured image as File:', file);

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
  isUploading.value = true;
  try {
    const clientId = ref('');
    if (selectedClient.value) {
      clientId.value = clients.value.find(
        (client) => client.name === selectedClient.value,
      )!.clientId;
    }

    const responseStatus = ref(
      await uploadFile(filename.value, clientId.value, bearerToken.value, file.value!),
    );
    if (responseStatus.value === 200) {
      $q.notify({
        message: 'Photo uploaded',
        color: 'positive',
      } as QNotifyOptions);
      isUploaded.value = true;
      isUploading.value = false;
    } else {
      $q.notify({
        message: 'Failed photo upload',
        color: 'negative',
      } as QNotifyOptions);
      console.error('Response status:', responseStatus.value);
      isUploading.value = false;
    }
  } catch (err: unknown) {
    $q.notify({
      message: 'Failed to upload photo',
      color: 'negative',
    } as QNotifyOptions);
    console.error('Upload error:', err);
    isUploading.value = false;
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
