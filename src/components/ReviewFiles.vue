<template>
  <FileList />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import FileList from './FileList.vue';
import { useFileStore } from 'src/stores/FileStore';

const fileStore = useFileStore();

onMounted(async () => {
  //feel like we could set the values in the service or something
  await fileStore.filterByStatus(fileStore.statusReviewNeeded);
}); //when mounted, invoke fileService and pass filter values
</script>
