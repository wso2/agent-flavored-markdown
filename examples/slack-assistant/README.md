# Slack Assistant — Sample

An AFM agent triggered by Slack events. When a user DMs the bot or mentions it in a channel, the agent uses the Slack MCP server to reply in-thread.

## Structure

```
slack-assistant/
├── slack_assistant.afm.md   # Agent definition
├── docker-compose.yml       # Optional: run the agent + ngrok together
└── README.md
```

## What it demonstrates

- `platformchat` interface with `platform: slack` and `mode: notification`
- `platform_config` carrying platform-specific settings (Slack signing secret)
- Prompt templating with `${http:payload.*}` against the incoming Slack event
- Out-of-band reply via [Slack's hosted MCP server](https://docs.slack.dev/ai/slack-mcp-server/developing) rather than a synchronous HTTP response

## Prerequisites

- A Slack workspace where you can create apps
- An OpenAI API key
- [ngrok](https://ngrok.com/) (or another tunneling tool) for local testing — gives Slack a public URL pointing at your local server. Not needed in production, where the agent already runs on a publicly reachable host.
- Either [Docker](https://www.docker.com/) **or** a local AFM interpreter

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `SLACK_SIGNING_SECRET` | Slack signing secret used to verify incoming event payloads |
| `SLACK_USER_TOKEN` | Slack **user** OAuth token (`xoxp-…`) used to authenticate against the Slack MCP server |

## Slack setup

### 1. Create the app

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App → From scratch**.
2. Give it a name and select your workspace.
3. Under **Basic Information**, copy the **Signing Secret** — this is `SLACK_SIGNING_SECRET`.

### 2. Enable Slack's hosted MCP server

In the app settings, go to **Agents & AI Apps** in the sidebar and toggle **Model Context Protocol** on. This makes [Slack's hosted MCP server](https://docs.slack.dev/ai/slack-mcp-server/developing) at `https://mcp.slack.com/mcp` available to the agent.

### 3. Set scopes and install

Under **OAuth & Permissions**:

- **User Token Scopes**: add `chat:write` (plus anything else your agent needs to do on behalf of the user).
- **Bot Token Scopes**: add the scopes required by the events you'll subscribe to (e.g. `app_mentions:read` for `app_mention`).

Click **Install to Workspace** and copy the **User OAuth Token** (`xoxp-…`) — this is `SLACK_USER_TOKEN`. The Slack MCP server requires a user token (not a bot token) because it [acts on behalf of the user](https://docs.slack.dev/ai/slack-mcp-server/developing#new-app).

### 4. Enable the Messages tab (for DMs)

If you want users to DM the bot, go to **App Home → Show Tabs** and enable the **Messages Tab** and "Allow users to send messages from the messages tab". Skip this if you only care about `app_mention` in channels.

## Run the agent

### Option A — local interpreter

```bash
export SLACK_SIGNING_SECRET="…"
export SLACK_USER_TOKEN="xoxp-…"
export OPENAI_API_KEY="…"

afm run slack_assistant.afm.md
```

The server starts on port `8085` by default.

### Option B — Docker

```bash
docker run \
  -v $(pwd)/slack_assistant.afm.md:/app/slack_assistant.afm.md \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET \
  -e SLACK_USER_TOKEN=$SLACK_USER_TOKEN \
  -p 8085:8085 \
  ghcr.io/wso2/afm-langchain-interpreter:latest run /app/slack_assistant.afm.md
```

## Expose the server publicly

Slack needs a public HTTPS URL to send events to. In production, the agent runs on a host that already has one. For local testing, a tunneling tool like [ngrok](https://ngrok.com/) gives you that public URL pointing at your local server.

In a separate terminal:

```bash
ngrok config add-authtoken YOUR_NGROK_TOKEN   # one-time
ngrok http 8085
```

ngrok prints a public URL like `https://abc123.ngrok-free.app`. Your Slack webhook endpoint is that URL plus the path from the AFM file:

```
https://abc123.ngrok-free.app/slack
```

## Subscribe to events in Slack

Back in your Slack app settings:

1. Go to **Event Subscriptions** and toggle it **On**.
2. Paste the ngrok URL into **Request URL**. Slack sends a [`url_verification`](https://api.slack.com/events/url_verification) challenge — the interpreter should handle it automatically.
3. Under **Subscribe to bot events**, add the events you want, e.g.:
   - `message.im` — direct messages
   - `app_mention` — mentions in channels
4. Click **Save Changes**.

## Test it

DM the bot, or mention it in a channel you've invited it to. You should see a reply posted in the same thread. Watch the server logs to confirm the agent received the event and called the Slack MCP tool.

## Optional: one-command run with Docker Compose

The included [`docker-compose.yml`](./docker-compose.yml) runs both the agent and ngrok side-by-side so you don't need a separate ngrok terminal.

```bash
export OPENAI_API_KEY="…"
export SLACK_SIGNING_SECRET="…"
export SLACK_USER_TOKEN="xoxp-…"
export NGROK_AUTHTOKEN="…"

docker compose up
```

Open [http://localhost:4040](http://localhost:4040) to see the public ngrok URL (the [ngrok inspection dashboard](https://ngrok.com/docs/agent/web-inspection-interface/)). Use that URL + `/slack` as the Slack **Request URL**.

The agent's port `8085` is not published to the host — ngrok reaches it directly over the Docker Compose network.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Slack shows "dispatch_failed" | Server not reachable or not responding in time | Confirm the public tunnel is up and the `/slack` path matches `exposure.http.path` |
| `401` at the webhook endpoint | Signature verification failed | Check `SLACK_SIGNING_SECRET` matches the value in **Basic Information** |
| `401` from the Slack MCP server | User token invalid, expired, or missing scopes | Re-install the app; verify `SLACK_USER_TOKEN` has `chat:write` |
| "Sending messages to this app has been turned off" | Messages tab not enabled | Enable it under **App Home → Show Tabs** |
| `url_verification` fails | Wrong path | Make sure the Request URL ends with `/slack` |
| No reply appears in Slack | MCP call failed | Check logs; confirm the MCP feature is enabled (Slack setup step 2) and the token scopes are right |
