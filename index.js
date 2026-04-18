const WEBHOOK_URL = process.env.WEBHOOK_URL;
const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

const previousScores = new Map();

async function checkGames() {
  const res = await fetch(ESPN_URL);
  const data = await res.json();

  console.log("Fetched games:", data.events.length);

  for (const game of data.events) {
    const comp = game.competitions[0];
    const [home, away] = comp.competitors;
    const state = comp.status.type.state; // "pre", "in", "post"

    const homeScore = home.score ?? "0";
    const awayScore = away.score ?? "0";

    // Skip 0-0 games
    if (homeScore === "0" && awayScore === "0") {
      console.log(`Skipping (0-0): ${away.team.displayName} vs ${home.team.displayName}`);
      continue;
    }

    const scoreKey = game.id;
    const currentScore = `${awayScore}-${homeScore}`;

    // Only send if score has changed
    if (previousScores.get(scoreKey) === currentScore) {
      console.log(`No change: ${away.team.displayName} ${awayScore} - ${homeScore} ${home.team.displayName}`);
      continue;
    }

    previousScores.set(scoreKey, currentScore);

    const line = `${away.team.displayName} ${awayScore} - ${homeScore} ${home.team.displayName}`;
    const message = state === "in" ? `**${line}**` : line;

    console.log("Sending:", message);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Discord error ${response.status}:`, text);
    } else {
      console.log("Sent successfully");
    }
  }
}

checkGames();
setInterval(checkGames, 60000);
