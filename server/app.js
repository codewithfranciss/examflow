const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const examRoutes = require('./routes/exam.routes')
const AdminstudentRoutes = require('./routes/student.routes')
const studentRoutes = require("./routes/user.routes")
const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));

//routes
app.use("/api/auth", authRoutes )
app.use("/api/admin", examRoutes)
app.use("/api/admin", AdminstudentRoutes)
app.use("/api/student", studentRoutes)


module.exports = app;