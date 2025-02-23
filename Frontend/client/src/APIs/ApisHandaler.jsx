import React from "react";
import axios from "axios";

/////////
export const addNewQuestion = async (question) =>{
  return await axios.post("http://localhost:5050/api/questions/add",question, {headers: {
    "Content-Type": "application/json", // Ensure this header is set
  },});
};
/////////
const ApisHandale = () => {
  return <div>ApisHandle Component</div>;
};

export default ApisHandale;
