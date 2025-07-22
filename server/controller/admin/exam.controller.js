const {
  createExam,
  getAllExam,
  getExamById,
  editExam,
  deleteExam,
  fetchPerformanceByExamId
} = require("../../services/admin/exam.service");

const createExamController = async (req, res) => {
  try {
    const exam = await createExam(req.body);
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ error: "Failed to create exam" });
  }
};

const fetchAllExam = async (req, res) => {
  try {
    const exams = await getAllExam();

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found" });
    }

    res.status(200).json({ exams });
  } catch (error) {
    console.error("Error fetching exams:", error); 
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

const fetchExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await getExamById(examId);
   

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ exam });
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ message: "Failed to fetch exam" });
  }
};


const updateExamController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exam = await editExam(id, updateData);

    res.status(200).json({ message: "Exam updated successfully", exam });
  } catch (error) {
    console.error("Update Exam Error:", error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(500).json({ error: "Failed to update exam" });
  }
};

const deleteExamController = async (req, res) => {
  const { examId } = req.params

  try {
    const result = await deleteExam(examId)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(err.message === "Exam not found" ? 404 : 500).json({ error: err.message })
  }
}

const getStudentPerformanceController = async (req, res) => {
  const { examId } = req.params

  if (!examId) return res.status(400).json({ error: 'Exam ID is required' })

  try {
    const performance = await fetchPerformanceByExamId(examId)

    res.json({
      success: true,
      students: performance.map((p) => ({
        id: p.id,
        matricNo: p.matricNo,
        name: p.fullName,
        department: p.department,
        lecturer: p.lecturer,
        score: p.score,
        status: "completed", // since they're in studentPerformance
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch student performance' })
  }
}

module.exports = {
  createExamController,
  fetchAllExam,
  fetchExamById, 
  updateExamController,
  deleteExamController,
  getStudentPerformanceController
};
