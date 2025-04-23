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
export const getUsers = async () => {
  return await axios.get(`${BASE_URL}/users`, {
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
/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
