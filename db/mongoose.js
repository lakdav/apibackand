import Mongoose from "mongoose";

const conectToDb = async (url, callback) => {
  await Mongoose.connect(url);
  console.log("Conected to Mongodb");
  callback();
};
export default conectToDb;
