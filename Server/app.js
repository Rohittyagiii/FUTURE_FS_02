// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const clientRoutes = require("./routes/client-routes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/clients", clientRoutes);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/future-fs")
//   .then(() => {
//     console.log("MongoDB connected");

//     app.listen(5000, () => {
//       console.log("Server running on port 5000");
//     });
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error:", error);
//   });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CRM Backend is running",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });