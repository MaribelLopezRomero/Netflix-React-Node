// const dataMovies = require("./data/movies.json");
// const dataUsers = require("./data/users.json");

const express = require("express");
const cors = require("cors");

//BBDD

const Database = require("better-sqlite3");

// create and config server
const app = express();
app.use(cors());
app.use(express.json());

// init express aplication
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//Crear un servidor estatico
const staticServerPath = "./src/public-react";
app.use(express.static(staticServerPath));

//Crear un servidor estatico para las imagenes
const staticServerImagesPath = "./src/public-movies-images";
app.use(express.static(staticServerImagesPath));

//BBDD

const db = new Database("./src/DB/database.db", {
  verbose: console.log, //muestra por consola todas las consultas que ejecutamos
});

//end-point get /movies

app.get("/movies", (req, res) => {
  //Preparamos la query
  const query = db.prepare(
    `SELECT * FROM movies WHERE gender= ? ORDER BY title ${req.query.sort}`
  );
  const queryAll = db.prepare(
    `SELECT * FROM movies ORDER BY title ${req.query.sort}`
  );

  console.log(req.query.gender);
  let movies = [];
  if (req.query.gender === "") {
    movies = queryAll.all();
  } else {
    movies = query.all(req.query.gender);
  }

  res.json({
    success: true,
    movies,
  });
});

app.post("/login", (req, res) => {
  //Preparamos la base de query
  const query = db.prepare(
    "SELECT * FROM users where email = ? AND password = ?"
  );
  //Ejecutamos la select
  const user = query.get(req.body.email, req.body.password);

  console.log(user);

  //Respuesta
  let response = {};

  if (user === undefined) {
    response = {
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    };
  } else {
    response = {
      success: true,
      userId: user.id,
    };
  }
  res.json(response);
});
