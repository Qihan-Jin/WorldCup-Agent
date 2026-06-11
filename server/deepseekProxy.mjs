import { createServer } from "node:http";

const PORT = Number(process.env.MATCHPILOT_API_PORT ?? 8787);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  });
  response.end(JSON.stringify(payload));
}

function buildSystemPrompt(profile, matches, fixtureDataSource) {
  const matchBrief = matches
    .slice(0, 8)
    .map((match) => `${match.homeTeam} vs ${match.awayTeam} at ${match.kickoffUtc}, stage: ${match.stage}`)
    .join("\n");
  const sourceBrief = fixtureDataSource
    ? `${fixtureDataSource.provider} ${fixtureDataSource.coverage}, updated ${fixtureDataSource.updatedAt}, ${fixtureDataSource.matchCount} matches. ${fixtureDataSource.reliabilityNote}`
    : "No fixture data source metadata was provided.";

  return [
    "You are MatchPilot, an AI World Cup viewing planning agent.",
    "Help ordinary football fans choose what to watch live, what to save for highlights, and how to plan around sleep and social viewing.",
    "Use concise, practical answers. Do not claim live scores or real-time facts unless provided in the input.",
    "Fixture guardrail: answer schedule/date/team fixture questions only from the provided match context. If a team or match is missing, say the verified fixture data does not cover it yet.",
    `Fixture data source: ${sourceBrief}`,
    `User favorite team: ${profile.favoriteTeam}. Sleep tolerance: ${profile.sleepTolerance}. Watch depth: ${profile.watchDepth}.`,
    "Available match context:",
    matchBrief
  ].join("\n");
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/chat") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  if (!DEEPSEEK_API_KEY) {
    sendJson(response, 503, { error: "DEEPSEEK_API_KEY is not configured" });
    return;
  }

  try {
    const { messages = [], profile, matches = [], fixtureDataSource } = await readJson(request);
    const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(profile, matches, fixtureDataSource) },
          ...messages.map((message) => ({ role: message.role, content: message.content }))
        ],
        temperature: 0.4
      })
    });

    if (!deepseekResponse.ok) {
      const errorBody = await deepseekResponse.text();
      sendJson(response, deepseekResponse.status, { error: errorBody });
      return;
    }

    const data = await deepseekResponse.json();
    sendJson(response, 200, { answer: data.choices?.[0]?.message?.content ?? "No answer returned." });
  } catch (error) {
    console.error("DeepSeek proxy request failed:", error);
    if (error instanceof Error && error.cause) {
      console.error("DeepSeek proxy failure cause:", error.cause);
    }
    sendJson(response, 500, { error: error instanceof Error ? error.message : "Unknown server error" });
  }
});

server.listen(PORT, () => {
  console.log(`MatchPilot DeepSeek proxy listening on http://127.0.0.1:${PORT}`);
});
