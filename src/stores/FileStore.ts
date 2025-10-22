import { defineStore } from 'pinia';
import type { ImportedDocument } from 'src/components/models';
import { apiService } from 'src/services/apiService';
import { getClientId } from 'src/services/clientService';
import { ref } from 'vue';

export const useFileStore = defineStore('FileStore', {
  state: () => ({
    files: ref<ImportedDocument[]>([]),
    pdfUrl: ref(''),
    statusBeingFiltered: ref<string[]>([]),
    clientUnassigned: ref(false), //probably better naming convention?

    //status categories (do these go here? not 'state'?)
    statusOk: ref<string[]>(['APPROVED', 'EXPORTED', 'ARCHIVED', 'ARCHIVE_FAILED', 'EXPORTING']),
    statusError: ref<string[]>(['REJECTED', 'FAILED', 'FAILURE', 'ERROR', 'INVALID']),
    statusReviewNeeded: ref<string[]>(['PROCESSED', 'REPROCESSING', 'EXPORT_FAILED']),
    statusAll: ref<string[]>([]),
  }),
  getters: {
    //filter by status?
    /*  filteredFiles: (state) => {
      let result = state.files;

      // Filter by client unassigned
      if (state.clientUnassigned) {
        result = result.filter((file) => !file.clientId);
      }

      // Filter by status, only if any status is selected
      if (state.statusBeingFiltered.length > 0) {
        result = result.filter((file) => state.statusBeingFiltered.includes(file.status));
      }

      return result;
    }, */

    getFiles: (state) => {
      return state.files;
    },
  },
  actions: {
    //spread all statuses into statusAll
    initializeStatusAll() {
      this.statusAll = [...this.statusOk, ...this.statusError, ...this.statusReviewNeeded];
    },

    //api call for all files
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
