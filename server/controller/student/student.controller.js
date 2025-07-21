const { getExamsForStudent, submitExam } = require("../../services/student/student.service")

const getStudentExamsController = async (req, res) => {
  const { matricNo } = req.params;

  try {
    const exams = await getExamsForStudent(matricNo);
    return res.status(200).json({ exams });
  } catch (error) {
    console.error("Error fetching exams:", error.message);
    return res.status(404).json({ message: error.message });
  }
};


const submitExamController = async (req, res) => {
  try {
    const result = await submitExam(req.body)
    return res.status(200).json(result)
  } catch (err) {
    if (err.message === "You have already submitted this exam.") {
      return res.status(409).json({ error: err.message })
    }

    if (err.message === "Exam not found.") {
      return res.status(404).json({ error: err.message })
    }

    if (err.code === "P2002") {
      return res.status(409).json({ error: "You have already submitted this exam." })
    }

    console.error("❌ Submission Error:", err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}


module.exports = { getStudentExamsController, submitExamController };
