const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const is_showing = req.query.is_showing === "true";
  //console.log("is_showing query parameter: ", is_showing);
  const data = await service.list(is_showing);
  //console.log("Movies List: ", data);
  res.json({ data });
}

async function read(req, res, next) {
  const [movie] = res.locals.movie; 
  res.json({ data: movie });
}

async function movieExists(req, res, next) {
  let { movieId } = req.params;
  movieId = parseInt(movieId, 10);
  const movie = await service.read(movieId);
  console.log("found movie ", movie);
  if (movie&& Object.keys(movie).length > 0) {
    //console.log("in");
    res.locals.movie = movie;
    return next();
  }
  //console.log ("out");
  next({ status: 404, message: `Movie cannot be found.` });
}

async function readTheaters(req, res, next) {
  const { movieId } = req.params;
  //console.log ("In readTheaters");
  const data = await service.readTheaters(movieId);
  res.json({ data });
}

async function readReviews(req, res, next) {
  const { movieId } = req.params;
  const data = await service.readReviews(movieId);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
  readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
};