<template>
  <div class="q-pa-md">
    <q-btn-group spread>
      <q-btn color="primary" label="Photo" icon="photo" @click="$emit('open', 'photo')"/>
      <q-btn color="primary" label="File" icon="upload" @click="$emit('open', 'file')"/>
    </q-btn-group>
  </div>
</template>

<script setup lang="ts">
//
</script>
