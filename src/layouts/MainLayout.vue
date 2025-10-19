<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <ToolbarPersistentHeader />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ToolbarPersistentHeader from 'src/components/ToolbarPersistentHeader.vue';
</script>
