<template>
  <q-toolbar class="q-pa-xs justify-center" style="padding: 0; margin-bottom: 0">
    <q-btn
      :class="btnSelected === 'home' ? 'q-pa-xs selected' : 'q-pa-xs'"
      flat
      stack
      to="/home"
      label="Home"
      icon="home"
      style="background-color:"
      @click="((btnSelected = 'home'), (filterByStatus = statusAll))"
    />

    <q-btn
      :class="btnSelected === 'clients' ? 'q-pa-xs selected' : 'q-pa-xs'"
      style="margin-right: 3rem"
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
        border-radius: 0.75rem;
        box-shadow:
          2px 0px 3px 2px #00000030,
          -2px 0px 3px 2px #00000030;
      "
      @click="displayModal = true"
      ><q-icon name="upload" size="2.5rem" />
    </q-btn>
    <q-btn
      :class="btnSelected === 'review' ? 'q-pa-xs selected' : 'q-pa-xs'"
      style="margin-left: 3rem"
      flat
      stack
      to="/review"
      label="Review"
      icon="description"
      @click="btnSelected = 'review'"
    />
    <q-btn
      :class="btnSelected === 'ai' ? 'q-pa-xs selected' : 'q-pa-xs'"
      flat
      stack
      to="/briefliAI"
      label="Briefli AI"
      icon="flare"
      @click="btnSelected = 'ai'"
    />
  </q-toolbar>
</template>

<script setup lang="ts">
import { filterByStatus, statusAll } from 'src/services/fileService';
import { ref } from 'vue';

const btnSelected = ref('home');
const displayModal = ref(false);
</script>
