<template>
  <div
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
      <p style="color: white">FILENAME: {{ filename }}.jpg</p>
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

const selectedClient = ref(null);
const clients = ref<Client[]>([]);
const clientNames = ref<string[]>([]);
const auth0 = useAuth0();
const $q = useQuasar();
const imageUrl = ref<string>('');
const bearerToken = ref<string>('');
const file = ref<File>();
let filename: string = '';

export interface Client {
  clientId: string;
  createdAt: string;
  imgUrl: string;
  integrationPartners: unknown[];
  name: string;
  orgId: string;
}

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
      filename = `${Date.now()}`;
      imageUrl.value = image.webPath; // For preview
      // Convert URI to File (if needed)
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      file.value = new File([blob], `${filename}.jpg`, { type: 'image/jpeg' });
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

const uploadPhoto = () => {
  const clientId = clients.value.find((client) => client.name === selectedClient.value)!.clientId;
  void uploadFile(filename, clientId, bearerToken.value, file.value!);
};
</script>
