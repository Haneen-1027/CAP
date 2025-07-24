import React, { useEffect, useState } from "react";
import Joi from "joi";
import { addNewQuestion, updateQuestion } from "../../../../APIs/ApisHandaler";
import {
  BackBtn,
  Coding,
  FilterableDropdown,
  MultipleChoice,
} from "../../../../componentsLoader/ComponentsLoader";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert

export default function AddQuestion({ userdetails, darkMode }) {
  const location = useLocation();
  const { data } = location.state || {};
  const { id } = useParams();
  const [question, setQuestion] = useState({
    type: "essay",
    category: "HTML",
    prompt: "",
    details: {},
  });
  const [details, setQuestionDetails] = useState({});
  const [codingDescription, setCodingDescription] = useState(
    "This is a defualt description"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [apiLoading, setApiLoading] = useState(false);

  //
  let [errorList, setErrorList] = useState([]);
  let [apiMessage, setApiMessage] = useState("ss");
  let [apiError, setApiError] = useState(false);

  //
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  const categories = [
    // Programming Languages
    { name: "Python", value: "Python" },
    { name: "JavaScript", value: "JavaScript" },
    { name: "TypeScript", value: "TypeScript" },
    { name: "Java", value: "Java" },
    { name: "C++", value: "C++" },
    { name: "C#", value: "C#" },
    { name: "Go", value: "Go" },
    { name: "Dart", value: "Dart" },
    { name: "SQL", value: "SQL" },
    { name: "Verilog", value: "Verilog" },
    { name: "PHP", value: "PHP" },
    { name: "Ruby", value: "Ruby" },
    { name: "Swift", value: "Swift" },
    { name: "Kotlin", value: "Kotlin" },
    { name: "Rust", value: "Rust" },
    { name: "Scala", value: "Scala" },
    { name: "R", value: "R" },
    { name: "MATLAB", value: "MATLAB" },
    { name: "Perl", value: "Perl" },
    { name: "Haskell", value: "Haskell" },
    { name: "Lua", value: "Lua" },
    { name: "Assembly", value: "Assembly" },
    
    // Frontend Technologies
    { name: "HTML", value: "HTML" },
    { name: "CSS", value: "CSS" },
    { name: "React", value: "React" },
    { name: "Angular", value: "Angular" },
    { name: "Vue.js", value: "Vue.js" },
    { name: "jQuery", value: "jQuery" },
    { name: "Bootstrap", value: "Bootstrap" },
    { name: "Tailwind CSS", value: "Tailwind CSS" },
    { name: "Sass/SCSS", value: "Sass/SCSS" },
    { name: "Next.js", value: "Next.js" },
    { name: "Nuxt.js", value: "Nuxt.js" },
    { name: "Svelte", value: "Svelte" },
    { name: "Webpack", value: "Webpack" },
    { name: "Vite", value: "Vite" },
    { name: "UI/UX", value: "UI/UX" },
    
    // Backend Technologies
    { name: "Node.js", value: "Node.js" },
    { name: "Express.js", value: "Express.js" },
    { name: "Django", value: "Django" },
    { name: "Flask", value: "Flask" },
    { name: "Spring Boot", value: "Spring Boot" },
    { name: "ASP.NET", value: "ASP.NET" },
    { name: "Laravel", value: "Laravel" },
    { name: "FastAPI", value: "FastAPI" },
    { name: "Gin", value: "Gin" },
    { name: "Echo", value: "Echo" },
    { name: "Ruby on Rails", value: "Ruby on Rails" },
    { name: "Symfony", value: "Symfony" },
    
    // Databases
    { name: "MySQL", value: "MySQL" },
    { name: "PostgreSQL", value: "PostgreSQL" },
    { name: "MongoDB", value: "MongoDB" },
    { name: "Redis", value: "Redis" },
    { name: "SQLite", value: "SQLite" },
    { name: "Oracle", value: "Oracle" },
    { name: "SQL Server", value: "SQL Server" },
    { name: "Cassandra", value: "Cassandra" },
    { name: "Elasticsearch", value: "Elasticsearch" },
    { name: "Neo4j", value: "Neo4j" },
    
    // DevOps & Cloud
    { name: "Docker", value: "Docker" },
    { name: "Kubernetes", value: "Kubernetes" },
    { name: "AWS", value: "AWS" },
    { name: "Azure", value: "Azure" },
    { name: "Google Cloud", value: "Google Cloud" },
    { name: "Terraform", value: "Terraform" },
    { name: "Ansible", value: "Ansible" },
    { name: "Jenkins", value: "Jenkins" },
    { name: "GitLab CI", value: "GitLab CI" },
    { name: "GitHub Actions", value: "GitHub Actions" },
    { name: "Nginx", value: "Nginx" },
    { name: "Apache", value: "Apache" },
    
    // Data Science & AI
    { name: "Data Science", value: "Data Science" },
    { name: "Machine Learning", value: "Machine Learning" },
    { name: "Deep Learning", value: "Deep Learning" },
    { name: "Computer Vision", value: "Computer Vision" },
    { name: "Natural Language Processing", value: "Natural Language Processing" },
    { name: "Generative AI", value: "Generative AI" },
    { name: "AI Explainability", value: "AI Explainability" },
    { name: "TensorFlow", value: "TensorFlow" },
    { name: "PyTorch", value: "PyTorch" },
    { name: "Scikit-learn", value: "Scikit-learn" },
    { name: "Pandas", value: "Pandas" },
    { name: "NumPy", value: "NumPy" },
    { name: "Matplotlib", value: "Matplotlib" },
    { name: "Seaborn", value: "Seaborn" },
    { name: "Jupyter", value: "Jupyter" },
    
    // Testing & QA
    { name: "Quality Assurance", value: "Quality Assurance" },
    { name: "Unit Testing", value: "Unit Testing" },
    { name: "Integration Testing", value: "Integration Testing" },
    { name: "End-to-End Testing", value: "End-to-End Testing" },
    { name: "Test Automation", value: "Test Automation" },
    { name: "Selenium", value: "Selenium" },
    { name: "Jest", value: "Jest" },
    { name: "JUnit", value: "JUnit" },
    { name: "PyTest", value: "PyTest" },
    { name: "Cypress", value: "Cypress" },
    { name: "Playwright", value: "Playwright" },
    
    // Mobile Development
    { name: "React Native", value: "React Native" },
    { name: "Flutter", value: "Flutter" },
    { name: "iOS Development", value: "iOS Development" },
    { name: "Android Development", value: "Android Development" },
    { name: "Xamarin", value: "Xamarin" },
    
    // Other Technologies
    { name: "GraphQL", value: "GraphQL" },
    { name: "REST API", value: "REST API" },
    { name: "Microservices", value: "Microservices" },
    { name: "Serverless", value: "Serverless" },
    { name: "Blockchain", value: "Blockchain" },
    { name: "Cybersecurity", value: "Cybersecurity" },
    { name: "Linux", value: "Linux" },
    { name: "Git", value: "Git" },
    { name: "Agile", value: "Agile" },
    { name: "Scrum", value: "Scrum" },
    { name: "System Design", value: "System Design" },
    { name: "Algorithms", value: "Algorithms" },
    { name: "Data Structures", value: "Data Structures" },
    { name: "Computer Networks", value: "Computer Networks" },
    { name: "Operating Systems", value: "Operating Systems" },
  ];

  //
  /* Validation Function */
  function validateForm() {
    const Schema = Joi.object({
      id: Joi.number(),
      type: Joi.string().trim().min(2).max(100).required(),
      category: Joi.string().trim().min(2).max(35).required(),
      prompt: Joi.string().required(),
      details: Joi.object(),
    });
    return Schema.validate(question, { abortEarly: false });
  }

  //
  const handleGeneralChange = (e) => {
    setApiError(false);
    setApiMessage(null);
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const addQuestion = async () => {
    // First show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: isEditing 
        ? 'You are about to update this question' 
        : 'You are about to add a new question',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isEditing ? 'Yes, update it!' : 'Yes, add it!',
      cancelButtonText: 'No, cancel!'
    });

    // If user cancels, return early
    if (!result.isConfirmed) {
      return;
    }

    setApiLoading(true);
    // Call Validation Function
    let validateResult = validateForm();
    if (validateResult.error) {
      setErrorList(validateResult.error.details);
      setApiLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const newDetails = { ...details, description: codingDescription };
    const newQuestion = {
      ...question,
      ["details"]: newDetails,
    };

    try {
      if (isEditing) {
        console.log("question before update:", newQuestion);
        await updateQuestion(newQuestion);
        setApiMessage("The Question Updated Successfully!");
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your question has been updated.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        console.log("question before add:", newQuestion);
        await addNewQuestion(newQuestion);
        setApiMessage("The Question Added Successfully!");
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Your question has been added.',
          confirmButtonColor: '#3085d6',
        });
        setQuestion({
          type: "",
          category: "",
          prompt: "",
          details: {},
        });
        setQuestionDetails({});
        setCodingDescription("This is a defualt description");
        setErrorList([]);
        setApiMessage("");
        setApiError(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setApiError(true);
      setApiMessage("There is an Error! Please try again later.");
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error processing your request. Please try again later.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setApiLoading(false);
    }
  };


  ////////////////////
  useEffect(() => {
    if (location.pathname === "/admin/questions_bank/add_question") {
      setIsEditing(false);
      setQuestion({
        type: "essay",
        category: "HTML",
        prompt: "",
        details: {},
      });
      setQuestionDetails({});
      setCodingDescription("This is a defualt description");
      setErrorList([]);
      setApiMessage("");
      setApiError(false);
      setIsLoading(false);
    } else if (id && data) {
      setIsEditing(true);
      setQuestion(data);
      setQuestionDetails(data.details || {});
    }
  }, [location]);

  // Track when the question state is fully set
  useEffect(() => {
    if (isEditing && question.type && question.category && question.prompt) {
      setIsLoading(false); // Data is ready
    }
  }, [question, isEditing]);
  useEffect(() => {
    setApiError(false);
    setApiMessage("");
  }, [question]);

  ////////////////////
  return (
    <>
      {isEditing ? (
        <div className="mx-3 mt-4">
          {" "}
          <BackBtn />
        </div>
      ) : (
        ""
      )}
      <div className="position-relative p-4 d-flex flex-column">
        {apiMessage ? (
          <div
            className={`alert ${
              apiError ? "alert-danger" : "alert-success"
            } text-center p-3`}
          >
            {apiMessage}
          </div>
        ) : (
          ""
        )}
        <div className="row flex-column flex-md-row align-items-center m-0">
          <div className="col-12 col-md-6 row m-0 justify-content-between">
            <div className="col-12 col-lg-5 form-floating p-0">
              {" "}
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Type:"}
                items={questionTypes}
                handleFunction={handleGeneralChange}
                name={"type"}
                isDisabled={isEditing}
                selectedValue={question.type}
              />
            </div>
            <div className="col-12 col-lg-5 form-floating p-0">
              {" "}
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Category:"}
                items={categories}
                handleFunction={handleGeneralChange}
                name={"category"}
                selectedValue={question.category}
              />
            </div>
          </div>
        </div>
        <div className="w-50 position-relative my-3">
          {" "}
          <hr className="bold-hr mid-aligment" />
        </div>
        {errorList.map((error, index) => (
          <div key={index} className="alert alert-danger">
            {" "}
            {error.message}{" "}
          </div>
        ))}
        <div className={`details d-flex flex-column flex-start`}>
          <div
            className={`row ${
              question["type"] === "coding"
                ? "justify-content-between"
                : "justify-content-center"
            } `}
          >
            <div
              className={`col-12 ${
                question["type"] === "coding" ? "col-md-5" : "col-md-8"
              } form-group`}
            >
              <label className="h5 mid-bold" htmlFor="prompt">
                Question:
              </label>
              <textarea
                className="form-control my-2"
                id="prompt"
                name="prompt"
                placeholder="Question ..."
                onChange={(e) => handleGeneralChange(e)}
                value={question.prompt}
              />
            </div>
            {question["type"] === "coding" ? (
              <div className="col-12 col-md-6 form-group">
                <label className="h5 mid-bold" htmlFor="prompt">
                  Description:
                </label>
                <textarea
                  className="form-control my-2"
                  id="description"
                  name="description"
                  placeholder="Brief Description about the Problem ..."
                  onChange={(e) => setCodingDescription(e.target.value)}
                  value={codingDescription}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {isLoading ? (
            <div>Loading...</div> // Show a loading indicator while data is being loaded
          ) : question["type"] === "mc" && question.details ? (
            <MultipleChoice
              darkMode={darkMode}
              setQuestionDetails={setQuestionDetails}
              detailes={
                isEditing
                  ? { ...question.details }
                  : {
                      isTrueFalse: false,
                      correctAnswer: [],
                      wrongOptions: [],
                    }
              }
            />
          ) : question["type"] === "essay" ? (
            <div></div>
          ) : question["type"] === "coding" ? (
            <Coding
              darkMode={darkMode}
              setQuestionDetails={setQuestionDetails}
              isEditing={isEditing}
              details={
                isEditing
                  ? data.details
                  : {
                      inputsCount: 0,
                      testCases: [
                        {
                          expectedOutput: "",
                          inputs: [],
                        },
                      ],
                    }
              }
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="mid-aligment d-flex justify-content-center w-50 my-4">
          <button
            type="submit"
            className="btn btn-success"
            onClick={() => addQuestion()}
            disabled={apiLoading}
          >
            {isEditing
              ? apiLoading
                ? "Updating ..."
                : "Update Question"
              : apiLoading
              ? "Adding ..."
              : "Add Question"}
          </button>
        </div>
      </div>
    </>
  );
}