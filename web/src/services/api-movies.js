//Despliegue en produccion
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "netflix-react-node.herokuapp.com/"
    : "http://localhost:4000";

const getMoviesFromApi = (params) => {
  console.log("Se están pidiendo las películas de la app");
  return fetch(
    `${serverUrl}/movies?gender=${params.gender}&sort=${params.sort}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
