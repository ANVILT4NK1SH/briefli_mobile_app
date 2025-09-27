<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <!-- what other types in 'accept'? -->
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

    const onRejected = (rejectedEntries: QRejectedEntry[]): void => {
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }

    return {
      onRejected
    }
  }
})
</script>
