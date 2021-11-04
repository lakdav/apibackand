import express from "express";
import morgan from "morgan";

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
app.listen(3000);
