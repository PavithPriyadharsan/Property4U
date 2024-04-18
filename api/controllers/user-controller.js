import User from "../models/user-model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';

export const test = (req,res) => {
    res.json({
        message: 'Hello world'
    })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can only update your own account!"))
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {   //set allows to update only these values mentioned.
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        }, {new: true});
        const {password, ...other} = updatedUser._doc;
        res.status(200).json(other)
    } catch (error) {
        next(error)
    }
};