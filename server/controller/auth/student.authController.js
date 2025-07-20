const {LoginStudentService} = require("../../services/auth/student.service")

const loginStudentController = async(req,res) => {
    const {matricNo, password} = req.body
    try{
    const student = await LoginStudentService(matricNo,password)
    res.status(200).json({
        message: "logged in successfully",
        student
    });
} catch(err){
    res.status(401).json({
        message: err.message,
})
}
}

module.exports = {loginStudentController}