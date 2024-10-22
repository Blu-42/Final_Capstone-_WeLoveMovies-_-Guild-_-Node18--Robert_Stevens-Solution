const db = require("../db/connection");

async function list(is_showing) {
  console.log("is_showing value: ", is_showing);

  let query = db("movies").select("movies.*");

  if (is_showing) {
    console.log("is_showing is true, modifying query to join movies_theaters");
    query = query
      .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
      .where({ "movies_theaters.is_showing": true })
      .groupBy("movies.movie_id");
  }

  const result = await query;
  console.log("Query result: ", result);
  return result;
}

async function read(movieId) {
  const parsedMovieId = parseInt(movieId, 10);
  
  const result = await db("movies").select("*").where({ movie_id: parsedMovieId });
  
  
  
  return result;
  
  
}

async function readTheaters(movie_id) {
  return db("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
    .where({ "movies_theaters.movie_id": movie_id, "movies_theaters.is_showing": true })
    .select("theaters.*", "movies_theaters.is_showing", "movies_theaters.movie_id");
}

async function readReviews(movie_id) {
  const reviews = await db("reviews").where({ movie_id }).select("*");
  const reviewsWithCritics = await Promise.all(
    reviews.map(async (review) => {
      const critic = await db("critics").where({ critic_id: review.critic_id }).first();
      return { ...review, critic };
    })
  );
  return reviewsWithCritics;
}
module.exports = {
  list,
  read,
  readTheaters,
  readReviews,
};