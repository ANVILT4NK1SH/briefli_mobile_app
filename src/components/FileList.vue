<template>
  <div>FileList</div>

  <!-- potentially use quasar component for displaying the file information -->
  <div v-for="file in files" :key="file.fileName">
    <p>{{ file.fileName }}</p>
    <p>{{ file.status }}</p>
    <p>{{ file.orgId }}</p>
    <p>{{ file.documentTypes }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

interface Props {
  fileName: string;
  displayName: string;
  status: string;
  createdAt: string;
  processedAt: string;
  orgId: string;
  fileSize: string;
  documentTypes: string[];
}

const files = ref<Props[]>([]);

onMounted(async () => {
  //fetch bearer token for API calls
  const auth0 = useAuth0();

  const bearerToken = await auth0.getAccessTokenSilently();

  axios
    .get('https://demo-api.project-onyx-test.com/file', {
      headers: { Authorization: `Bearer ${bearerToken}` },
    })
    .then((response) => {
      console.log(response.data);
      files.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});
</script>
