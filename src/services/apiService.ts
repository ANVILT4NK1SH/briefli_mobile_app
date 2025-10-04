import axios from 'axios';

export const uploadFile = async (
  filename: string,
  clientId: string,
  bearerToken: string,
  file: File,
) => {
  const response = await axios.get(`${process.env.API_URL}/signedUrl`, {
    headers: { Authorization: `Bearer ${bearerToken}` },
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
};
