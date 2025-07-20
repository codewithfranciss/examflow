const { getExamsForStudent } = require("../../services/student/student.service")

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

module.exports = { getStudentExamsController };
