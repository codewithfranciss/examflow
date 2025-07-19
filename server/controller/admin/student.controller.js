const { createStudent, bulkRegisterStudents } = require("../../services/admin/student.service");

const createStudentController = async (req, res) => {
  const { examId } = req.params;
  const studentData = req.body;

  try {
    const newStudent = await createStudent(studentData, examId); 
    res.status(201).json({ message: "Student registered successfully!", student: newStudent });
  } catch (error) {
    console.error("Error registering student:", error);

    if (error.message === "Exam not found.") {
      return res.status(404).json({ message: error.message });
    }

    if (error.code === "P2002" && error.meta?.target?.includes("matricNo")) {
      return res.status(409).json({ message: "Student with this matric number already exists for this exam." });
    }

    res.status(500).json({ message: "Failed to register student.", error: error.message });
  }
};

const bulkUploadStudents = async (req, res) => {
    const { examId } = req.params;
     const studentsData = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ message: 'Invalid data: "studentsData" must be a non-empty array.' });
    }
    if (!examId) {
      return res.status(400).json({ message: 'Exam ID is required.' });
    }
  
    // Optional: More detailed validation for each student object in the array
    const isValidBatch = studentsData.every(s =>
      s.matricNo && s.password && s.department && s.lecturer
    );
    if (!isValidBatch) {
        return res.status(400).json({ message: 'Each student in the batch must have matricNo, password, department, and lecturer.' });
    }
  
    try {
      const uploadResults = await bulkRegisterStudents(studentsData, examId);
      res.status(200).json({
        message: 'Bulk student upload processed successfully.',
        summary: uploadResults,
      });
    } catch (error) {
      console.error('Error during bulk student upload:', error); 
      if (error.message === 'Exam not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Failed to process bulk student upload.', error: error.message });
    }
  };

module.exports = { createStudentController, bulkUploadStudents};
