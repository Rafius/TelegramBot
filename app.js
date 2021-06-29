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

  const urlGrades = "https://campus.uoc.edu/gateway/rest/expedient//notes?jsonpCallback=jQuery110208715038080389803_1624980614657&version=1&session=3e7aacc8198b039f56c1932b588bf40717519c8e2b416f83d15063f438c082efc9276fb0f462a4a7fdf203cb548c0e9f8c8331f85e5fc0108040eea45f7131e6&idp=&lang=es&JSONObject=%7B%22version%22%3A%221%22%2C%22session%22%3A%223e7aacc8198b039f56c1932b588bf40717519c8e2b416f83d15063f438c082efc9276fb0f462a4a7fdf203cb548c0e9f8c8331f85e5fc0108040eea45f7131e6%22%2C%22idp%22%3A%22%22%2C%22lang%22%3A%22es%22%2C%22anyAcademic%22%3A%2220202%22%7D&_=1624980614658"
  axios
  .get(urlGrades)
  .then(response => {
    grades = JSON.parse(response.data.split("(")[1].slice(0, -2))
    grades.cursos[0].assignatures.forEach((subjects) => {
      console.log(`${subjects.descripcion}: ${subjects.notaFinal}`)
      if(subjects.notaFinal != "-"){
        telegram(`${subjects.descripcion}: ${subjects.notaFinal}`);
      }
    })
    console.log("-------------------------------------------------------------------------------------------------------------------")
  })
  .catch(error => {
    console.log(error);
  });
}


const getGradesTimeout = () => {

  getGrades()
  setInterval(()=>{
    getGrades()
  }, seconds * 1000);
}

//getSession();
getGradesTimeout()
