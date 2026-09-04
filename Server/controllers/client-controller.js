const Client = require("../models/client");

const createClient = async (req, res) => {
  try {
    const { name, email, address, mobile, description, status } = req.body;

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
      client: savedClient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json({
      clients,
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
};