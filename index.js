const express = require('express');
const app = express();
const mongoose =require('mongoose');
const dotenv = require('dotenv');

//import router
const authRouter = require('./routers/auth');

dotenv.config();
//connect MD
mongoose.connect(
process.env.DB_CONNECT,
//{ useNewUrlParser: true } recieved from terminal
{ useNewUrlParser: true },
()=>console.log('Connected to db'));

//middleware
app.use(express.json());

//router middlewares
/* /api/user/router */
app.use('/api/user', authRouter);


app.listen(4000, ()=> console.log('Sever up loading and running'));