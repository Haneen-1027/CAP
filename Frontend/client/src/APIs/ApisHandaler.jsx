import React from "react";
import axios from "axios";

/////////

const BASE_URL = "https://localhost:7199";

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

/** */
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
  return await axios.put(
    `${BASE_URL}/questions/${question.QuestionId}`,
    question,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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

/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
