const express = require("express");
const app = express();
const router = express.Router();
const db = require("./controller");
app.use(express.json());

router.get("/json/add", db.json_push_file);

module.exports = router;
