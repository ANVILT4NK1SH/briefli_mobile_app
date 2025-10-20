import { defineStore } from 'pinia';
import type { ImportedDocument } from 'src/components/models';
import { apiService } from 'src/services/apiService';
import { getClientId } from 'src/services/clientService';

export const useFileStore = defineStore('FileStore', {
  state: () => ({ files: [] as ImportedDocument[], pdfBlob: '' }), //returns state
  getters: {},
  actions: {
    //api calls
    async getFilesFromApi() {
      this.files = (await apiService.getFiles()).data; //get files data and assign to files[] in state
    },
    async getDocumentByFileName(filename: string, rotations: number[]) {
      this.pdfBlob = await apiService.getDocument(filename, rotations); //returns url string
    },
    async filterByClientId(clientName: string) {
      await this.getFilesFromApi(); // needed for when user filters then filters again (reset files)
      const clientId = getClientId(clientName); //convert client name to id

      if (clientName === 'Unassigned') {
        this.files = this.files.filter((file) => file.clientId === null); //filter files by NO id
      } else {
        this.files = this.files.filter((file) => file.clientId === clientId); //filter files by id
      }
      return this.files;
    },
    //filter by status
    //get color by type
    //time elapsed
    //abbreviate
  },
});
