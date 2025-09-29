<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <!-- accept property is required for q-upload -->
       <!-- need proper url/endpoint -->
      <q-uploader
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Restricted to images"
        multiple
        accept=".jpg, .jpeg, .png, .gif, image/*"
        @rejected="onRejected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar} from 'quasar'
import type { QRejectedEntry } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoUploader',
  setup() {
    const $q = useQuasar()

    //is q.notify being overridden by modal or q-upload error handling?
    const onRejected = (rejectedEntries: QRejectedEntry[]): void => {
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
        position: 'bottom',
        timeout: 5000,
        attrs: {
          style: 'z-index: 10000;' // should display over modal
          }
      })
    }

    return {
      onRejected
    }
  }
})
</script>
