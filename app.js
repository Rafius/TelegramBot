const axios = require("axios");
const telegram = require("./bot");
require("dotenv").config({ path: ".env" });

const seconds = 60;

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

  const urlGrades =
    "https://campus.uoc.edu/gateway/rest/expedient//notes?jsonpCallback=jQuery110205835194528568246_1655465515065&version=1&session=0eb2e88bd224cdcf079e1b3130d78d809d2acfde69d0b72edda89a4c0d8c180b844f571effae500299f61e5e831e20523379545f90872b31cba9ec33bdd57fc4&idp=&lang=es&anyAcademic=20212&JSONObject=%7B%22version%22%3A%221%22%2C%22session%22%3A%220eb2e88bd224cdcf079e1b3130d78d809d2acfde69d0b72edda89a4c0d8c180b844f571effae500299f61e5e831e20523379545f90872b31cba9ec33bdd57fc4%22%2C%22idp%22%3A%22%22%2C%22lang%22%3A%22es%22%2C%22anyAcademic%22%3A%2220212%22%7D&_=1655465515066";
  axios
    .get(urlGrades)
    .then((response) => {
      //console.log(response.data.split("(").slice(1).join("").slice(0, -2));
      grades = JSON.parse(
        response.data.split("(").slice(1).join("").slice(0, -2)
      );
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      console.log(`${hours}:${minutes}:${seconds}`);

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

getGrades();
getGradesTimeout();
