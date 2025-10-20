import { defineStore } from 'pinia';
import type { ImportedDocument } from 'src/components/models';
import { apiService } from 'src/services/apiService';

export const useFileStore = defineStore('FileStore', {
  state: () => ({ files: [] as ImportedDocument[], pdfBlob: '' }), //returns state
  getters: {
    //filter by status
    //get color by type
    //time elapsed
    //abbreviate
  },
  actions: {
    //api calls
    async getFilesFromApi() {
      this.files = (await apiService.getFiles()).data; //get files data and assign to files[] in state
    },
    async getDocumentByFileName(filename: string, rotations: number[]) {
      this.pdfBlob = await apiService.getDocument(filename, rotations); //returns url string
    },
  },
});
