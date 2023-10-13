const express = require("express");
const OpenAI = require("openai");
const { createSession } = require("better-sse");
const { createStreamingAPIClient } = require("masto");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());

app.get("/gpt", async (req, res) => {
  const query = req.query.query;
  const session = await createSession(req, res);

  res.sse = session;

  const stream = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    },
    {
      responseType: "stream",
    }
  );

  for await (const part of stream) {
    res.sse.push(part.choices[0]?.delta?.content || "", "gpt");
  }
});

app.get("/dev", async (req, res) => {
  const session = await createSession(req, res);
  let lastChecked = 0;

  res.sse = session;

  // get the initial article
  let devArticles = await fetch("https://dev.to/api/articles/latest");
  let latestArticles = await devArticles.json();
  let latestArticle = latestArticles[0];
  let publishedDate = new Date(latestArticle.published_timestamp);
  res.sse.push(latestArticle, "dev");
  lastChecked = publishedDate.getTime();

  setInterval(async () => {
    devArticles = await fetch("https://dev.to/api/articles/latest");
    latestArticles = await devArticles.json();
    latestArticle = latestArticles[0];
    publishedDate = new Date(latestArticle.published_timestamp);

    if (publishedDate.getTime() > lastChecked) {
      res.sse.push(latestArticle, "dev");
      lastChecked = publishedDate.getTime();
    } else {
      res.sse.push(
        {
          title: null,
          url: null,
        },
        "dev"
      );
    }
  }, 20 * 1000);
});

app.get("/mastodon", async (req, res) => {
  const session = await createSession(req, res);
  res.sse = session;

  const masto = createStreamingAPIClient({
    streamingApiUrl: "https://mastodon.xyz/api/v1/streaming/",
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  });
  for await (const event of masto.public.subscribe()) {
    switch (event.event) {
      case "update": {
        // console.log("new post", event.payload.content);
        res.sse.push(event.payload.content, "mastodon");
        break;
      }
      default: {
        break;
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
