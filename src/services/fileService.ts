import { computed, ref } from 'vue';

interface Props {
  fileName: string;
  displayName: string;
  status: string;
  createdAt: string;
  processedAt: string;
  orgId: string;
  fileSize: string;
  documentTypes: string[];
}

export const files = ref<Props[]>([]);
export const filterByStatus = ref<string[]>();

// utilize these refs to set statuses across application (place status string inside array, and import variable where needed)
export const statusOk = ref<string[]>(['EXPORTED']);
export const statusError = ref<string[]>(['ERROR']);
export const statusReviewNeeded = ref<string[]>(['PROCESSED', 'INVALID', 'ERROR']);
export const statusUnassigned = ref<string[]>(['INVALID']);
export const statusAll = ref<string[]>(['PROCESSED', 'INVALID', 'ERROR', 'EXPORTED']);

export const filteredFiles = computed(() => {
  console.log('file service');
  if (!filterByStatus.value || filterByStatus.value.length === 0) {
    //if no filter or if array is empty, show all files
    return files.value;
  }
  return files.value.filter((file) => filterByStatus.value?.includes(file.status)); //filter using value/s from click to set condition
});
