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

const bulkRegisterStudents = async (studentsData, examId) => {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });
  
    if (!exam) {
      throw new Error("Exam not found");
    }
    const seenMatricNos = new Set(); 
    const studentsToInsert = [];    

    for (const student of studentsData) {
      if (!seenMatricNos.has(student.matricNo)) {
        seenMatricNos.add(student.matricNo);
        studentsToInsert.push({
          matricNo: student.matricNo,
          password: student.password, 
          department: student.department,
          lecturer: student.lecturer,
          examId, 
        });
      }
    }
    const result = await prisma.student.createMany({
      data: studentsToInsert,
      skipDuplicates: true,
    });

    return {
      message: "Bulk upload complete",
      totalReceived: studentsData.length, 
      totalInserted: result.count,       
      duplicatesIgnoredInBatch: studentsData.length - studentsToInsert.length,
      result
    };
  };
module.exports ={createStudent, bulkRegisterStudents}