const axios = require("axios");
const telegram = require("./bot");

const url = "https://cv.uoc.edu/webapps/cas/login";
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
  const urlGrades = `https://campus.uoc.edu/gateway/rest/expedient//notes?jsonpCallback=jQuery1102017702908127924988_1624966386647&version=1&session=${sessionId}&idp=&lang=es&JSONObject=%7B%22version%22%3A%221%22%2C%22session%22%3A%228e507cc6393ac342c69c23b428fb74d2d7605c4c0b206f626178a3e2e83a921549319f84a42624269d3ec32084b59ee41c950110dea1a01400b57e901f07f1e4%22%2C%22idp%22%3A%22%22%2C%22lang%22%3A%22es%22%2C%22anyAcademic%22%3A%2220202%22%7D&_=1624966386648"`

  axios
  .get(urlGrades)
  .then(response => {
    grades = JSON.parse(response.data.split("(")[1].slice(0, -2))
    grades.cursos[0].assignatures.forEach((subjects) => {
      if(subjects.notaFinal != "1-"){
        telegram(msn= `${subjects.descripcion}: ${subjects.notaFinal}`);
      }
    })
  })
  .catch(error => {
    console.error(error);
  });
}

//getSession();
getGrades();