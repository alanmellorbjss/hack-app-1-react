import config from "../appconfig";
import { v4 as uuidv4 } from "uuid";

const createUid = (filename) => {
  const fileExtension = filename.split(".").pop();
  const id = uuidv4() + fileExtension;
  return id;
};

const encodeBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageDataWithoutMimeType = reader.result.split(",")[1];
      resolve(imageDataWithoutMimeType);
    };
    reader.onerror = reject;
  });
};

const postToImageStore = async (file) => {
  const imageBase64 = await encodeBase64(file);
  const fileName = createUid(file.name);

  const requestBody = {
    file: imageBase64,
    fileName: fileName,
    fileMimeType: file.type,
  };

  const requestOptions = {
    method: "POST",
    headers: {}, // Initialize headers object
  };

  requestOptions.headers["Content-Type"] = "application/json";
  requestOptions.body = JSON.stringify(requestBody);

  console.log("POSTing image", fileName);
  return fetch(config.imageServiceUrl(), requestOptions);
};

export default postToImageStore;
