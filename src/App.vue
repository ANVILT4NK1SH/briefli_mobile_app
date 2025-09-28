<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated>
      <q-toolbar>
        <q-tabs align="center">
          <q-btn to="/home" label="Home" />
          <q-btn to="/clients" label="Clients" />
          <q-btn label="Upload" @click="displayModal = true" icon="upload"/>
          <q-btn to="/review" label="Review" />
          <q-btn to="/briefliAI" label="Briefli AI" />
        </q-tabs>

        <q-dialog v-model="displayModal">
          <UploadOptionModal @close="displayModal = false" @open="handleOpen" />
        </q-dialog>

        <q-dialog v-model="displayUploadPhotoModal">
          <UploadPhotoModal @close="displayUploadPhotoModal = false" />
        </q-dialog>

        <q-dialog v-model="displayUploadFileModal">
          <UploadFileModal @close="displayUploadFileModal = false" />
        </q-dialog>
      </q-toolbar>

    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import UploadOptionModal from './components/UploadOptionModal.vue';
import UploadPhotoModal from './components/UploadPhotoModal.vue';
import UploadFileModal from './components/UploadFileModal.vue';
import { ref } from 'vue';

const displayModal= ref(false)
const displayUploadPhotoModal= ref(false)
const displayUploadFileModal= ref(false)

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
