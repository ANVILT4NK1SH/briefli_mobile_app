import { defineStore } from 'pinia';
import type { ImportedDocument } from 'src/components/models';
import { apiService } from 'src/services/apiService';

export const useFileStore = defineStore('FileStore', {
  state: () => ({ files: [] as ImportedDocument[] }), //returns state
  getters: {},
  actions: {
    //api call
    async getFilesFromApi() {
      this.files = (await apiService.getFiles()).data; //get files data and assign to files[] in state
    },
  },
});
