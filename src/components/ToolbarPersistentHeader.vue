<template>
  <q-toolbar>
    <q-toolbar-title>
      <img src="img\logos\briefli.svg" style="width: 150px; height: auto; padding-top: 0.5em" />
      <p class="text-secondary" style="font-size: 0.75rem">Mobile Companion</p>
    </q-toolbar-title>
    <router-link to="/userPage" class="q-pa-md q-gutter-sm row justify-end items-center">
      <q-avatar size="xl" color="secondary" text-color="white" icon="account_circle" />
    </router-link>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { login } from 'src/services/authService';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(async () => {
  const auth0 = useAuth0(); //from package

  // check if user is logged in
  if (!auth0?.user?.value) {
    await login();
  } else {
    await useRouter().push('/home');
  }
});
</script>
