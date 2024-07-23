const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');

require('dotenv').config()
const upload= require("express-fileupload");

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const {notFound,errorHandler} = require('./middleware/errorMiddleware');





const app = express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true,origin:"http://localhost:5000"}));


app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.use(upload());
app.use('/uploads',express.static(__dirname + '/uploads'));


app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI).then(app.listen(5000,()=>{console.log(`server is running on the port ${process.env.PORT}`)})).catch(error=>{console.log(error)});









