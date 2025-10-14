import type { ImportedDocument } from 'src/components/models';
import { computed, ref } from 'vue';

export const files = ref<ImportedDocument[]>([]);

// utilize these refs to set statuses across application (place status string inside array, and import variable where needed)
export const statusOk = ref<string[]>(['EXPORTED']);
export const statusError = ref<string[]>(['ERROR', 'INVALID']);
export const statusReviewNeeded = ref<string[]>(['PROCESSED', 'INVALID', 'ERROR']);
export const statusAll = ref<string[]>(['PROCESSED', 'INVALID', 'ERROR', 'EXPORTED', 'REJECTED']);
export const clientUnassigned = ref(false);
export const filterByStatus = ref<string[]>(statusAll.value);

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
