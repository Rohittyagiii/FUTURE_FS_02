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

const Client = require("./models/client");
const Admin = require("./models/admin");
const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", clientRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CRM Backend is running",
  });
});

app.post("/hello", (req, res) => {
  res.json("Hello Rohit");
});

app.post("/save-client-details", async (req, res) => {
  console.log("payload", req.body);
  const payload = req.body;
  if (!payload.name) {
    return res.json({msg:"Name is required",success:false});
  }
  if(!payload.email){
    return res.json({msg:"Email is required",success:false})
  }
  if(!payload.address){
    return res.json({msg:"Address is required",success:false})
  }
  if(!payload.mobile){
    return res.json({msg:"Mobile number is required",success:false})
  };

  payload.status="new";

  const {email, mobile}=payload;

  const existingUser= await Client.findOne({
    $or:[
      {email:payload.email},
      {mobile:payload.mobile}
    ]
  });
  if(existingUser){
    return res.status(400).json({
      "msg":"We already have your data with these email and mobile number",
      "success":false
    })
  }


  const client = new Client(payload);   
  const savedClient = await client.save();

  res.status(201).json({
     "msg":"Your request is save successfully",
     "success": true,
     "data":{generatedId:savedClient._id}
  })

});






app.post("/create-admin",async(req,res) => {
   req.body.currentLoginTimestamp= new Date();
   console.log("psyload",req.body);

   const admin = new Admin(req.body);
   const savedAdmin = await admin.save();

   res.status(201).json(
    {msg:"Admin Created Successfully",
      adminId:savedAdmin._id
    }
   );


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
