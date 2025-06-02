import React from "react";
import axios from "axios";

/////////

const BASE_URL = "http://localhost:5104";

//
export const loginUser = async (email, password) => {
  return await axios.post(
    `${BASE_URL}/auth/login`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/** Questions */
//
export const addNewQuestion = async (question) => {
  return await axios.post(`${BASE_URL}/questions`, question, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//
export const updateQuestion = async (question) => {
  return await axios.put(`${BASE_URL}/questions/${question.id}`, question, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//
export const getAllQuestions = async () => {
  return await axios.get(`${BASE_URL}/questions`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAllQuestionsByFilter = async (page = 1, pageSize = 10, category = "", questionType = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/questions/filter`, {
      params: {
        page,           
        limit: pageSize,
        category,     
        type: questionType      
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error; 
  }
};

//
export const deleteQuestion = async (id) => {
  return await axios.delete(`${BASE_URL}/questions/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//
export const getQuestionById = async (id) => {
  return await axios.get(`${BASE_URL}/questions/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Assessment APIs:

export const addNewAssessment = async (assessment) => {
  // Note to improve: 1. options count. 2. date and time
  return await axios.post(`${BASE_URL}/assessments`, assessment, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAllAssessments = async () => {
  return await axios.get(`${BASE_URL}/assessments`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAssessmentById = async (id) => {
  return await axios.get(`${BASE_URL}/assessments/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateAssessment = async (id, updatedData) => {
  return await axios.put(`${BASE_URL}/assessments/${id}`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteAssessment = async (id) => {
  return await axios.delete(`${BASE_URL}/assessments/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/** Users' APIs */
export const getUsers = async (
  page = 1,
  pageSize = 10,
  searchTerm = "",
  roleFilter = ""
) => {
  return await axios.get(`${BASE_URL}/users`, {
    params: {
      page,
      pageSize,
      searchTerm,
      roleFilter: roleFilter !== -999 ? roleFilter : "", // Send empty string for "All"
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getUserByID = async (id) => {
  return await axios.get(`${BASE_URL}/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const addUser = async (user) => {
  return await axios.post(`${BASE_URL}/users`, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const deleteUser = async (id) => {
  return await axios.delete(`${BASE_URL}/users`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/** Code Execution API */
export const executeCode = async (questionId, sourceCode, languageId) => {
  return await axios.post(
    `${BASE_URL}/Code/execute/${questionId}`,
    { sourceCode, languageId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/** submision api */
export const submitAssessment = async (assessmentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/submissions`,
      assessmentData,
      {
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error submitting assessment:", error);
    throw error;
  }
};

export const getAttempts = async (id) => {
  console.log(
    "Fetching from URL: ",
    `${BASE_URL}/Submissions/assessment/${id}`
  );
  return await axios.get(`${BASE_URL}/api/Submissions/assessment/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateSubmissionMark = async (userId, assessmentId, questionId, mark) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/submissions/update-mark`, {
      UserId: userId,
      AssessmentId: assessmentId,
      QuestionId: questionId,
      Mark: mark
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating mark:', error);
    throw error;
  }
};
/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
