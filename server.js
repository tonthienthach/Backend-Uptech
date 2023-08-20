const express = require("express");
const session = require("express-session");
const morgan = require('morgan');
const cart = require('./routes/cart');
const product = require('./routes/products');
const Brands = require('./models/Orders')
const helmet = require('helmet');
var compress = require('compression')
const cors = require('cors');
const indexRoutes = require('./routes/index');

require("dotenv").config();

const app = express();

// Use compress!
app.use(compress());
// Use Helmet!
app.use(helmet());
// HTTP  logger
app.use(morgan('combined'));
app.use(cors());

app.use('/api', indexRoutes);
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
