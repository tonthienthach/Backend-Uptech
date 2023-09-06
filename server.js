const express = require("express");
const session = require("express-session");
const morgan = require('morgan');
const helmet = require('helmet');
const compress = require('compression')
const cors = require('cors');

require("dotenv").config();

const route = require('./routes/index');
const app = express();
app.use(express.json());
// Use compress!
app.use(compress());
// Use Helmet!
app.use(helmet());
// HTTP  logger
app.use(morgan('combined'));
app.use(cors());
app.set('view engine', 'pug');


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

app.use(express.json());
app.use('/api', route)

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
