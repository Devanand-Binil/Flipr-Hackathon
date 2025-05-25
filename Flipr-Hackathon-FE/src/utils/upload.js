/*import axios from "axios";

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
      .then(({ data }) => {resolve(data);})
      .catch((err) => {console.log(err);});
  });
};
*/
import axios from "axios";

const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const upload_preset = "unsigned_preset";

export const uploadFiles = async (files) => {
  let uploaded = [];

  for (const f of files) {
    const { file, type } = f;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);

    try {
      const endpoint = getUploadEndpoint(type); // video or raw
      const res = await axios.post(endpoint, formData);
      uploaded.push({
        file: res.data,
        type,
      });
    } catch (err) {
      console.error("Upload error:", err);
    }
  }
  return uploaded;
};

// Choose endpoint based on file type
const getUploadEndpoint = (type) => {
  if (type === "video") {
    return `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
  } else {
    return `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`;
  }
};
