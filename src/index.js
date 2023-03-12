// const dataMovies = require("./data/movies.json");
// const dataUsers = require("./data/users.json");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

//BBDD

const Database = require("better-sqlite3");

// create and config server
const app = express();
app.use(cors());
app.use(express.json());

// init express aplication
const serverPort = process.env.PORT || 4000;
console.log("puerto", serverPort);
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

const db = new Database("./DB/database.db", {
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

app.post("/sing-up", (req, res) => {
  //preparamos la query
  const query = db.prepare("INSERT INTO users (email , password) VALUES (?,?)");

  //Comprobamos que no est aregistrada

  const queryComprobar = db.prepare("SELECT * from users where email = ?");

  const resultComprobar = queryComprobar.get(req.body.email);

  let response = {};

  if (resultComprobar === undefined) {
    //Ejecutamos la query
    const result = query.run(req.body.email, req.body.password);
    response = {
      success: true,
      userId: result.lastInsertRowid,
    };
  } else {
    response = {
      errorMessage: "Usuaria ya registrada",
    };
  }

  res.json(response);
});

app.post("/user/profile", (req, res) => {
  console.log(req.body);
  console.log(req.header("user-id"));

  //preparamos la query
  const query = db.prepare(
    "UPDATE users SET email = ?, password= ? WHERE id = ? "
  );

  //ejecutamos la query

  const result = query.run(
    req.body.email,
    req.body.password,
    req.header("user-id")
  );
  res.json({
    success: true,
    result,
  });
});

app.get("/user/profile", (req, res) => {
  //preparamos la query
  const query = db.prepare("SELECT * FROM users where id = ?");
  //Ejecutamos la consulta
  const result = query.get(req.header("user-id"));
  res.json({
    success: true,
    result,
  });
});

app.get("/user/movies", (req, res) => {
  //preparamos la query
  const query = db.prepare(
    "select * from favorites f, movies m where m.id = f.idMovie and f.idUser = ?"
  );

  //Ejecutamos la query
  const result = query.all(req.header("user-id"));

  res.json({
    succes: true,
    movies: result,
  });
});
