// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import { app } from "./app.js";


import connectDB from "./DB/index.js";
// data base se bat karne pe problem aashakti he
// uskeli ae use try()...catch()... use kare.
// user async and await
dotenv.config({path: './env'})

connectDB()
.then(() =>{
   app.listen(process.env.POTE || 8000, () => {
      console.log(` Server is running at post :${process.env.POTE}`);
         app.on("error", (err) =>{
          console.log(`Error:${err}`);
          throw err;
         })   
   })
})
.catch((err) => {
  console.log(" MONGODB connection failed: " + err);
  
})












/*import express from "express";
const app = express();

// (IIFE)
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}
            /${DB_NAME}`);
    app.on("error", (error) => {
      console.log(error);
      throw error;
    });

    app.length(process.env.POTE, () => {
      console.log(`Server running pote
         ${process.env.POTE}`);
    });
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();*/
