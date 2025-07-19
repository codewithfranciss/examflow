const prisma = require('../../config/db')

const createStudent = async(studentData, examId) =>{
  
    const exam = await prisma.exam.findUnique({
        where: {id: examId}
    })

    if(!exam){
        throw new Error('Exam not found.'); 
    }

    const student = await prisma.student.create({
        data: {
            matricNo: studentData.matricNo,
            password: studentData.password, 
            department: studentData.department,
            lecturer: studentData.lecturer,
            exam:{
                connect: {id: examId}
            }
        }
    })
    return student;
}

module.exports ={createStudent}