import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

//import Community Connect Routes
import UserRote from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import CommunityRoute from "./Routes/CommunityRoute.js";
import DonationRoute from "./Routes/DonationRoute.js"
import ProgramRoute from "./Routes/ProgramRoute.js"
import JobProviderRoute from "./Routes/JobProviderRoute.js";
import JobRoute from "./Routes/JobRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";

import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Community Connect Routes
app.use("/User", UserRote);
app.use("/Post/", PostRoute);
app.use("/Community", CommunityRoute);
app.use("/Donation",DonationRoute)
app.use("/Program",ProgramRoute)
app.use("/JobProvider", JobProviderRoute);
app.use("/Job", JobRoute);
app.use("/Message", MessageRoute);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🙂❤️‍🔥`));
  })
  .catch((err) => console.log(err));
