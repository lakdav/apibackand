import http from "http";
import { hostname } from "os";

const PORT = 3000;

new http.Server((req, res) => {
  console.log(req.headers);
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.write(JSON.stringify({ message: "hello" }));
  res.end();
}).listen(3000, () => {
  console.log("http://" + hostname + "/" + PORT);
});
