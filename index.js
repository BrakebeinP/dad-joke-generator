import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://dad-jokes.p.rapidapi.com/random/joke",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(options);
    const dadJokeBody = response.data.body[0];
    const jokeSetup = dadJokeBody.setup;
    const jokePunchline = dadJokeBody.punchline;
    const jokeAuthor = dadJokeBody.author["name"];

    res.render("index.ejs", {
      error: false,
      setup: jokeSetup,
      punchline: jokePunchline,
      author: jokeAuthor,
    });
  } catch (error) {
    res.render("index.ejs", {
      error: true,
      errorCode: error.response.status,
      errorMessage: error.response.statusText,
      errorDetails: error.response.data.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
