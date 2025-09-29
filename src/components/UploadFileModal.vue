<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
       <!-- accept property is required for q-upload -->
       <!-- need proper url/endpoint -->
       <!-- add accept='' property to restrict the type of file to upload -->
      <q-uploader
        label="Upload File"
        url="http://localhost:4444/upload"
        style="width: 300px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//
</script>
