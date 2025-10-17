<template>
  <div class="pdf-viewer full-width">
    <!-- Viewer Header with Controls -->
    <div class="viewer-header" v-if="showHeader">
      <div class="header-left flex row no-wrap full-width">
        <q-btn
          v-if="showCloseButton"
          icon="close"
          flat
          dense
          @click="$emit('close')"
          class="close-btn"
        />
        <p class="file-name" v-if="fileName">
          {{ fileName }}
        </p>
      </div>

      <!-- <div class="header-actions">
        <q-btn
          icon="download"
          label="Download"
          @click="downloadPdf"
          :disabled="!pdfUrl"
          class="download-btn"
        />
      </div> -->
    </div>

    <!-- PDF Content -->
    <div class="pdf-content" :class="{ 'with-header': showHeader }">
      <iframe
        scrolling="no"
        v-if="pdfUrl"
        :src="pdfUrl"
        width="100%"
        height="100%"
        :title="fileName || 'PDF Document'"
        class="pdf-iframe"
        ref="pdfIframe"
      ></iframe>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="loading-container">
        <q-spinner size="50px" color="primary" />
        <p>Loading PDF...</p>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <q-icon name="picture_as_pdf" size="64px" color="grey-5" />
        <p>No PDF to display</p>
        <p class="caption">Select a file to preview</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Props
interface Props {
  pdfUrl?: string;
  fileName?: string;
  isLoading?: boolean;
  showHeader?: boolean;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  autoDownload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pdfUrl: '',
  fileName: '',
  isLoading: false,
  showHeader: true,
  showCloseButton: true,
  showFullscreenButton: true,
  autoDownload: false,
});

// Emits
const emit = defineEmits<{
  close: [];
  download: [url: string];
  loaded: [fileName: string];
}>();

// Refs
const pdfIframe = ref<HTMLIFrameElement>();

// Watch for URL changes to handle auto-download
watch(
  () => props.pdfUrl,
  (newUrl) => {
    if (newUrl && props.autoDownload) {
      downloadPdf();
    }

    if (newUrl) {
      emit('loaded', props.fileName || '');
    }
  },
);

// Methods
const downloadPdf = () => {
  if (!props.pdfUrl) return;

  const link = document.createElement('a');
  link.href = props.pdfUrl;
  link.download = props.fileName || 'document.pdf';
  link.click();

  emit('download', props.pdfUrl);
};

// const toggleFullscreen = async () => {
//   if (!pdfIframe.value) return;

//   try {
//     if (!document.fullscreenElement) {
//       // Enter fullscreen
//       await pdfIframe.value.requestFullscreen();
//     } else {
//       // Exit fullscreen
//       await document.exitFullscreen();
//     }
//   } catch (error) {
//     console.warn('Fullscreen operation failed:', error);
//     // You can optionally show a user-friendly message here
//   }
// };

// Clean up when component unmounts
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (props.pdfUrl) {
    window.URL.revokeObjectURL(props.pdfUrl);
  }
});
</script>

<style scoped>
.pdf-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.viewer-header {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  background-color: #f5f5f5;
}

.header-left {
  display: flex;
  align-items: left;
  align-content: center;
  justify-content: left;
  padding-right: 2px;
  margin-right: 2px;
}

.close-btn {
  width: 1rem;
}

.file-name {
  font-weight: 500;
  font-size: 12px;
  overflow-wrap: break-word;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.download-btn {
  background-color: #1976d2;
  color: white;
}

.pdf-content {
  flex: 1;
  position: relative;
}

.pdf-content.with-header {
  height: calc(100% - 60px);
}

.pdf-iframe {
  overflow: hidden !important;
  border: none;
  background-color: white;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.empty-state .caption {
  font-size: 14px;
  margin-top: 4px;
}
</style>
