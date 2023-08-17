const express = require("express");
const session = require("express-session");
const Brands = require('./models/Orders')
require("dotenv").config();

const app = express();

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

const brand = new Brands({ name: "PhongVu" })

app.get('/chauanh', async (req, res) => {
  const products = await Brands.find({})
  res.json(products);
  //res.send('ChauAnh');
})

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
