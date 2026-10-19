import cuser from "../models/cuser.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { CLIENT_URL } from "../config/aws.js";
import { sendPulseEmail } from "../helpers/mailer.js";

// ✅ Get All Users (except logged-in user)
export const getUsers = async (req, res) => {

  try {
    const users = await cuser.find({
      _id: { $ne: req.user.id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ✅ Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await cuser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await cuser.create({
      name,
      email,
      password: hashedPassword,
      profilePic: `https://i.pravatar.cc/150?u=${email}`,
      verificationToken,
    });
    const verificationUrl = `${CLIENT_URL}/verify/${verificationToken}`;

    await sendPulseEmail({
      to: email,
      subject: "[PulseChat] Verify Your Email Address",
      headline: "Welcome to PulseChat!",
      bodyHtml: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for joining PulseChat. Please click the button below to verify your email address and activate your account:</p>`,
      actionUrl: verificationUrl,
      actionText: "Verify & Activate Account",
      footerNote: "If you did not create a PulseChat account, you can safely ignore this message.",
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await cuser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!user.isVerified) {
      return error("Please verify your email first", res)
    }
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await cuser.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("Email verified! You can now login.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};