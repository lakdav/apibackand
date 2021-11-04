import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send({ path: "/", method: "GET", id: req.query.id });
});
app.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send({ path: "/", method: "POST", ...req.body });
});
app.listen(PORT, () => {
  console.log(`Server running on Port=${PORT} in mode=${process.env.NODE_ENV}`);
});
