<template>
  <div class="q-pa-md">
    <q-btn label="Capture Photo" color="primary" @click="capturePhoto" />
    <div v-if="imageUrl" class="q-mt-md">
      <img :src="imageUrl" alt="Captured Image" style="max-width: 300px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar, type QNotifyOptions } from 'quasar'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const $q = useQuasar()
const imageUrl = ref<string>('')

const capturePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Returns a file URI
      source: CameraSource.Camera // Forces camera (not gallery)
    })

    if (image.webPath) {
      imageUrl.value = image.webPath // For preview
      // Convert URI to File (if needed)
      const response = await fetch(image.webPath)
      const blob = await response.blob()
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
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
</script>
