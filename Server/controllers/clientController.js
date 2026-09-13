  // const Client = require("../models/client");

// const createClient = async (req, res) => {
//   try {
//     const { name, email, address, mobile, description, status } = req.body;

//     const client = new Client({
//       name,
//       email,
//       address,
//       mobile,
//       description,
//       status,
//     });

//     const savedClient = await client.save();

//     res.status(201).json({
//       message: "Client created successfully",
//       client: savedClient,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const getClients = async (req, res) => {
//   try {
//     const clients = await Client.find();

//     res.status(200).json({
//       clients,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createClient,
//   getClients,
// };

const Client = require("../models/client");

// CREATE CLIENT
const createClient = async (req, res) => {
  try {
    const { name, email, address, mobile, description, status } = req.body;

    if (!name || !email || !address || !mobile) {
      return res.status(400).json({
        message: "Name, email, address and mobile are required",
      });
    }

    const client = new Client({
      name,
      email,
      address,
      mobile,
      description,
      status,
    });

    const savedClient = await client.save();

    res.status(201).json({
      message: "Client created successfully",
      // id: savedClient._id,
      success:true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success:false
    });
  }
};

// GET ALL CLIENTS
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      clients,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CLIENT
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CLIENT
const updateClient = async (req, res) => {
  try {
    const { name, email, address, mobile, description, status } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        address,
        mobile,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CLIENT
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      message: "Client deleted successfully",
      client: deletedClient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};