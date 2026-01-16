const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/supporters", require("./routes/supporterRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));


module.exports = app;
