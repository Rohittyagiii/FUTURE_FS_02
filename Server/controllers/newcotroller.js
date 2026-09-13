const express = require("express");
const router = express.Router();

router.post("/hello",(req,res)=>{
    console.log("test",req)
    return res.json("Hello world");
})
// module.exports = hello;