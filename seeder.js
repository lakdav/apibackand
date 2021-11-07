import fs from "fs";
import Mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import Bootcamps from "./model/bootcamps.js";
import Course from "./model/course.js";
import Review from "./model/Review.js";
import "colors";
dotenv.config({ path: "./config/config.env" });

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "_data", "bootcamps.json"), {
    encoding: "utf-8",
  })
);
const course = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "_data", "courses.json"), {
    encoding: "utf-8",
  })
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "_data", "reviews.json"), {
    encoding: "utf-8",
  })
);
Mongoose.connect(process.env.MONGO_DB_URL).catch(console.log);
const imporData = async () => {
  try {
    await Course.deleteMany();
    await Review.deleteMany();
    await Bootcamps.deleteMany();
    await Course.create(course);
    await Bootcamps.create(bootcamps);
    await Review.create(reviews);
    console.log(`Data was imported`.green.bold);
    process.exit();
  } catch (err) {
    console.log(`${err.message}`.red.bold);
  }
};

const deleteData = async () => {
  try {
    await Bootcamps.deleteMany();
    await Course.deleteMany();
    await Review.deleteMany();
    console.log(`Data was deleted`.green.bold);
    process.exit();
  } catch (err) {
    console.log(`${err.message}`.red.bold);
  }
};

process.argv[2] ? deleteData() : imporData();
