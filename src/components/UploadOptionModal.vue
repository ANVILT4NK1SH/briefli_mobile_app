<template>
  <div>
    <q-btn
      class="q-pa-lg q-ma-lg column"
      style="position: absolute; bottom: 4rem; left: 50vw; padding: 1rem"
      color="secondary"
      label="Take Photo"
      icon="camera"
      @click="$emit('open', 'photo')"
    />
    <q-btn
      class="q-pa-lg q-ma-lg column"
      style="position: absolute; bottom: 4rem; right: 50vw; padding: 1rem"
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
