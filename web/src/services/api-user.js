//Despliegue en produccion
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "netflix-react-node.herokuapp.com/"
    : "http://localhost:4000";

// login

const sendLoginToApi = (data) => {
  //data son los bodyparams
  console.log("Se están enviando datos al login:", data);
  return fetch(`${serverUrl}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

// signup

const sendSingUpToApi = (data) => {
  console.log("Se están enviando datos al signup:", data);
  return fetch(`${serverUrl}/sing-up`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

// profile

const sendProfileToApi = (userId, data) => {
  console.log("Se están enviando datos al profile:", userId, data);
  return fetch(`${serverUrl}/user/profile`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
  });
};

const getProfileFromApi = (userId) => {
  console.log("Se están pidiendo datos del profile del usuario:", userId);
  return fetch(`${serverUrl}/user/profile`, {
    method: "GET",
    headers: {
      "user-id": userId,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    });
};

// user movies

const getUserMoviesFromApi = (userId) => {
  console.log(
    "Se están pidiendo datos de las películas de la usuaria:",
    userId
  );
  return fetch(`${serverUrl}/user/movies`, {
    method: "GET",
    headers: {
      "user-id": userId,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  sendLoginToApi: sendLoginToApi,
  sendSingUpToApi: sendSingUpToApi,
  sendProfileToApi: sendProfileToApi,
  getProfileFromApi: getProfileFromApi,
  getUserMoviesFromApi: getUserMoviesFromApi,
};

export default objToExport;
