import { defineStore } from 'pinia';
import type { ImportedDocument } from 'src/components/models';
import { apiService } from 'src/services/apiService';
import { ref } from 'vue';
import { useClientStore } from './ClientStore';

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
    getColorByType:
      () =>
      (fileType: string): string => {
        switch (fileType) {
          case 'Packing List':
            return 'blue';
          case 'Bill of Lading':
            return 'green';
          case 'Commercial Invoice':
            return 'red';
          case 'Unknown':
            return 'grey';
          default:
            return 'grey';
        }
      },
    docTypeAbbreviation:
      () =>
      (docType: string): string => {
        switch (docType) {
          case 'Packing List':
            return 'PL';
          case 'Bill of Lading':
            return 'BOL';
          case 'Commercial Invoice':
            return 'INV';
          case 'Unknown':
            return 'UNK';
          default:
            return 'UNK';
        }
      },
    //unused?
    isInProcessedQueue: (state) => {
      return (status: string | undefined) => {
        if (!status) return false;
        return state.statusReviewNeeded.includes(status);
      };
    },
    getFileCategoryStatus: (state) => {
      return (status: string | undefined) => {
        if (status) {
          if (state.statusError.includes(status)) {
            return 'failed';
          } else if (state.statusOk.includes(status)) {
            return 'completed';
          } else if (state.statusReviewNeeded.includes(status)) {
            return 'processing';
          }
        }
        return 'loading';
      };
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
    //filter files by client id
    async filterByClientId(clientName: string) {
      await this.getFilesFromApi(); // needed for when user filters then filters again (reset files)
      const clientStore = useClientStore();
      const clientId = clientStore.getClientIdByName(clientName); //convert client name to id

      if (clientName === 'All') {
        //this.files should contain all from getFilesFromApi
      } else if (clientName === 'Unassigned') {
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

    //time elapsed
    timeElapsed(timeCreated: string): string {
      const elapsedTime = (new Date().getTime() - new Date(timeCreated).getTime()) / (1000 * 60);

      const result =
        elapsedTime < 60
          ? `uploaded ${elapsedTime.toFixed()} minutes ago`
          : elapsedTime / 60 < 24
            ? elapsedTime / 60 < 2 && elapsedTime / 60 > 0
              ? `uploaded ${(elapsedTime / 60).toFixed()} hour ago`
              : `uploaded ${(elapsedTime / 60).toFixed()} hours ago`
            : elapsedTime / (60 * 24) < 2 && elapsedTime / (60 * 24) > 0
              ? `uploaded ${(elapsedTime / (60 * 24)).toFixed()} day ago`
              : `uploaded ${(elapsedTime / (60 * 24)).toFixed()} days ago`;

      return result;
    },
  },
});
