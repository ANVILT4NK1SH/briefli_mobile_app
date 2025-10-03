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

  const formData = new FormData();
  formData.append('file', file);

  console.log(response.data.url);
  const postResponse = await axios.post(response.data.url, formData, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log(postResponse);
};
