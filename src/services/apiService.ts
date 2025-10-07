import axios from 'axios';
import { authService } from './authService';

export const apiService = {
  async uploadFile(filename: string, clientId: string, file: File) {
    const token = await authService.getBearerToken();

    const response = await axios.get(`${process.env.API_URL}/signedUrl`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filename,
        configuring: false,
        clientId,
      },
    });

    console.log('Signed Url:', response.data.url);
    const putResponse = await axios.put(response.data.url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    console.log('response status:', putResponse.status);
    return putResponse.status;
  },

  async getFiles() {
    const token = await authService.getBearerToken();

    const response = await axios.get(`${process.env.API_URL}/file`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  async getDocument(filename: string, rotations: number[]) {
    const token = await authService.getBearerToken();

    const response = await axios.get(`${process.env.API_URL}/signedDownloadUrl`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filename,
        rotations,
      },
    });

    console.log('signedDownloadUrl response: ', response);

    const document = await axios.get(response.data.url);

    console.log('Document: ', document);
    return document.data;
  },
};
