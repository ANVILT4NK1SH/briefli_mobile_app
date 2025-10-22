import { ref } from 'vue';

export const clientUnassigned = ref(false);

export const isInProcessedQueue = (status: string | undefined) => {
  if (!status) return false;

  return ['PROCESSED', 'REPROCESSING', 'EXPORT_FAILED'].includes(status);
};

export const getFileCategoryStatus = (status: string | undefined) => {
  if (status) {
    if (['REJECTED', 'FAILED', 'FAILURE', 'ERROR', 'INVALID'].includes(status)) {
      return 'failed';
    } else if (
      ['APPROVED', 'EXPORTED', 'ARCHIVED', 'ARCHIVE_FAILED', 'EXPORTING'].includes(status)
    ) {
      return 'completed';
    } else if (isInProcessedQueue(status)) {
      return 'processing';
    }
  } else {
    return 'loading';
  }
};
