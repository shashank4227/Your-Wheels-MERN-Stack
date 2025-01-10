const express = require("express");
const router = express.Router();

const { getSearchResults } = require("../controllers/SearchController");

router.get("/search-results",getSearchResults);

module.exports = router;
