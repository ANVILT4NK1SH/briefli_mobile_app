<template>
  <div class="q-pa-md" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <q-select
      v-model="client"
      :options="options"
      label="Select Client"
      clearable
      use-input
      fill-input
      style="padding: 1rem; margin: 1rem;"
    />
    <q-btn
      label="Capture Photo"
      color="primary"
      @click="capturePhoto"
      style="padding: 1rem; margin: 1rem;"
    />

    <div v-if="imageUrl" class="q-mt-md" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <img :src="imageUrl" alt="Captured Image" style="max-width: 300px;" />
      <p>FILENAME: {{ filename }}.jpg</p>
      <q-btn label="Upload" color="primary" @click="uploadPhoto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar, type QNotifyOptions } from 'quasar'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-vue';

const client = ref(null);
const options = ref<object[]>()
const auth0 = useAuth0()
const $q = useQuasar()
const imageUrl = ref<string>('')
const inputFilename = ref<string>('')
let filename: string = ('')

onMounted(async () => {
  const bearerToken = await auth0.getAccessTokenSilently();
  const response: object[] = await axios.get(`https://demo-api.project-onyx-test.com/org/clients`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
  options.value = response
})



const capturePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Returns a file URI
      source: CameraSource.Camera // Forces camera (not gallery)
    })

    if (image.webPath) {
      if (inputFilename.value){
        filename = inputFilename.value
      } else {
        filename = `${Date.now()}`
      }
      imageUrl.value = image.webPath // For preview
      // Convert URI to File (if needed)
      const response = await fetch(image.webPath)
      const blob = await response.blob();

      const file = new File([blob], `${filename}.jpg`, { type: 'image/jpeg' })
      console.log('Captured image as File:', file)

      $q.notify({
        message: 'Photo captured successfully',
        color: 'positive'
      } as QNotifyOptions)
    }
  } catch (err: unknown) {
    $q.notify({
      message: 'Failed to capture photo',
      color: 'negative'
    } as QNotifyOptions)
    console.error('Camera error:', err)
  }
}

const uploadPhoto = () => {

}
</script>
