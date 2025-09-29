<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <img src="../assets/images/briefli.svg" style="width: 150px; height: auto; padding-top: .5em;">
          <p style="font-size: 10px;"> Mobile Companion </p>
        </q-toolbar-title>
        <router-link to="/userPage" class="q-pa-md q-gutter-sm row justify-end items-center">
            <q-avatar
              size="xl"
              color="secondary"
              text-color="white"
              icon="account_circle"
            />
        </router-link>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//
</script>
