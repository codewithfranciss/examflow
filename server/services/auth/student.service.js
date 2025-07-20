const prisma = require('../../config/db');

const LoginStudentService = async(matricNo, password) =>{
    const student = await prisma.student.findFirst({
        where: {matricNo}
    })

    if(!student){throw new Error("Invalid user and password")}

    if(password !== student.password){
        throw new Error("Invalid user and password")
    }

    return student.matricNo;
}

module.exports = {LoginStudentService}