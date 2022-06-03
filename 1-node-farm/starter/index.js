const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

// /////////////////////////////   -----files

// const hello = "!hello world";
// console.log(hello);

//  blocking ,synchronous read file
// const textin = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textin);

// // write file
// const textout = "THIS IS what we now about avacado:  " + textin;
// fs.writeFileSync("./txt/output.txt", textout);

// console.log("file written");

// Non-blocking ,asynchronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile("./txt/" + data1 + ".txt", "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final/txt", data2 + "/n" + data3, "utf-8", (err) => {
//         console.log("your file has been written");
//       });
//     });
//   });
// });
// console.log("will read file");

////////////////------server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const data_json = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data_json);
// console.log(dataObj);
const templateOverview = fs.readFileSync("./templates/overview.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const productOverview = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // const pathname = req.url;
  // console.log(pathname);
  // console.log(url.parse(req.url, true));
  // console.log(req);
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardHtml = dataObj
      .map(
        (el) => replaceTemplate(tempCard, el)
        // console.log(el)
      )
      .join("");
    // console.log(dataObj.map)
    const output = templateOverview.replace("{%PRODUCTCARD%}", cardHtml);
    // console.log(cardHtml);
    res.end(output);
  }

  // product page
  else if (pathname === "/product") {
    // console.log(query);
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-Type": "text/html" });
    const output = replaceTemplate(productOverview, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.end(data_json);
  } else {
    res.writeHead(404);
    res.end("page not found");
  }
  // res.end("hello from the server !");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
