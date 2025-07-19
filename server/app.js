const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const examRoutes = require('./routes/exam.routes')
const studentRoutes = require('./routes/student.routes')
const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://192.168.100.29:3000', 
    credentials: true
  }));

//routes
app.use("/api/admin", authRoutes )
app.use("/api/admin", examRoutes)
app.use("/api/admin", studentRoutes)


module.exports = app;