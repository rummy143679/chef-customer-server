const User = require('../models/userSchema')
const bcrypt = require('bcrypt');
const {createJwtToken} = require('../utility/createJwtToken')

const register = async (req, res) => {

    try {
        const { userName, email, password, role, contact } = req.body
        if (!userName || !email || !password || !role || !contact) {
            return res.status(400).json({ status: "failed", message: "Invalid user details" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(409).json({ status: "failed", message: "user already exist" });
        }
        const hashPassword = await bcrypt.hashSync(password, 10);
        const user = new User({
            userName, email, password: hashPassword, role, contact
        });

        const savedUser = await user.save();
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: savedUser,
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: "failed", message: "internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(401).json({ status: "failed", message: "Invalid email" })
        }

        const comparedPassword = await bcrypt.compare(password, existUser.password);

        if (comparedPassword) {

            const token = await createJwtToken({
                userName:existUser.userName,
                email: existUser.email,
                password: existUser.password,
                role: existUser.role,
                contact: existUser.contact
            });
            console.log("token:",token)
            res.cookie("token", token,
                {
                    httpOnly: true,       // ❌ Not accessible via JS
                    // secure: process.env.NODE_ENV === "production", // ✅ Only over HTTPS in production
                    sameSite: "strict",   // ✅ CSRF protection
                    maxAge: 60 * 60 * 1000 // 1 hour
                })


            return res.status(200).json(
                {
                    status: "success",
                    message: "User login successfully",
                    data: existUser,
                    token: token
                }
            )
        } else {
            return res.status(401).json({ status: "failed", message: "Invalid password" })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: "failed", message: "internal server error" });
    }
}

const users = (req, res) => {
    try {
        return res.status(200).json({ status: "success", message: "users" })
    } catch (err) {
        return res.status(500).json({ status: "failed", message: "internal server error" });
    }
}

module.exports = { register, login, users }