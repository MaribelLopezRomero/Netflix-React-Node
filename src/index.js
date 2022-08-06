const dataMovies = require("./data/movies.json");
const dataUsers = require("./data/users.json");

const express = require("express");
const cors = require("cors");

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

//end-point get /movies

app.get("/movies", (req, res) => {
  const movies = dataMovies
    .filter((movie) => {
      return movie.gender.includes(req.query.gender);
    })
    .sort((a, b) => {
      if (req.query.sort === "desc") {
        return a.title.localeCompare(b.title) * -1;
      }
      return a.title.localeCompare(b.title);
    });

  res.json({
    success: true,
    movies,
  });
});

app.post("/login", (req, res) => {
  const user = dataUsers.find((user) => {
    return user.email === req.body.email && user.password == req.body.password;
  });
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
