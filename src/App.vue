<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white" height-hint="98"> </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <q-toolbar>
        <q-btn stack to="/home" label="Home" icon="home" />
        <q-btn stack to="/clients" label="Clients" icon="group" />
        <q-btn stack label="Upload" @click="displayModal = true" icon="upload" />
        <q-btn stack to="/review" label="Review" icon="description" />
        <q-btn stack to="/briefliAI" label="Briefli AI" icon="flare" />
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
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import UploadOptionModal from './components/UploadOptionModal.vue';
import UploadPhotoModal from './components/UploadPhotoModal.vue';
import UploadFileModal from './components/UploadFileModal.vue';
import { ref } from 'vue';

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
