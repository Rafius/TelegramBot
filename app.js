const axios = require("axios");
const telegram = require("./bot");
require('dotenv').config({path:'.env'})

const url = "https://cv.uoc.edu/webapps/cas/login";
const seconds = 60
let sessionId
const uri_data = map => {
  var str = "";
  for (var v in map) {
    str += v + "=" + map[v] + "&";
  }
  return str.slice(0, -1);
};

const getLt = () => {
  let lt, execution
  axios
    .get(url)
    .then(response => {
      lt = response.data.match(/name="lt" value="([^"]+)"/)[1];
      execution = response.data.match(
        /name="execution" value="([^"]+)"/
      )[1];
    })
    .catch(error => {
      console.error(error);
    });
  return { lt, execution }
};

const parseSession = response => {
  sessionId = response.data.match(/campusSessionId = ([^\n]*)/);
  if (campusSessionId) sessionId = campusSessionId[1];
};

const getSession = () => {
  const { lt, execution } = getLt()
  const data =  {
    username: process.env.username,
    password: process.env.password,
    lt,
    execution,
    _eventId: "submit"
  }
  console.log(data)
  axios
  .post(url,
    uri_data(data),{
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*"
    }
  })
  .then(response => {
    parseSession(response);
  });
}

const getGrades = () => {
  const skipSubject = []
  const gradesDictionary = {
    "M": "Matrícula de Honor",
    "EX": "Sobresaliente",
    "NO": "Notable",
    "A": "Aprobado",
    "SU": "Suspenso",
    "-": ""
  }

  const urlGrades = process.env.URL

  axios
  .get(urlGrades)
  .then(response => {
    grades = JSON.parse(response.data.split("(")[1].slice(0, -2))
    grades.cursos[0].assignatures.forEach((subjects) => {
      if(!skipSubject.includes(subjects.descripcion)){
        console.log(`${subjects.descripcion}: ${gradesDictionary[subjects.notaFinal]}`)
        if(subjects.notaFinal != "-"){
          telegram(`${subjects.descripcion}: ${gradesDictionary[subjects.notaFinal.toUpperCase()]}`);
        }
      }
    })
    console.log("-------------------------------------------------------------------------------------------------------------------")
  })
  .catch(error => {
    console.log(error);
  });
}


const getGradesTimeout = () => {
  setInterval(()=>{
    getGrades()
  }, seconds * 1000);
}

//getSession();
getGrades()
getGradesTimeout()
