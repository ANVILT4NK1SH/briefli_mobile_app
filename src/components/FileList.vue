<template>
  <div>FileList</div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { onMounted } from 'vue';

//fetch bearer token for API calls
const auth0 = useAuth0();
let bearerToken: string | null = null;

onMounted(async () => {
  bearerToken = await auth0.getAccessTokenSilently();
  console.log(bearerToken);
});
</script>
