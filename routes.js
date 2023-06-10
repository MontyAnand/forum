const express = require("express");
var ObjectId = require('mongodb').ObjectID;
const userModel = require("./models");
const app = express();
app.post("/add_user", async (request, response) => {
    const user = new userModel(request.body);
  
    try {
      await user.save();
      console.log(user);
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/users", async (request, response) => {
    const users = await userModel.find({});
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get("/users:Id",async(req,res)=>{
    const id = req.params.Id;
    let query = {room:id};
  let result = await userModel.find(query);
    try {
        res.send(result);
      } catch (error) {
        res.status(400).send(error);
      }
  });

  module.exports = app;