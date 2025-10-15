<template>
  <q-btn class="q-ma-sm" color="primary" text-color="accent" @click="logout">Logout</q-btn>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

//
const auth0 = useAuth0();
//
const logout = () => auth0.logout();
</script>
