<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-tabs align="center">
          <q-btn to="/home" label="Home" />
          <q-btn to="/clients" label="Clients" />
          <q-btn label="Upload" @click="displayModal = true" icon="upload"/>
          <q-btn to="/review" label="Review" />
          <q-btn to="/briefliAI" label="Briefli AI" />
        </q-tabs>

        <q-dialog v-model="displayModal" persistent>
          <UploadOptionModal @close="displayModal = false" />
        </q-dialog>
      </q-toolbar>

    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import UploadOptionModal from './components/UploadOptionModal.vue';
import { ref } from 'vue';

const displayModal= ref(false)
</script>
