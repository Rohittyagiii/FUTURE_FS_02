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
router.get("/clients", getClients);

// GET single client
router.get("/clients/:id", getClientById);

// CREATE client
router.post("/submit-client", createClient);

// UPDATE client
router.put("/update/:id", updateClient);

// DELETE client
router.delete("/delete/:id", deleteClient);

module.exports = router;