// const express = require("express");

// const {
//   createClient,
//   getClients,
// } = require("../controllers/client-controller");

// const router = express.Router();

// router.get("/clients", getClients);

// router.post("/clients", addClient);

// router.delete("/clients/:id", deleteClient);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

// GET all clients
router.get("/", getClients);

// GET single client
router.get("/:id", getClientById);

// CREATE client
router.post("/", createClient);

// UPDATE client
router.put("/:id", updateClient);

// DELETE client
router.delete("/:id", deleteClient);

module.exports = router;