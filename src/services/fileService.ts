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

export const filteredFiles = computed(() => {
  console.log('file service');
  if (!filterByStatus.value || filterByStatus.value.length === 0) {
    //if no filter or if array is empty, show all files
    return files.value;
  }
  return files.value.filter((file) => filterByStatus.value?.includes(file.status)); //filter using value/s from click to set condition
});
