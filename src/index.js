// require('dotenv').config({path: './env'})
import dotenv from "dotenv"

import connectDB from "./DB/index.js";
// data base se bat karne pe problem aashakti he
// uskeli ae use try()...catch()... use kare.
// user async and await

dotenv.config({path: './env'})

connectDB()












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
