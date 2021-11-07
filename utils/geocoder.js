import Geocoder from "node-geocoder";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formater: null,
};
const geocoder = Geocoder(options);
export default geocoder;
