import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB)
.then(()=> {
    console.log('Connected to MongoDB');

}).catch((err)=>{
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});