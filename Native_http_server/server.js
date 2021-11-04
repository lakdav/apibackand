import http from "http";
import { hostname } from "os";

const PORT = 3000;
const data = [
  { id: 1, text: "one" },
  { id: 2, text: "two" },
  { id: 3, text: "three" },
];

new http.Server((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-powered-By", "node.js");
  res.statusCode = 200;
  res.write(
    JSON.stringify({
      success: true,
      data,
    })
  );
  res.end();
}).listen(3000, () => {
  console.log("http://" + hostname + "/" + PORT);
});
