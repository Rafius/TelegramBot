const axios = require("axios");
const telegram = require("./bot");
require("dotenv").config({ path: ".env" });

const seconds = 2;

const getGrades = () => {
  const skipSubject = [];
  const gradesDictionary = {
    M: "Matrícula de Honor",
    EX: "Sobresaliente",
    NO: "Notable",
    A: "Aprobado",
    SU: "Suspenso",
    "-": ""
  };

  const urlGrades = process.env.URL;

  axios
    .get(urlGrades)
    .then((response) => {
      //console.log(response.data.split("(").slice(1).join("").slice(0, -2));
      grades = JSON.parse(
        response.data.split("(").slice(1).join("").slice(0, -2)
      );
      grades.cursos[0].assignatures.forEach((subjects) => {
        if (!skipSubject.includes(subjects.descripcion)) {
          const subjectDescription = `${subjects.descripcion}: ${
            gradesDictionary[subjects.notaFinal]
          }`;
          console.log(subjectDescription);
          if (subjects.notaFinal != "-") {
            telegram(subjectDescription);
          }
        }
      });
      console.log(
        "-------------------------------------------------------------------------------------------------------------------"
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

const getGradesTimeout = () => {
  setInterval(() => {
    getGrades();
  }, seconds * 1000);
};

//getGrades();
getGradesTimeout();
