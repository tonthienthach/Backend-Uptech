const express = require("express");
const session = require("express-session");

require("dotenv").config();

const app = express();
const route = require('./routes/index');

const { DBconnect } = require("./configs/ConnectDB");
DBconnect();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "team2-uptech",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.use('/api', route)

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
