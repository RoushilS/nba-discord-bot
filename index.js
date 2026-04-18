const WEBHOOK_URL = "https://discord.com/api/webhooks/1495135554701103145/y25b0KOjCVM7iiDTrBlNmScEoPPg-pUrHznlVp6sKn_JWuZKsmGvRc6o_GsheUA65ofI";
const fetch = require("node-fetch");
const URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

async function checkGames() {
  const res = await fetch(URL);
  const data = await res.json();

  console.log("Fetched games:", data.events.length);

  for (const game of data.events) {
    const comp = game.competitions[0];
    const [home, away] = comp.competitors;

    const message = `${away.team.displayName} ${away.score} - ${home.score} ${home.team.displayName}`;

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  }
}
checkGames()
setInterval(checkGames, 60000);