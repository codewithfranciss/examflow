const {
  createExam,
  getAllExam,
  getExamById,
  updateExam
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
    const { id } = req.params;
    const exam = await getExamById(id);

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

    const exam = await updateExam(id, updateData);

    res.status(200).json({ message: "Exam updated successfully", exam });
  } catch (error) {
    console.error("Update Exam Error:", error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(500).json({ error: "Failed to update exam" });
  }
};

module.exports = {
  createExamController,
  fetchAllExam,
  fetchExamById, 
  updateExamController
};
