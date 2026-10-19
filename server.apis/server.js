// import express from 'express'
// import products from './routes/products.routes.js'
// import users from './routes/user.routes.js'
// import adsRoute from './routes/ads.Routes.js'
// import orders from './routes/order.routes.js'
// import morgan from 'morgan'
// import cors from 'cors'
// import { createServer } from 'http'
// import { Server } from 'socket.io'
// import messageRoutes from "./routes/message.Routes.js"
// import conversationRoutes from "./routes/conversation.Routes.js"
// import userRoutes from "./routes/cuser.Routes.js"
// import dbconnect from './database/dbconnect.js'
// import User from './models/user.models.js' // ✅ for isOnline update

// const app = express()
// const httpServer = createServer(app)

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:81",
//     methods: ["GET", "POST"],
//   },
// })

// const onlineUsers = new Map()

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id)

//   // ✅ user comes online — update DB
//   socket.on("userOnline", async (userId) => {
//     try {
//       onlineUsers.set(userId, socket.id)
//       await User.findByIdAndUpdate(userId, {
//         isOnline: true,
//         lastSeen: new Date()
//       })
//       io.emit("userStatusChanged", { userId, isOnline: true })
//       console.log("Online:", userId)
//     } catch (err) {
//       console.error("userOnline error:", err)
//     }
//   })

//   // typing indicator
//   socket.on("typing", ({ conversationId, receiverId }) => {
//     const receiverSocketId = onlineUsers.get(receiverId)
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("typing", { conversationId })
//     }
//   })

//   // stop typing
//   socket.on("stopTyping", ({ conversationId, receiverId }) => {
//     const receiverSocketId = onlineUsers.get(receiverId)
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("stopTyping", { conversationId })
//     }
//   })

//   // ✅ user disconnects — update DB
//   socket.on("disconnect", async () => {
//     let disconnectedUserId = null
//     onlineUsers.forEach((socketId, userId) => {
//       if (socketId === socket.id) disconnectedUserId = userId
//     })

//     if (disconnectedUserId) {
//       try {
//         onlineUsers.delete(disconnectedUserId)
//         const now = new Date()
//         await User.findByIdAndUpdate(disconnectedUserId, {
//           isOnline: false,
//           lastSeen: now
//         })
//         io.emit("userStatusChanged", {
//           userId: disconnectedUserId,
//           isOnline: false,
//           lastSeen: now
//         })
//         console.log("Offline:", disconnectedUserId)
//       } catch (err) {
//         console.error("disconnect error:", err)
//       }
//     }
//   })
// })

// export { io, onlineUsers }

// app.use(express.json({ limit: "12mb" }))
// app.use(morgan("dev"))
// app.use(cors())

// app.get("/api/v1", (req, res) => {
//   res.json("api is running")
// })

// app.use("/api/v1/products", products)
// app.use("/api/v1/users", users)
// app.use("/api/v1/orders", orders)
// app.use("/api/v1", adsRoute)
// app.use("/api/v1/messages", messageRoutes)
// app.use("/api/v1/conversations", conversationRoutes)
// app.use("/api/v1/cusers", userRoutes)

// const port = 4321
// httpServer.listen(port, () => {
//   console.log(`The server is running on port http://localhost:${port}/api/v1`)
// })

// dbconnect()
import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";

import dbconnect from "./database/dbconnect.js";

// routes
import users from "./routes/user.routes.js";
import adsRoute from "./routes/ads.Routes.js";
import messageRoutes from "./routes/message.Routes.js";
import conversationRoutes from "./routes/conversation.Routes.js";
import userRoutes from "./routes/cuser.Routes.js";
import adminRoutes from "./routes/admin.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

// models
import User from "./models/user.models.js";

const app = express();
const httpServer = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

// Multi-device & multi-tab socket management
const userSocketsMap = new Map(); // userId -> Set of socketIds

const onlineUsers = {
  get(userId) {
    if (!userId) return undefined;
    const strId = userId.toString();
    const sockets = userSocketsMap.get(strId);
    if (sockets && sockets.size > 0) {
      return `user:${strId}`;
    }
    return undefined;
  },
  has(userId) {
    if (!userId) return false;
    const strId = userId.toString();
    const sockets = userSocketsMap.get(strId);
    return Boolean(sockets && sockets.size > 0);
  },
  set(userId, socketId) {
    if (!userId) return;
    const strId = userId.toString();
    if (!userSocketsMap.has(strId)) {
      userSocketsMap.set(strId, new Set());
    }
    userSocketsMap.get(strId).add(socketId);
  },
  delete(userId) {
    if (!userId) return;
    userSocketsMap.delete(userId.toString());
  },
  entries() {
    return userSocketsMap.entries();
  },
};

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // ================= USER ONLINE & STEALTH PRESENCE =================
  socket.on("userOnline", async (userIdOrData) => {
    let userId = userIdOrData;
    let clientVisibility = undefined;

    if (typeof userIdOrData === "object" && userIdOrData !== null) {
      userId = userIdOrData.userId;
      clientVisibility = userIdOrData.isVisible;
    }

    if (!userId) return;
    const strId = userId.toString();
    socket.userId = strId;
    socket.join(`user:${strId}`);

    const isFirstConnection = !userSocketsMap.has(strId) || userSocketsMap.get(strId).size === 0;
    if (!userSocketsMap.has(strId)) {
      userSocketsMap.set(strId, new Set());
    }
    userSocketsMap.get(strId).add(socket.id);

    if (isFirstConnection) {
      try {
        const currentUser = await User.findById(userId).select("showOnlineStatus");
        // Check if user turned off online presence (Stealth Mode)
        const shouldBroadcastOnline = clientVisibility !== undefined 
          ? Boolean(clientVisibility) 
          : (currentUser?.showOnlineStatus !== false);

        await User.findByIdAndUpdate(userId, {
          isOnline: shouldBroadcastOnline,
          lastSeen: new Date(),
        });

        io.emit("userStatusChanged", {
          userId: strId,
          isOnline: shouldBroadcastOnline,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error("userOnline status update error:", err.message);
      }
    }
  });

  // ================= TOGGLE PRESENCE IN REALTIME =================
  socket.on("togglePresence", async (payload) => {
    const userId = payload?.userId || socket.userId;
    const isVisible = Boolean(payload?.isVisible);
    if (!userId) return;

    const strId = userId.toString();
    try {
      await User.findByIdAndUpdate(userId, {
        showOnlineStatus: isVisible,
        isOnline: isVisible,
        lastSeen: new Date(),
      });

      // Broadcast immediately across all connected users
      io.emit("userStatusChanged", {
        userId: strId,
        isOnline: isVisible,
        lastSeen: new Date(),
      });
    } catch (err) {
      console.error("togglePresence socket error:", err.message);
    }
  });

  // ================= SEND MESSAGE =================
  socket.on("sendMessage", (message) => {
    if (!message || !message.receiverId) return;
    const receiverRoom = onlineUsers.get(message.receiverId);

    // send to receiver instantly across all their devices/tabs
    if (receiverRoom) {
      io.to(receiverRoom).emit("newMessage", message);
    }

    // also sync sender side
    socket.emit("messageSent", message);

    // update chat list instantly
    io.emit("conversationUpdated", {
      conversationId: message.conversationId,
      lastMessage: message.text,
    });
  });

  // ================= TYPING =================
  socket.on("typing", ({ receiverId, conversationId }) => {
    const receiverRoom = onlineUsers.get(receiverId);
    if (receiverRoom) {
      io.to(receiverRoom).emit("typing", { conversationId });
    }
  });

  socket.on("stopTyping", ({ receiverId, conversationId }) => {
    const receiverRoom = onlineUsers.get(receiverId);
    if (receiverRoom) {
      io.to(receiverRoom).emit("stopTyping", { conversationId });
    }
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", async () => {
    const userId = socket.userId;
    if (userId && userSocketsMap.has(userId)) {
      const sockets = userSocketsMap.get(userId);
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        userSocketsMap.delete(userId);
        const lastSeen = new Date();

        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen,
          });

          io.emit("userStatusChanged", {
            userId,
            isOnline: false,
            lastSeen,
          });
        } catch (err) {
          console.error("disconnect status update error:", err.message);
        }
      }
    }

    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// export io (IMPORTANT for controllers)
export { io, onlineUsers };

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "12mb" }));
app.use(cors());
app.use(morgan("dev"));

// ================= ROUTES =================
app.get("/api/v1", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/v1/auth", users);
app.use("/api/v1/users", users);
app.use("/api/v1", adsRoute);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/cusers", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/invites", inviteRoutes);

// ================= DB & START SERVER =================
const PORT = process.env.PORT || 5000;

await dbconnect();

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}/api/v1`);
});