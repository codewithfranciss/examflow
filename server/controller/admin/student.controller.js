const {createStudent} = require("../../services/admin/student.service")

const createStudentController = async(res,req) =>{
    const examId = req.params
    const studentData = req.body
    try{
        const newStudent = createStudent(studentData, examId)
        res.status(201).json({ message: 'Student registered successfully!', student: newStudent });
    }catch(error){
        console.error('Error registering student:', error); 
        if (error.message === 'Exam not found.') {
          return res.status(404).json({ message: error.message }); 
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('matricNo')) {
          return res.status(409).json({ message: 'Student with this matriculation number already exists for this exam.' }); // 409 Conflict
        }
        res.status(500).json({ message: 'Failed to register student.', error: error.message });
      
    }
}

module.exports = {createStudentController}