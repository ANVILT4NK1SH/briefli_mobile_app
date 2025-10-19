<template>
  <q-layout view="lHh Lpr lFf" class="bg-custombg">
    <q-header elevated class="bg-primary text-accent" height-hint="98"> </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="q-pa-xs text-accent bg-primary" style="margin-bottom: 0">
      <ToolbarNavFooter />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import ToolbarNavFooter from './components/ToolbarNavFooter.vue';
</script>
