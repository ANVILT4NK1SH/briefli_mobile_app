import { defineStore } from 'pinia';

export const useFileStore = defineStore('FileStore', {
  state: () => ({ files: [] }),
  getters: {},
  actions: {},
});
