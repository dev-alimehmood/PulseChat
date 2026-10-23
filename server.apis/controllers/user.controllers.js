import GenerateTokenAndUser from "../utils/GenerateTokenAndUserResponse.js"
import { catchErr, error, success, warning } from "../utils/messages.js"
import { AWS_SES, CLIENT_URL, sender_email } from "../config/aws.js"
import { JWT_SECRET } from "../config/config.js"
import user from "../models/user.models.js"
import cuser from "../models/cuser.model.js"
import evalidator from 'email-validator'
import Schema from 'password-validator'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { nanoid } from 'nanoid'
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { io, onlineUsers } from "../server.js";
import { sendPulseEmail, sendAccountActivationEmail, sendPasswordResetOtpEmail } from "../helpers/mailer.js";


const pvalidator = new Schema
pvalidator
  .is().min(8)                                    // Minimum length 8
  .is().max(30)                                  // Maximum length 100
  .has().uppercase(1)                              // Must have uppercase letters
  .has().lowercase(1)                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// 1) sent verification link to emailadress /api/v1/pre-sign-up
const preSignup = async (req, res) => {
  try {
    const { full_name, email, password, confirm_password, refUserId } = req.body
    const existemail = await user.findOne({ email })

    // email exist to nahi karti
    if (existemail) {
      return error(`This Email ${email} is already registered , try with different email`, res)
    }
    // passsword validator
    if (!pvalidator.validate(password)) {
      return warning("Password must be 8 to 30 digits,should have 1 uppercase letter,1lowercase letter,and should have 2 digits", res)
    }

    // Include refUserId in token if registered via invite
    const token = jwt.sign({ full_name, email, password, refUserId: refUserId || null }, JWT_SECRET, { expiresIn: "4h" })
    const activationLink = `${CLIENT_URL}/${token}`;

    await sendAccountActivationEmail({
      to: email,
      fullName: full_name,
      activationUrl: activationLink,
    });

    success("We have sent you a verification link, please check your email address", res)
  }
  catch (err) {
    catchErr(err, res)
  }
}

// 2) create new account after decode the token /api/v1/signup
const signup = async (req, res) => {
  try {
    const token = req.body.token
    const { full_name, email, password, refUserId } = jwt.verify(token, JWT_SECRET)
    // encrypt the password before saving into database
    const salt = await bcryptjs.genSalt(12)
    const hashpassword = await bcryptjs.hash(password, salt)
    const emailfound = await user.findOne({ email })
    if (emailfound) {
      return error(`This email ${email} is already registered, may be you clicked on link again`, res)
    }
    // now finally create the account
    const newUser = await user({
      full_name,
      email,
      password: hashpassword
    }).save()

    // If registered via an invite, auto-connect with the inviter!
    if (refUserId) {
      try {
        const inviter = await user.findById(refUserId);
        if (inviter) {
          let conv = await Conversation.findOne({
            participants: { $all: [inviter._id, newUser._id] },
          });
          if (!conv) {
            conv = await Conversation.create({
              participants: [inviter._id, newUser._id],
            });
          }
          const welcomeMsg = await Message.create({
            conversationId: conv._id,
            sender: inviter._id,
            text: `👋 Hey ${full_name}! Welcome to PulseChat. Glad you accepted my invite!`,
            status: "delivered",
            deliveredTo: [newUser._id],
          });
          conv.lastMessage = welcomeMsg._id;
          await conv.save();

          // Notify inviter via socket if online
          const inviterSocket = onlineUsers.get(inviter._id.toString());
          if (inviterSocket) {
            io.to(inviterSocket).emit("conversationUpdated", {
              conversationId: conv._id.toString(),
              lastMessage: welcomeMsg.text,
            });
          }
        }
      } catch (inviteConnectErr) {
        console.error("Auto-connect on invite error:", inviteConnectErr);
      }
    }

    success(`${full_name} your account has been created`, res)
  }
  catch (err) {
    catchErr(err, res)
  }
}
// 3) logged in with your credientials /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const User = await user.findOne({ email })
    if (!email || !password) {
      return warning("both fields are required", res)
    }
    if (!evalidator.validate(email)) {
      return warning("email is not valid", res)
    }
    if (!User) {
      return error("This email is not registered", res)
    }
    const isMatchedpassword = await bcryptjs.compare(password, User.password)
    if (!isMatchedpassword) {
      return error("Wrong password", res)
    }
    //  if (!User.isVerified) {
    //   return  error("Please verify your email first" , res)
    //  }
    GenerateTokenAndUser(User, req, res, "you are successsfuly logged In")

  }
  catch (err) {
    catchErr(err, res)
  }
}
// 4) we will send you otp for password recovery /api/v1/pre-sign-up
// 4) we will send you otp for password recovery /api/v1/pre-sign-up
const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email
    if (!email) {
      return error("Please enter your email address", res)
    }
    if (!evalidator.validate(email)) {
      return warning("This email address is not valid", res)
    }
    const User = await user.findOne({ email })
    if (!User) {
      return error(`This email ${email} is not registered`, res)
    }
    // Generate clean 5-character uppercase alphanumeric code (no confusing symbols, no hyphens/underscores)
    const OTP_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let otp = "";
    for (let i = 0; i < 5; i++) {
      otp += OTP_CHARS.charAt(Math.floor(Math.random() * OTP_CHARS.length));
    }
    User.otp = otp;
    await User.save();

    await sendPasswordResetOtpEmail({
      to: email,
      recipientName: User.full_name || "there",
      otpCode: otp,
    });

    return success("OTP sent to your email", res);
  } catch (err) {
    console.error("[PulseChat] forgetPassword error:", err.message);
    return error("Failed to send email", res);
  }
}
// 6) user ko otp send kar di ha
const otp = async (req, res) => {
  try {
    const rawOtp = req.body.otp;
    if (!rawOtp || !rawOtp.trim()) {
      return error("Please Enter OTP", res);
    }
    const cleanOtp = rawOtp.trim().toUpperCase();

    // Verify OTP case-insensitively
    const existotp = await user.findOne({
      $or: [
        { otp: cleanOtp },
        { otp: rawOtp.trim() },
        { otp: { $regex: new RegExp(`^${cleanOtp}$`, "i") } }
      ]
    });

    if (!existotp) {
      return warning("Wrong OTP", res);
    }
    const token = nanoid(32);
    existotp.resetToken = token;
    existotp.otp = "";
    await existotp.save();

    return success({ message: "Reset Your Password", token: existotp.resetToken }, res);
  }
  catch (err) {
    catchErr(err, res);
  }
}
// 5) with that otp you can reset your password /api/v1/pre-sign-up
const resetPassword = async (req, res) => {

  try {
    const { password, confirm_password } = req.body

    if (!password || !confirm_password) {
      return error("Both fields are required", res)
    }
    if (!pvalidator.validate(password)) {
      return warning("Password must be 8 to 30 digits,should have 1 uppercase letter,1lowercase letter,and should have 2 digits", res)
    }
    if (password != confirm_password) {
      return warning("Password and confirm password must be matched", res)
    }

    const salt = await bcryptjs.genSalt(12)
    const hashpassword = await bcryptjs.hash(password, salt)
    await user.findOneAndUpdate({ resetToken: req.params.token }, { password: hashpassword }, { new: true })

    success("Your password has been changed", res)

  }
  catch (err) {
    catchErr(err, res)
  }
}

/* 6)  show all users by admin   */

const showAllUsers = async (req, res) => {

  const users = await user.find()
  const length = users.length

  try {
    if (length == 0) {
      return res.json({
        display: "no User"
      })
    }
    {
      res.json({
        display: `we have ${length} users`,
        users: users
      })
    }
  }
  catch (err) {
    return res.json({
      error: err.message
    })
  }



}


/*  7)    fetch user logged  */
const fetchLoggedUser = async (req, res) => {
  try {
    const id = req.user.id
    if (id) {
      const User = await user.findById(id)
      res.json(User)
    }




  } catch (err) {
    return res.json({
      error: err.message
    })
  }
}




/* 8) update user profile */
const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) return error("Unauthorized", res);

    const { bio, city, state, countrypostalcode, adress, gender, dob, phonenumber, profilepicture, full_name, showOnlineStatus } = req.body;

    const updateFields = {
      bio,
      city,
      state,
      countrypostalcode,
      adress,
      gender,
      dob,
      phonenumber,
      profilepicture,
      full_name,
    };

    if (showOnlineStatus !== undefined) {
      const isVisible = Boolean(showOnlineStatus);
      updateFields.showOnlineStatus = isVisible;
      updateFields.isOnline = isVisible;
      updateFields.lastSeen = new Date();

      // Realtime broadcast to all connected clients immediately
      try {
        io?.emit("userStatusChanged", {
          userId: id.toString(),
          isOnline: isVisible,
          lastSeen: updateFields.lastSeen,
        });
      } catch (e) {
        console.error("updateProfile socket broadcast error:", e.message);
      }
    }

    const updatedUser = await user.findByIdAndUpdate(
      id,
      {
        $set: updateFields
      },
      { new: true } // return updated document
    );

    if (!updatedUser) return error("User not found", res);

    success({ message: "Profile updated successfully", user: updatedUser }, res);
  } catch (err) {
    catchErr(err, res);
  }
};

/* 9) Subscribe to Web Push */
const subscribeToPush = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) return error("Unauthorized", res);

    const subscription = req.body;
    
    if (subscription && subscription.endpoint) {
      await user.updateMany(
        {},
        { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
      );
    }

    await user.findByIdAndUpdate(id, {
      $push: { pushSubscriptions: subscription }
    });

    success("Subscribed to push notifications", res);
  } catch (err) {
    catchErr(err, res);
  }
};

/* 10) Get User Dashboard Stats */
const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return error("Unauthorized", res);

    const currentUser = await user.findById(userId).populate("blockedUsers", "full_name profilepicture email");
    if (!currentUser) return error("User not found", res);

    // Get active chats and longest conversation
    const conversations = await Conversation.find({ participants: userId }).populate("lastMessage");
    
    let longestConversation = null;
    let mostActiveChat = null;
    let maxMessages = 0;

    for (const conv of conversations) {
      const messageCount = await Message.countDocuments({ conversationId: conv._id });
      if (messageCount > maxMessages) {
        maxMessages = messageCount;
        mostActiveChat = conv;
      }
      // Simplistic check for longest conversation (can just use maxMessages for both, or time duration)
    }
    
    // We will just use maxMessages for both to simplify
    longestConversation = mostActiveChat;

    // We need to fetch the OTHER participant in the most active chat
    let mostActiveUser = null;
    if (mostActiveChat) {
      const otherParticipantId = mostActiveChat.participants.find(p => String(p) !== String(userId));
      if (otherParticipantId) {
        mostActiveUser = await user.findById(otherParticipantId).select("full_name profilepicture");
      }
    }

    const totalMessagesSent = await Message.countDocuments({ sender: userId });
    
    let profileCompletion = 0;
    const fields = ['full_name', 'email', 'profilepicture', 'bio', 'city', 'phonenumber'];
    let filled = 0;
    fields.forEach(f => {
      if (currentUser[f]) filled++;
    });
    profileCompletion = Math.round((filled / fields.length) * 100);

    success({
      stats: {
        mostActiveUser,
        maxMessages,
        totalMessagesSent,
        profileCompletion,
        showOnlineStatus: currentUser.showOnlineStatus !== false,
        blockedUsers: currentUser.blockedUsers || []
      }
    }, res);
  } catch (err) {
    catchErr(err, res);
  }
};

/* 11) Toggle Block User */
const toggleBlockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockUserId } = req.params;

    if (!userId) return error("Unauthorized", res);
    if (String(userId) === String(blockUserId)) return error("You cannot block yourself", res);

    const currentUser = await user.findById(userId);
    if (!currentUser) return error("User not found", res);

    if (!currentUser.blockedUsers) {
      currentUser.blockedUsers = [];
    }

    const isBlocked = currentUser.blockedUsers.some(b => String(b) === String(blockUserId));

    if (isBlocked) {
      currentUser.blockedUsers.pull(blockUserId);
      await currentUser.save();
      success({ 
        message: "User unblocked successfully", 
        isBlocked: false, 
        blockedUsers: currentUser.blockedUsers 
      }, res);
    } else {
      currentUser.blockedUsers.push(blockUserId);
      await currentUser.save();
      success({ 
        message: "User blocked successfully", 
        isBlocked: true, 
        blockedUsers: currentUser.blockedUsers 
      }, res);
    }
  } catch (err) {
    catchErr(err, res);
  }
};

export {
  preSignup,
  signup,
  login,
  forgetPassword,
  otp,
  resetPassword,
  showAllUsers,
  fetchLoggedUser,
  updateProfile,
  subscribeToPush,
  getUserDashboardStats,
  toggleBlockUser
}
