const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3030;

// //Order Router
// const OrderRouter = require("./routes/order.router");
app.use("/", require("./routes"));

app.listen(port, () => {
  console.log(`Server is running on`);
});
