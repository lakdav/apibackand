import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import {
  bootcampsRouter,
  courseRouter,
  authRouter,
  userRouter,
  reviewRouter,
} from "./routes/index.js";
import conectToDb from "./db/mongoose.js";
import colors from "colors";
import path from "path";
import url from "url";
import errorHandler from "./middliware/error.js";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
dotenv.config({ path: "./config/config.env" });
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(hpp());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.get("/api/v1/error", () => {
  throw new Error("Sync error");
});
app.use(errorHandler);
let server = null;
conectToDb(process.env.MONGO_DB_URL, () => {
  server = app.listen(PORT, () => {
    console.log(
      `Server running on Port=${PORT} in mode=${process.env.NODE_ENV}`.yellow
        .bold
    );
    process.on("unhandledRejection", (err, promise) => {
      console.log(`unhandledRejection ${err.message}`.red.bold);
      server.close(() => process.exit(1));
    });
  });
});
