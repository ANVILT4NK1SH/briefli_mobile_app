<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-tabs align="center">
          <q-route-tab to="/home" label="Home" />
          <q-route-tab to="/clients" label="Clients" />
          <q-route-tab to="/upload" label="Upload" />
          <q-route-tab to="/review" label="Review" />
          <q-route-tab to="/briefliAI" label="Briefli AI" />
        </q-tabs>
      </q-toolbar>

    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
//
</script>
