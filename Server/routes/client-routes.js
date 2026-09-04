const express = require("express");

const {
  createClient,
  getClients,
} = require("../controllers/client-controller");

const router = express.Router();

router.get("/", getClients);

router.post("/", createClient);

module.exports = router;