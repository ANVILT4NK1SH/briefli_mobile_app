<template>
  <q-toolbar class="q-pa-none row justify-center">
    <q-btn
      style="width: 75px"
      :class="btnSelected === 'home' ? 'q-pa-xs selected' : 'q-pa-xs'"
      flat
      stack
      to="/home"
      label="Home"
      icon="home"
      @click="((btnSelected = 'home'), fileStore.statusAll)"
    />

    <q-btn
      :class="btnSelected === 'clients' ? 'q-pa-xs selected' : 'q-pa-xs'"
      style="margin-right: 2.37rem; width: 75px"
      flat
      stack
      to="/clients"
      label="Clients"
      icon="group"
      @click="btnSelected = 'clients'"
    />

    <q-btn
      size="xl"
      stack
      style="
        position: absolute;
        height: 4rem;
        background-color: white;
        z-index: 100;
        bottom: 1px;
        left: 50%;
        transform: translate(-50%);
        border-radius: 0.75rem;
        box-shadow:
          2px 0px 3px 2px #00000030,
          -2px 0px 3px 2px #00000030;
      "
      @click="displayModal = true"
      ><q-icon name="upload" size="2.5rem" />
    </q-btn>
    <q-btn
      style="margin-left: 3rem; width: 75px"
      :class="btnSelected === 'review' ? 'q-pa-xs selected' : 'q-pa-xs'"
      flat
      stack
      to="/review"
      label="Review"
      icon="description"
      @click="btnSelected = 'review'"
    />
    <q-btn
      style="width: 75px"
      :class="btnSelected === 'ai' ? 'q-pa-xs selected' : 'q-pa-xs'"
      flat
      stack
      to="/briefliAI"
      label="Briefli AI"
      icon="flare"
      @click="btnSelected = 'ai'"
    />
  </q-toolbar>

  <q-dialog v-model="displayModal">
    <UploadOptionModal @close="displayModal = false" @open="handleOpen" />
  </q-dialog>

  <q-dialog v-model="displayUploadPhotoModal">
    <UploadPhotoModal @close="displayUploadPhotoModal = false" />
  </q-dialog>

  <q-dialog v-model="displayUploadFileModal">
    <UploadFileModal @close="displayUploadFileModal = false" />
  </q-dialog>
</template>

<script setup lang="ts">
import UploadFileModal from './UploadFileModal.vue';
import UploadOptionModal from './UploadOptionModal.vue';
import UploadPhotoModal from './UploadPhotoModal.vue';
import { ref } from 'vue';
import { useFileStore } from 'src/stores/FileStore';

const fileStore = useFileStore();
const btnSelected = ref('home');
const displayModal = ref(false);
const displayUploadPhotoModal = ref(false);
const displayUploadFileModal = ref(false);

//receive values from UploadOption and open new modal
function handleOpen(type: 'photo' | 'file') {
  displayModal.value = false; // Close the UploadOptionModal

  // Open the corresponding upload modal
  if (type === 'photo') {
    displayUploadPhotoModal.value = true;
  } else if (type === 'file') {
    displayUploadFileModal.value = true;
  }
}
</script>
