<template>
  <FileList />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import FileList from './FileList.vue';
import { filterByStatus } from 'src/services/fileService';

onMounted(() => {
  //feel like we could set the values in the service or something
  filterByStatus.value = ['PROCESSED', 'INVALID', 'ERROR'];
}); //when mounted, invoke fileService and pass filter values
</script>
