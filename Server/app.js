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
   console.log("payload",req.body);
   const admin = new Admin(req.body);
   const savedAdmin = await admin.save();

   res.status(201).json(
    {msg:"Admin Created Successfully",
      adminId:savedAdmin._id
    }
   );
});

app.post("/login-admin",async (req,res) => {
   console.log("payload", req.body);
   const {email,password} = req.body  
  if (!email) {
    return res.json({
      msg:"Email is required",
      success:false
    });
  }
  if(!password){
    return res.json({
      msg:"Password is required",
      success:false
    })
  }

  const userExits = await Admin.findOne(
    {email:req.body.email}
  )

  if(!userExits){
    return res.status(404).json({
      success:false,
      msg:"User is not register with this email"
    })
  }

  const geniuneUser = await Admin.findOne({
     $and:[
      {email:req.body.email},
      {password:req.body.password}
     ]
  });


  if(!geniuneUser){
       return res.status(404).json({
        success:false,
        msg:"password is incorrect"
       })
  };

  const now = new Date();
   geniuneUser.lastLoginTimestamp=geniuneUser.currentLoginTimestamp;
  geniuneUser.currentLoginTimestamp = now;
  console.log("check data ",geniuneUser);
  await geniuneUser.save();

  return res.status(200).json({
    success: true,
    msg: "Admin login successful!",
    result:geniuneUser._id
  });
});

app.put("/changeStatus", async (req, res) => {
  try {
    const { _id, status } = req.body;

    // Validate that both ID and status are provided
    if (!_id || !status) {
      return res.status(400).json({ 
        success: false, 
        msg: "Both _id and status are required." 
      });
    }


    // Check if the user/admin exists
    const userExists = await Client.findById(_id);
    if (!userExists) {
      return res.status(404).json({ 
        success: false, 
        msg: "User not found." 
      });
    }

    // Update the status
    const updatedUser = await Client.findByIdAndUpdate(
      _id,
      { status: status },
      { new: true } // Returns the updated document
    );

    return res.status(200).json({
      success: true,
      msg: "Status updated successfully.",
      data: updatedUser
    });

  } catch (error) {
    console.error("Error changing status:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
      error: error.message
    });
  }
});


app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the client by ID using the Client model
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        msg: "Client not found.",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Client deleted successfully.",
      data: deletedClient,
    });

  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
      error: error.message,
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });