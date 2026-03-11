import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  const { Cloud_Name, Cloud_Api_Key, Cloud_Scret_Key } = process.env;

  if (!Cloud_Name || !Cloud_Api_Key || !Cloud_Scret_Key) {
    throw new Error("Cloudinary environment variables are missing");
  }

  cloudinary.config({
    cloud_name: Cloud_Name,
    api_key: Cloud_Api_Key,
    api_secret: Cloud_Scret_Key,
  });
};

export { cloudinary };
export default connectCloudinary;
