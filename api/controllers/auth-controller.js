import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } 
    catch(error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...other } = validUser._doc;   // to remove password from the response we get (best practice)
        res.cookie('access_token', token, {
            httpOnly: true,
        })
        res.status(200).json(other);  //removing password and getting other data
    } catch (error) {
        next(error);
    }
}

export const google = async ( req, res, next ) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...other} = user._doc;
            res.cookie('access_token', token, {
                httpOnly: true,
            })
            res.status(200).json(other)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);      //8+8 = 16 character password is generated on using gmail to login
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...other} = newUser._doc;
            res.cookie('access_token', token, {
                httpOnly: true,
            })
            res.status(200).json(other)
        }

    } catch (error) {
        next(error);
    }
}

export const signOut = async ( req, res, next ) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};