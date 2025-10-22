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
    //getting individual docs
    async getDocumentByFileName(filename: string, rotations: number[]) {
      this.pdfUrl = await apiService.getDocument(filename, rotations); //returns url string
    },
    //filter by client id
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
    //filter existing files by status
    async filterByStatus(status: string[], clientUnassigned: boolean) {
      // reset files array
      await this.getFilesFromApi();

      // set files array to variable
      let filteredFiles = this.files;

      // set filter by status and clientUnassigned
      this.statusBeingFiltered = status;
      this.clientUnassigned = clientUnassigned;

      // fitler by clientUnassigned
      if (clientUnassigned) {
        filteredFiles = filteredFiles.filter((file) => !file.clientId);
      }

      // filter by status unless status is 'all' (via helper function)
      if (status.length > 0 && !this.isStatusAll(status)) {
        filteredFiles = filteredFiles.filter((file) => status.includes(file.status));
      }

      this.files = filteredFiles;
      return this.files;
    },

    // helper to check if we're showing all statuses
    isStatusAll(status: string[]): boolean {
      return (
        status.length === this.statusAll.length ||
        JSON.stringify([...status].sort()) === JSON.stringify([...this.statusAll].sort())
      );
    },
  },

  //get color by type
  //time elapsed
  //abbreviate
});
