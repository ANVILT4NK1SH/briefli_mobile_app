<template>
  <q-toolbar>
    <q-btn @click="filterByStatus = ['PROCESSED', 'INVALID', 'ERROR']"> Review Needed </q-btn>
    <q-btn @click="filterByStatus = ['INVALID']"> Unassigned </q-btn>
    <q-btn @click="filterByStatus = ['EXPORTED']"> Exported </q-btn>
    <q-btn @click="filterByStatus = ['ERROR']"> Failed </q-btn>
    <q-btn @click="filterByStatus = ['']"> All </q-btn>
  </q-toolbar>

  <q-item v-for="file in filteredFiles" :key="file.fileName">
    <q-item-section side left>
      <q-avatar icon="description" />
      <q-item-label>
        {{ file.documentTypes[0] }}
      </q-item-label>
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
          'bg-negative': file.status === 'ERROR',
          'bg-warning': file.status === 'PROCESSED',
          'bg-info': file.status === 'INVALID',
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
import axios, { AxiosError } from 'axios';
import { login } from 'src/services/authService';
import { onMounted, watch } from 'vue';
import { filteredFiles, filterByStatus, files } from 'src/services/fileService';

const auth0 = useAuth0();

onMounted(async () => {
  //fetch bearer token for API calls
  console.log('here', process.env.API_URL);

  if (auth0.isLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(auth0.isLoading, (loading) => {
        if (!loading) {
          stop(); // Stop the watcher
          resolve();
        }
      });
    });
  }

  if (!auth0.isAuthenticated.value) {
    await login();
    return;
  }

  try {
    const bearerToken = await auth0.getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://demo-api.project-onyx-test.com',
        scope: 'openid profile email offline_access',
      },
    });

    const response = await axios.get('https://demo-api.project-onyx-test.com/file', {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });

    files.value = response.data;
    console.log('Files fetched:', response.data);
  } catch (error) {
    // Type narrowing for error
    let errorMessage = 'Unknown error';
    let errorStatus: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    let errorData: unknown | undefined;

    if (error instanceof AxiosError) {
      // Handle Axios-specific errors
      errorMessage = error.response?.data?.message || error.message || 'Axios error';
      errorStatus = error.response?.status;
      errorData = error.response?.data;
    } else if (error instanceof Error) {
      // Handle general errors (e.g., from Auth0)
      errorMessage = error.message;
    }

    console.error('Error fetching data:', {
      message: errorMessage,
      status: errorStatus,
      data: errorData,
    });

    if (errorMessage.includes('Missing Refresh Token') || errorMessage.includes('Login required')) {
      await auth0.loginWithRedirect({
        authorizationParams: {
          audience: 'https://demo-api.project-onyx-test.com',
          scope: 'openid profile email offline_access',
        },
      });
    }
  }
  // const bearerToken = await auth0.getAccessTokenSilently();

  // axios
  //   .get('https://demo-api.project-onyx-test.com/file', {
  //     headers: { Authorization: `Bearer ${bearerToken}` },
  //   })
  //   .then((response) => {
  //     console.log(response.data);
  //     files.value = response.data;
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching data:', error);
  //   });
});
</script>
