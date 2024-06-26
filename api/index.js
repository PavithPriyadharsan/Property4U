import express from 'express';
import mongoose from 'mongoose';
// Import routes
import userRouter from './routes/user-route.js';
import authRouter from './routes/auth-route.js';
import cookieParser from 'cookie-parser';

// Import dotenv
import dotenv from 'dotenv';
dotenv.config();

// Initialize express
const app = express();
app.use(express.json());

app.use(cookieParser());

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

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//error handled here
app.use((err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";

    return res.status(status).json({
        success: false,
        status,
        message

})
});