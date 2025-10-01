<template>
  <q-item v-for="file in files" :key="file.fileName">
    <q-item-section side left>
      <q-item-label>{{ file.documentTypes[0] }}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ file.displayName }}</q-item-label>
      <q-item-label caption>{{ file.orgId }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <!-- UNSURE OF ALL POSSIBLE STATUS CODES; failed, review etc? -->
      <q-item-label
        caption
        :class="{
          'bg-positive': file.status === 'EXPORTED',
          'text-negative': file.status === 'FAILED',
          'bg-warning': file.status === 'PROCESSED',
        }"
      >
        {{ file.status }}
      </q-item-label>
    </q-item-section>
    <q-separator spaced inset />
  </q-item>
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
