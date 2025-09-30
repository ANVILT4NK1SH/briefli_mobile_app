<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <img
            src="../assets/images/briefli.svg"
            style="width: 150px; height: auto; padding-top: 0.5em"
          />
          <p style="font-size: 10px">Mobile Companion</p>
        </q-toolbar-title>
        <router-link to="/userPage" class="q-pa-md q-gutter-sm row justify-end items-center">
          <q-avatar size="xl" color="secondary" text-color="white" icon="account_circle" />
        </router-link>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { onMounted } from 'vue';

//
onMounted(async () => {
  const auth0 = useAuth0(); //from package
  // check if user is logged in
  if (!auth0?.user?.value) {
    await auth0.loginWithRedirect();
  }

  // use the information in about the user to display something
  //we can use this for displaying user information
  /* console.log('auth0 user logged in', {
  firstName: auth0.user.value.given_name,
  lastName: auth0.user.value.family_name
  }); */
});
</script>
