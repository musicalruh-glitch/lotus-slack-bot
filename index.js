const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/lotus-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/lotus-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/lotus-ping - Check bot latency
/lotus-catfact - Get a cat fact`
  });
});

app.command("/lotus-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/lotus-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

// 4. /lotus-quiz (No API keys needed!)
app.command("/lotus-quiz", async ({ ack, respond }) => {
await ack();

try {
const response = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
const quizData = response.data.results[0];

const question = quizData.question
.replace(/&quot;/g, '"')
.replace(/&#039;/g, "'")
.replace(/&amp;/g, "&");

const options = [...quizData.incorrect_answers, quizData.correct_answer]
.sort(() => Math.random() - 0.5)
.map(opt => opt.replace(/&quot;/g, '"').replace(/&#039;/g, "'"));

await respond({
text: `🧠 *Trivia Question! [${quizData.category}]*\n\n` +
`*Question:* ${question}\n\n` +
`*Options:*\n${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}\n\n` +
`_(Answer: ${quizData.correct_answer})_`
});

} catch (error) {
await respond("⚠️ Couldn't fetch a quiz right now. Try again!");
}
});

// 5. /lotus-animequote (Fetches anime quotes)
// 5. /lotus-animequote (With fallback quotes & terminal error logging)
app.command("/lotus-animequote", async ({ ack, respond }) => {
await ack();

try {
const response = await axios.get("https://api.animechan.io/v1/quotes/random");
const quoteData = response.data.data;

await respond({
text: `🗣️ *Anime Quote*\n\n` +
`"> _${quoteData.content}_"\n\n` +
`— *${quoteData.character.name}* (${quoteData.anime.name})`
});
} catch (error) {
// Print the EXACT error message to your terminal so you can see what happened!
console.error("Anime Quote Error:", error.response ? error.response.data : error.message);

// Backup quotes so your bot NEVER fails in Slack even if the API is rate-limited!
const fallbackQuotes = [
{ quote: "Power comes in response to a need, not a desire.", character: "Goku", anime: "Dragon Ball Z" },
{ quote: "If you don't take risks, you can't create a future.", character: "Monkey D. Luffy", anime: "One Piece" },
{ quote: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", character: "Kenshin Himura", anime: "Rurouni Kenshin" },
{ quote: "Hard work is worthless for those that don't believe in themselves.", character: "Naruto Uzumaki", anime: "Naruto" },
{ quote: "Fear is not evil. It tells you what weakness is.", character: "Gildarts Clive", anime: "Fairy Tail" }
];

app.command("/lotus-facts",async({ ack, respond}) => {

    await ack();

    const facts =[
      "*Symbol of purity;* Lotus flowers grow in muddy water, but their petals stay remarkably clean and spotless!",
      "*Ancient Seeds:* Lotus seeds can remain viable for centuries. Some seeds over 1,000 years old have successfully sprouted!",
      "*Temperature Regulation:* The lotus flower can regulate its own temperature, much like humans and animals do.",
      "*Day and Night:* Lotus flowers open their petals during the daytime and close up underwater or tight at night."
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    await respond({
      text: '*Lotus Flower Fact:* \n\n${randomFact}'
    });
});

app.command("/lotus-quote", async ({ ack, respond }) => {

  await ack();

  const quotes = [
    "Just like the lotus, we too have the ability to rise from the mud and bloom.",
    "Be patient with yourself. Nothing in nature blooms all year long.",
    "Growth takes time, but every small step brings you closer.",
    "Clear minds and calm hearts lead to the best ideas."

  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  await respond({
      text: '*Lotus Wisdom:* \n\n${randomQuote}'
  });
});



const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

await respond({
text: `🗣️ *Anime Quote*\n\n` +
`"> _${randomQuote.quote}_"\n\n` +
`— *${randomQuote.character}* (${randomQuote.anime})`
});
}
});


// 6. /lotus-animequiz (Anime-specific trivia)
app.command("/lotus-animequiz", async ({ ack, respond }) => {
await ack();

try {
// Category 31 = Entertainment: Japanese Anime & Manga
const response = await axios.get("https://opentdb.com/api.php?amount=1&category=31&type=multiple");
const quizData = response.data.results[0];

const question = quizData.question
.replace(/&quot;/g, '"')
.replace(/&#039;/g, "'")
.replace(/&amp;/g, "&");

const options = [...quizData.incorrect_answers, quizData.correct_answer]
.sort(() => Math.random() - 0.5)
.map(opt => opt.replace(/&quot;/g, '"').replace(/&#039;/g, "'"));

await respond({
text: `⛩️ *Anime Trivia Time! [Difficulty: ${quizData.difficulty.toUpperCase()}]*\n\n` +
`*Question:* ${question}\n\n` +
`*Options:*\n${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}\n\n` +
`_(Answer: ${quizData.correct_answer})_`
});
} catch (error) {
await respond("⚠️ Couldn't fetch an anime quiz right now. Try again!");
}
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();


