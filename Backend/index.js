const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const messageRoute = require("./routes/messageRoute");
const dbconnect = require("./Utils/dbconnection");
const path = require('path');
dotenv.config();
const PORT = process.env.PORT || 4000;
const {app,server} = require('./Socket/socket');



//middlewares
app.use(express.json());
app.use(cookieParser());
// app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.sendStatus(200); // Respond with 200 OK to OPTIONS requests
// });
app.use(express.urlencoded({extended:true}));
const corsOptions = {
    origin:process.env.URL,
    // methods: ['GET', 'POST', 'OPTIONS','DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// apis
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

app.use(express.static(path.join(__dirname,"../Frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../Frontend","dist","index.html"))
})

server.listen(PORT,()=>{
    console.log("Server listen at port 4000")
});
dbconnect();
app.get("/",(req,res)=>{
    res.send("server started")
})
