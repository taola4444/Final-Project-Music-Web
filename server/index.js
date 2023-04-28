const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({origin: true}))
app.use(express.json());
app.use(cookieParser())

const url = `mongodb+srv://phucandtan:phuctan123@musicwebfinal.4hrcfmj.mongodb.net/?retryWrites=true&w=majority`;
const connectDB = async () => {
    try {
        await mongoose.connect(url,{
            useNewUrlParser: true,
        });

        console.log("Connect Data Success!!!");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

// user authorization
const userAuth = require("./routes/auth");
app.use("/api/users/",userAuth);

const artistRoutes = require("./routes/artist");
app.use("/api/artists/",artistRoutes);

const albumRoutes = require("./routes/albums");
app.use("/api/albums/",albumRoutes);

const songRoutes = require("./routes/songs");
app.use("/api/songs/",songRoutes);

const paypalRoutes = require("./routes/paypal");
app.use("/paypal",paypalRoutes);

// const accountRoutes = require("./routes/account");
// app.use("/api/account/",accountRoutes);

app.get("/", (req,res) => {
    return res.json("Hi theare,....");
})

app.listen(4000, () => console.log("Listening to port 4000"));