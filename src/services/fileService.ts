import type { ImportedDocument } from 'src/components/models';
import { computed, ref } from 'vue';
import { getClientId } from './clientService';
import { apiService } from './apiService';

export const files = ref<ImportedDocument[]>([]);

// utilize these refs to set statuses across application (place status string inside array, and import variable where needed)
export const statusOk = ref<string[]>([
  'APPROVED',
  'EXPORTED',
  'ARCHIVED',
  'ARCHIVE_FAILED',
  'EXPORTING',
]);
export const statusError = ref<string[]>(['REJECTED', 'FAILED', 'FAILURE', 'ERROR', 'INVALID']);
export const statusReviewNeeded = ref<string[]>(['PROCESSED', 'REPROCESSING', 'EXPORT_FAILED']);
export const statusAll = ref<string[]>(
  statusOk.value.concat(statusError.value.concat(statusReviewNeeded.value)),
);
export const clientUnassigned = ref(false);
export const filterByStatus = ref<string[]>(statusAll.value);

export const getAllFiles = async () => {
  const response = await apiService.getFiles();
  files.value = response.data;
  return files.value;
};

export const filteredFiles = computed(() => {
  if (!filterByStatus.value || filterByStatus.value.length === 0) {
    //if no filter or if array is empty, show all files
    return files.value;
  }
  if (clientUnassigned.value === true) {
    return files.value.filter((file) => !file.clientId);
  }
  return files.value.filter((file) => filterByStatus.value?.includes(file.status)); //filter using value/s from click to set condition
});

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

export const filterFilesByClientId = async (clientName: string | null) => {
  await getAllFiles(); // needed for when user filters then filters again (reset files)

  const clientId = getClientId(clientName); //convert client name to id

  if (clientName === 'Unassigned') {
    const filteredFilesByClientId = files.value.filter((file) => file.clientId === null); //filter files by NO id
    files.value = filteredFilesByClientId; //set files to filtered array (ref updates ui)
    return files.value;
  } else {
    const filteredFilesByClientId = files.value.filter((file) => file.clientId === clientId); //filter files by id
    files.value = filteredFilesByClientId; //set files to filtered array (ref updates ui)
    return files.value;
  }
};
