const express = require ('express');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
const app = express();
const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')

dotenv.config();

app.use(express.json())

mongoose.set('strictQuery', true);

mongoose
.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    UseUnifiedTopology:true,
})
.then(()=> console.log('MongoDB Connected'))
.catch((err)=>  console.log(err))

app.use('/api/pins',pinRoute)
app.use('/api/users',userRoute)

app.listen(9000,()=>{
    console.log('Server is Running')
})