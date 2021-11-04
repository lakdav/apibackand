import http from "http";
import { hostname } from "os";

const PORT = 3000;
const data = [
  { id: 1, text: "one" },
  { id: 2, text: "two" },
  { id: 3, text: "three" },
];
const SetData = (success, data) => {
  const body = {
    success: success,
    data,
  };
  return JSON.stringify(body);
};

new http.Server((req, res) => {
  //   res.setHeader("Content-Type", "application/json");
  //   res.setHeader("X-powered-By", "node.js");
  //   res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-powered-By", "node.js");
  if ((req.url = "/")) {
    switch (req.method) {
      case "GET":
        res.statusCode = 200;
        res.write(SetData(true, data));
        res.end();
        return;
      case "POST":
        const body = [];
        req
          .on("data", (chunk) => {
            body.push(chunk);
          })
          .on("end", () => {
            res.statusCode = 201;
            res.write(SetData(true, Buffer.concat(body).toString()));
            res.end();
          });

        return;
      default:
        res.statusCode = 400;
        res.end(JSON.stringify(SetData(false, null)));
    }
  }
}).listen(3000, () => {
  console.log("http://" + hostname + "/" + PORT);
});
