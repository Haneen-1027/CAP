import React from "react";
import axios from "axios";

/////////

const BASE_URL = "http://localhost:5104/api"

export const addNewQuestion = async (question) =>{
  return await axios.post(`${BASE_URL}/questions/add`,question, {headers: {
    "Content-Type": "application/json", // Ensure this header is set
  },});
};
/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
