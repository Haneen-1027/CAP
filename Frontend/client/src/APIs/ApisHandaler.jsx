import React from "react";
import axios from "axios";

/////////

const BASE_URL = "http://localhost:5104"

export const addNewQuestion = async (question) =>{
  return await axios.post(
    `${BASE_URL}/questions/add`,
    question, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const loginUser = async (email, password) =>{
  return await axios.post(
    `${BASE_URL}/auth/login`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
