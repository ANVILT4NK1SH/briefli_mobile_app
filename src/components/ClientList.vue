<template>
  <div>Clients component</div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import { onMounted } from 'vue';

onMounted(async () => {
  //fetch bearer token for API calls
  const auth0 = useAuth0();

  const bearerToken = await auth0.getAccessTokenSilently();

  axios
    .get('https://demo-api.project-onyx-test.com/org/clients', {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});
</script>
