<template>
  <FileList />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import FileList from './FileList.vue';
import { filterByStatus } from 'src/services/fileService';

onMounted(() => {
  filterByStatus.value = ['PROCESSED', 'INVALID', 'ERROR'];
}); //when mounted, invoke fileService and pass filter values
</script>
