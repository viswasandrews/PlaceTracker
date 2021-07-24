const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
         })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));

 app.use('/api/pins', PinRoute);
 app.use('/api/users', userRoute);

 app.listen(8800, () => {
         console.log("Backend server is running");
 });

