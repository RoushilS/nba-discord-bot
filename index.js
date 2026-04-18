const WEBHOOK_URL = "process.env.WEBHOOK_URL";
const URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

async function checkGames() {
  const res = await fetch(URL);
  const data = await res.json();

  console.log("Fetched games:", data.events.length);

  for (const game of data.events) {
    const comp = game.competitions[0];
    const [home, away] = comp.competitors;

    const message = `${away.team.displayName} ${away.score} - ${home.score} ${home.team.displayName}`;
    console.log("URL:", URL);
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  }
}
checkGames()
setInterval(checkGames, 60000);