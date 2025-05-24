import axios from "axios";

const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const cloud_secret = import.meta.env.VITE_CLOUD_SECRET;
export const uploadFiles = async (files) => {
  let formData = new FormData();
  formData.append("upload_preset", cloud_secret);
  let uploaded = [];
  for (const f of files) {
    const { file, type } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    uploaded.push({
      file: res,
      type: type,
    });
    // console.log(res);
  }
  return uploaded;
};
const uploadToCloudinary = async (formData) => {
  return new Promise(async (resolve) => {
    return await axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
        formData
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};