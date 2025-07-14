const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const examRoutes = require('./routes/exam.routes')
const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));

//routes
app.use("/api/admin", authRoutes )
app.use("/api/admin", examRoutes)

module.exports = app;