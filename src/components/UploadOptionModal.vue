<template>
  <div>
    <q-btn
      class="q-pa-lg q-ma-lg column"
      color="secondary"
      label="Take Photo"
      icon="camera"
      @click="$emit('open', 'photo')"
    />
    <q-btn
      class="q-pa-lg q-ma-lg column"
      color="secondary"
      label="Choose File"
      icon="upload"
      @click="$emit('open', 'file')"
    />
  </div>
</template>

<script setup lang="ts">
//
</script>
