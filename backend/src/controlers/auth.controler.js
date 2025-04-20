import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/clodinary.js";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "required All fileds" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password Should be 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "email already taken" })
        }

        // hased password
        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName,
            email,
            password: hassedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "invaild User data" })
        }
    } catch (error) {
        console.log(`Error in signup controller ${error}`)
        res.status(500).json({ message: "Internal server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invaild Creadinatiol" })
        };
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invaild Creadinatiol" })
        };
        //generate jwt token
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(`Error in login controler ${error}`)
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Succesfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(`Error in logout controller ${error}`)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: "Profile Pic is recquired" });
        };
        const uploaderResponce = await cloudinary.uploader.upload(profilePic);

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploaderResponce.secure_url },
            { new: true }
        );

        res.status(200).json({ updateUser });

    } catch (error) {
        console.log(`Error in UpdateProfile ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const chackAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(`Error in chack Auth ${error}`);
        res.status(500).json({ message: "Internal server error" })
    }
}