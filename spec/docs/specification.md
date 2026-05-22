---
title: Specification
description: The AFM specification defines a structured, markdown-based format for AI agents, enabling easy sharing, deployment, and understanding across platforms.
hide:
  - navigation
---

# AFM Specification v0.3.0

## 1. Introduction

AFM (Agent-Flavored Markdown) is a markdown-based format to define AI agents. It allows agents to be written in text once and reused across different platforms.

This document details the AFM file format, its syntax, and the schema for defining an agent.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [[RFC2119](https://datatracker.ietf.org/doc/html/rfc2119)] [[RFC8174](https://datatracker.ietf.org/doc/html/rfc8174)] when, and only when, they appear in all capitals, as shown here.


### 1.1. Key Goals of AFM

AFM unifies agent definition through a text-based standard:

- **No Code**: AFM enables defining an agent's instructions, tools, and configuration in a simple, declarative, text-based format, moving away from complex, imperative code. The markdown-based syntax is intuitive for both developers and non-technical stakeholders to read, write, and understand.

- **Portable**: By defining agents declaratively in text rather than code, AFM enables the same agent definition to be interpreted and deployed across diverse platforms and tools.

- **Unified**: AFM provides a clean, declarative model that works seamlessly for both developers writing code and those using visual, low-code interfaces. The same AFM file can power both experiences.

- **Adaptable**: AFM is designed to be flexible and extensible, allowing the standard to evolve as AI technologies and requirements change.

## 2. Core Concepts

AFM defines the following core concepts:

- **Agent**: The primary entity defined by an AFM file, representing an AI agent.
- **Role**: The agent's purpose and responsibilities.
- **Instructions**: Directives governing the agent's behavior.
- **Details**: Metadata describing the agent (name, version, author, etc.).
- **Model**: The AI model powering the agent.
- **Tools**: External tools and services available to the agent.
- **Interface**: How the agent is invoked and its input/output contract.
- **Skills**: Additional capabilities the agent can load and use on demand (in [Agent Skills](https://agentskills.io) format).

!!! note "Agent Memory"
    Given the lack of standardization, AFM does not prescribe a standard for agent memory yet.

## 3. File Extension

An agent definition file MUST use the `.afm.md` or `.afm` extension. 

## 4. Syntax Overview

### 4.1. Basic Structure

An AFM file is structured into two main sections: the front matter and the agent declaration.

* **Front Matter**: Contains metadata about the agent.
* **Markdown Body**: Contains the agent's definition.

### 4.2. Front Matter

The front matter is a YAML block at the top of the file, enclosed by `---`. Refer to the [YAML specification](https://yaml.org/spec/1.2/spec.html) for more details on YAML syntax.

This section contains metadata about the agent. These metadata fields are **OPTIONAL** and can be used to provide additional context or configuration for the agent.

| Section | Description |
| ----------------- | -------------------------------------------------------------------------------- |
| [Agent Details](#51-agent-details) | Information about the agent, such as its name, description, version, and author. |
| [Agent Model](#52-agent-model) | Defines the AI model that powers the agent. |
| [Agent Interfaces](#53-agent-interfaces) | Defines how the agent is invoked and its input/output signature. |
| [Agent Tools](#54-tools) | Defines external tools available to the agent (e.g., via MCP). |
| [Agent Execution](#55-agent-execution) | Runtime execution configuration like iteration limits. |
| [Agent Skills](#57-agent-skills) | Defines additional capabilities the agent can load and use on demand, following the [Agent Skills](https://agentskills.io) open standard. |

Refer to the [AFM Schema](#5-schema-definitions) for a complete list of fields and their meanings.


### 4.3. Markdown Body

This section contains the detailed instructions that guide the agent's behavior.

Users can use markdown syntax to format the text, including headings, lists, links, and code blocks.

The Markdown body **MUST** contain the following headings, with corresponding content.

  - `# Role`: Defines the agent's purpose and responsibilities. This section describes what the agent does and the context in which it operates. This content typically forms the opening context of the system prompt.
  - `# Instructions`: Provides directives that shape the agent's behavior, capabilities, and operational guidelines. This section contains the core logic and rules that govern how the agent processes inputs and generates outputs.

### 4.4. Example

!!! example "Basic AFM File Example"
    Here is a simple example of an AFM file:

    ```yaml
    ---
    spec_version: "0.3.0"
    name: "Math Tutor"
    description: "An AI assistant that helps with math problems"
    version: "1.0.0"
    max_iterations: 20
    interfaces:
      - type: consolechat
    model:
      name: "gpt-4o"
      provider: "openai"
      authentication:
        type: "api-key"
        api_key: "${env:OPENAI_API_KEY}"
    tools:
      mcp:
        - name: "math_operations"
          transport:
            type: "http"
            url: "${env:MATH_MCP_SERVER}"
    ---

    # Role

    You are an experienced math tutor capable of assisting students with mathematics problems, providing explanations, step-by-step 
    solutions, and practice exercises.

    # Instructions

    You are a knowledgeable and patient math tutor who helps students understand mathematical concepts. Provide clear, step-by-step 
    explanations for math problems, using simple language and avoiding jargon unless explaining it. 
    
    When solving problems, show all work and explain each step. Use the available math operations tools when performing calculations. 
    Explain mathematical concepts with real-world examples when possible. Be encouraging and supportive of students' efforts, ask clarifying 
    questions if a problem is not clearly stated, provide multiple approaches to solving problems when applicable, help students identify 
    and correct their mistakes.
    ```

## 5. Schema Definitions

This section defines the schema for the Front Matter. For clarity, the schema is divided into several subsections, each detailing a specific aspect of the Agent.

### 5.1. Agent Details {#51-agent-details} 

This section defines the schema for agent-specific metadata. It is **OPTIONAL** but recommended for clarity and organization.

AFM implementations **SHALL** use this section to display the agent's metadata in user interfaces to provide better user experience for end users.

#### 5.1.1. Schema Overview

The agent metadata fields are specified in the YAML front matter of an AFM file:

```yaml
spec_version: string   # AFM specification version (e.g., "0.3.0")
name: string           # The name of the agent
description: string    # Brief description of the agent's purpose and functionality
version: string        # Semantic version (e.g., "1.0.0")
author: string         # Single author in format "Name <Email>"
authors:               # Takes precedence over the 'author' field if both exist
  - string             # Multiple authors, each in format "Name <Email>"
provider: object       # Agent provider
  name: string         # Name of the organization
  url: string          # URL to the organization's website
icon_url: string       # URL to an icon representing the agent
license: string        # License under which the agent is released
```

#### 5.1.2. Field Definitions {#agent-field-definitions}

Each field serves a specific purpose in defining and organizing the agent:

| Key | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| `spec_version` | `string` | No | Version of the AFM specification this file conforms to (e.g., "0.3.0").<br>This is **OPTIONAL** but recommended for compatibility.<br>AFM implementations **MAY** use this field to validate compatibility and provide warnings for mismatched spec versions. |
| `name` | `string` | No | Identifies the agent in human-readable form.<br>Default: inferred from the filename of the AFM file.<br>AFM implementations **SHALL** use this field to display the agent's name in user interfaces. |
| `description` | `string` | No | Provides a concise summary of what the agent does.<br>Default: inferred from the markdown body `# Role` section.<br>AFM implementations **SHALL** use this field to display the agent's description in user interfaces. |
| `version` | `string` | No | [Semantic version](https://semver.org/) of the agent definition (MAJOR.MINOR.PATCH).<br>Default: "0.0.0".<br>AFM implementations **SHALL** use this field to display the agent's version in user interfaces. |
| `author` | `string` | No | Single author in format `Name <Email>`.<br>Credits the creator of the agent definition. If both `author` and `authors` fields are provided, `authors` takes precedence. |
| `authors` | `string[]` | No | Multiple authors, each in format `Name <Email>`.<br>Credits the creators of the agent definition. Takes precedence over `author` if both exist. |
| `icon_url` | `string` | No | URL to an icon representing the agent.<br>This is **OPTIONAL** but recommended for visual representation in user interfaces.<br>AFM implementations **SHALL** use this field to display the agent's icon in user interfaces. |
| `provider` | `object` | No | Information about the organization providing the agent.<br>This is **OPTIONAL** but recommended for attribution.<br>See the Provider Object below for details. |
| `license` | `string` | No | License under which the agent definition is released.<br>This is **OPTIONAL** but recommended for clarity. |

**<a id="provider-object"></a>Provider Object:**

| Key | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| `name` | `string` | No | Name of the organization providing the agent. |
| `url` | `string` | No | URL to the organization's website. |

#### 5.1.3. Example Usage

The following example demonstrates a valid agent metadata section as specified in [Section 5.1](#51-agent-details). This YAML front matter illustrates the use of recommended and optional fields for agent definition:

```yaml
---
spec_version: "0.3.0"
name: "Math Tutor"
description: "An AI assistant that helps with math problems"
version: "1.2.0"
authors:
  - "Jane Smith <jane@example.com>"
  - "John Doe <john@example.com>"
provider:
  name: "Example AI Solutions"
  url: "https://example.com"
icon_url: "https://example.com/icons/math-tutor.png"
license: "MIT"
---
```

### 5.2. Agent Model {#52-agent-model}

This section specifies the AI model or language model that powers the agent. It is **OPTIONAL** and defines how to access and authenticate with the model service.

#### 5.2.1. Field Definitions

| Key | Type | Required | Description |
| ------------------ | ---------- | ---------- | ----------------------------------------------------------------------------- |
| `name` | `string` | No | Model identifier or name. |
| `provider` | `string` | No | The organization or service providing the model (e.g., "openai", "anthropic"). |
| `url` | `string` | No | The URL endpoint for the model service. |
| `authentication` | `object` | No | Authentication configuration for accessing the model. See [Section 5.6](#56-authentication) for the schema. |

#### 5.2.2. Schema Overview

```yaml
model:
  name: string             # Optional model name or identifier
  provider: string         # Optional model provider (e.g., "openai", "anthropic")
  url: string              # Optional model service endpoint URL
  authentication: object   # Optional authentication configuration
```

#### 5.2.3. Example Usage

```yaml
model:
  name: "gpt-4o"
  provider: "openai"
  url: "https://api.openai.com/v1/chat/completions"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
```

### 5.3. Agent Interfaces {#53-agent-interfaces}

This section defines how an agent can be interacted with or triggered. An agent can have multiple interfaces, allowing it to be accessed in different ways. It is **OPTIONAL** and specifies how the agent receives inputs and produces outputs.

If the `interfaces` field is not explicitly defined in the front matter, AFM implementations **MUST** assume a default interface of type `consolechat`. In this default mode, the agent **SHALL** be invoked as a command-line chat interface: it **MUST** accept a single string input (user message) and **MUST** produce a single string output (agent reply).

Users can override these defaults by specifying the `interfaces` field in the front matter as an array of interface definitions. AFM implementations **SHALL** use these definitions to generate the agent's callable interfaces and to ensure consistent behavior across different platforms.

#### 5.3.1. Interface Types

The `interface.type` field **MUST** be one of the following values:

| Value | Description |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `consolechat` | The agent is exposed as a command-line/terminal chat interface for interactive console-based conversations. |
| `webchat` | The agent is exposed as a web-based chat interface, accessible through browsers with a conversational UI. |
| `platformchat` | The agent is exposed as a chat interface on an external messaging or collaboration platform. |
| `webhook` | The agent is exposed as a webhook endpoint and supports subscription details (e.g., WebSub hub integration). |

Each interface type defines how the agent is triggered and interacted with. Implementations **MAY** support all four types as described above.

#### 5.3.2. Schema Overview

The `interfaces` field is an array of interface objects. Each interface object is one of four variants, discriminated by the `type` field. The schema for each variant is shown below.

In the schemas below, every field is **OPTIONAL** unless marked **REQUIRED**. Comments call out the few fields whose defaults or semantics differ between variants.

**`type: consolechat`**

```yaml
interfaces:
  - type: consolechat                       # REQUIRED
    signature:                              # Defaults to string in / string out
      input: object
      output: object
```

**`type: webchat`**

```yaml
interfaces:
  - type: webchat                           # REQUIRED
    signature:                              # Defaults to string in / string out
      input: object
      output: object
    exposure:
      http: object
```

**`type: platformchat`**

A platformchat interface is further discriminated by the `mode` field.

`mode: notification` - platform pushes events; runtime acknowledges, reply (if present) is out-of-band:

```yaml
interfaces:
  - type: platformchat                      # REQUIRED
    platform: string                        # REQUIRED — e.g. "gchat", "slack", "telegram"
    mode: notification                      # REQUIRED
    prompt: string                          # Prompt template (supports ${http:payload.*} / ${http:header.*})
    signature:                              # output is not permitted in this mode
      input: object
    platform_config: object                 # Platform-specific configuration
    exposure:
      http: object
```

`mode: request` - platform pushes events and expects the agent result in the HTTP response:

```yaml
interfaces:
  - type: platformchat                      # REQUIRED
    platform: string                        # REQUIRED
    mode: request                           # REQUIRED
    prompt: string
    signature:
      input: object
      output: object                        # Describes the synchronous response payload returned to the platform
    platform_config: object
    exposure:
      http: object
```

`mode: polling` - runtime fetches events from the platform:

```yaml
interfaces:
  - type: platformchat                      # REQUIRED
    platform: string                        # REQUIRED
    mode: polling                           # REQUIRED
    prompt: string
    signature:                              # output is not permitted in this mode
      input: object
    platform_config: object
    polling:                                # If omitted, interval defaults to 30
      interval: integer                     # Poll interval in seconds
      timeout: integer                      # Per-poll timeout in seconds
    authentication: object                  # Client authentication for outbound calls to the platform
```

**`type: webhook`**

```yaml
interfaces:
  - type: webhook                           # REQUIRED
    prompt: string                          # Prompt template (supports ${http:payload.*} / ${http:header.*})
    signature:                              # Optional. input MAY be omitted (provider determines incoming payload); output has no synchronous-response channel
      input: object
      output: object
    exposure:
      http: object
    subscription:
      protocol: string                      # REQUIRED within subscription — e.g., "websub"
      hub: string                           # Subscription hub URL
      topic: string                         # Topic to subscribe to
      callback: string                      # Callback URL for receiving events
      secret: string                        # Secret for verifying webhook payloads
      authentication: object                # Authentication configuration for the subscription
```

#### 5.3.3. Field Definitions

The `interfaces` field is an array where each element represents an interface definition.

**Interface Object:**

The interface object **MUST** be one of the following variants, discriminated by the `type` field.

**Consolechat Interface:**

Command-line/terminal chat interface for interactive console-based conversations.

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"consolechat"`. |
| `signature` | `object` | No | Defines the agent's input and output parameters. Defaults to string input and string output. See [Signature Object](#signature-object). |

**Webchat Interface:**

Web-based chat interface accessible through browsers with a conversational UI.

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"webchat"`. |
| `signature` | `object` | No | Defines the agent's input and output parameters. Defaults to string input and string output. See [Signature Object](#signature-object). |
| `exposure` | `object` | No | Configuration for how the agent is exposed via HTTP. See [Exposure Object](#exposure-object). |

**Platformchat Interface:**

Chat interface hosted by an external messaging or collaboration platform (e.g., Google Chat, Slack, Telegram).

The platformchat interface object **MUST** be one of three variants, discriminated by the `mode` field:

| Mode | Description |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `notification` | The platform sends an event over HTTP, the runtime acknowledges it, and any reply happens out-of-band (e.g., via MCP tools the agent uses to call back into the platform). |
| `request` | The platform sends an event over HTTP and expects the agent's result in the immediate HTTP response. The shape of that response is described by `signature.output`. |
| `polling` | The runtime periodically fetches events from the platform and invokes the agent for each new event. Configured via the `polling` field. |

Implementations **MUST** support whichever subset of modes a given platform requires; not every platform supports every mode.

All three variants share the following common fields:

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"platformchat"`. |
| `platform` | `string` | Yes | Identifier of the external chat platform (e.g., `"gchat"`, `"slack"`, `"telegram"`, `"whatsapp"`). |
| `mode` | `string` | Yes | Selects the variant. One of `"notification"`, `"request"`, or `"polling"`. |
| `prompt` | `string` | No | A template string for constructing the user prompt for an agent run from platform-delivered event data.<br>Supports [variable substitution](#7-variable-substitution) with HTTP context prefixes (`${http:payload.fieldname}`, `${http:header.headername}`).<br>When omitted, the implementation determines how to construct the agent prompt from the event payload. |
| `platform_config` | `object` | No | Platform-specific configuration (e.g., signing secrets, project numbers, allowed update types). The set of recognized keys is determined by the platform and the implementation. |

**Platformchat (`mode: notification`):**

The platform pushes events over HTTP; the runtime acknowledges the request and any user-visible reply happens out-of-band. The agent has no platform-response channel, so `signature.output` is not permitted: implementations **MUST** reject definitions that set `signature.output` in this mode.

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `signature` | `object` | No | Defines the agent's input parameters. The `input` field MAY be omitted as the platform determines the incoming payload structure. The `output` field **MUST NOT** be set. See [Signature Object](#signature-object). |
| `exposure` | `object` | No | Configuration for how the agent is exposed via HTTP. See [Exposure Object](#exposure-object). |

**Platformchat (`mode: request`):**

The platform pushes events over HTTP and expects the agent's result in the immediate HTTP response.

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `signature` | `object` | No | Defines the agent's input and output parameters. The `input` field MAY be omitted as the platform determines the incoming payload structure. The `output` field describes the synchronous response payload returned to the platform. See [Signature Object](#signature-object). |
| `exposure` | `object` | No | Configuration for how the agent is exposed via HTTP. See [Exposure Object](#exposure-object). |

**Platformchat (`mode: polling`):**

The runtime initiates outbound HTTP calls to the platform on an interval and invokes the agent for each new event. There is no inbound HTTP endpoint to expose, and the agent has no platform-response channel, so `signature.output` is not permitted: implementations **MUST** reject definitions that set `signature.output` in this mode.

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `signature` | `object` | No | Defines the agent's input parameters. The `input` field MAY be omitted as the platform determines the event payload structure. The `output` field **MUST NOT** be set. See [Signature Object](#signature-object). |
| `polling` | `object` | No | Polling configuration. If omitted, spec-defined defaults apply. See [Polling Object](#polling-object). |
| `authentication` | `object` | No | Client authentication used by the runtime when making outbound calls to the platform. See [Section 5.6](#56-authentication) for the schema. |

**Webhook Interface:**

Generic event/callback endpoint with subscription support (e.g., WebSub).

| Key | Type | Required | Description |
| --------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"webhook"`. |
| `prompt` | `string` | No | A template string for constructing the user prompt for an agent run from webhook data.<br>Supports [variable substitution](#7-variable-substitution) with HTTP context prefixes:<br>- `${http:payload.fieldname}` to access webhook payload fields<br>- `${http:header.headername}` to access HTTP headers<br>When provided, this templated prompt is used as the user prompt to the agent.<br>When omitted, the implementation determines how to construct the agent prompt from the webhook payload. |
| `signature` | `object` | No | Defines the agent's input and output parameters. The `input` field MAY be omitted as the webhook provider determines the incoming payload structure. The `output` field has no synchronous-response channel for `webhook` (the runtime acknowledges the request immediately) and MAY be omitted. See [Signature Object](#signature-object). |
| `exposure` | `object` | No | Configuration for how the agent is exposed via HTTP. See [Exposure Object](#exposure-object). |
| `subscription` | `object` | No | Subscription configuration. See [Subscription Object](#subscription-object). |

##### Signature Object {#signature-object}

Defines the data contract for the agent. The `input` and `output` fields MUST conform to the [JSON Schema](https://json-schema.org/) specification, but are expressed in YAML syntax. This allows for:

- Simple signatures (e.g., a single string, number, boolean, or array)
- Complex, structured objects with named properties
- Full expressiveness of JSON Schema for validation and documentation

**Examples:**

*Single string input/output (default):*

```yaml
signature:
  input:
    type: string
  output:
    type: string
```

*Complex object with properties:*

```yaml
signature:
  input:
    type: object
    properties:
      user_prompt:
        type: string
        description: "The user's query or request"
      context:
        type: object
        description: "Additional context for the request"
    required: [user_prompt]
  output:
    type: object
    properties:
      response:
        type: string
        description: "The agent's response to the user prompt"
      confidence:
        type: number
        description: "Confidence score for the response"
    required: [response]
```

*Array input/output:*
```yaml
signature:
  input:
    type: array
    items:
      type: string
  output:
    type: array
    items:
      type: string
```

**Default Behavior:**

Default signature behavior:

- For `consolechat` and `webchat` types: the default `signature` is string input and string output.

- For `webhook` type: the `input` field MAY be omitted, as the webhook provider determines the incoming payload structure. There is no synchronous-response channel, so `output` MAY be omitted as well.

- For `platformchat` type: the `input` field MAY be omitted, as the platform determines the incoming payload structure. The `output` field applies only to `mode: request` (where it describes the synchronous response returned to the platform); for `mode: notification` and `mode: polling`, `output` **MUST NOT** be set and implementations **MUST** reject definitions that do. See the per-mode tables under the Platformchat Interface.

AFM implementations **SHALL** use this definition to generate the agent's callable interface and to ensure consistent behavior across different platforms.

<a id="subscription-object"></a>
**Subscription Object:**

| Key | Type | Required | Description |
| ------------------ | ---------- | ---------- | ------------- |
| `protocol` | `string` | Yes | The subscription protocol (e.g., `websub`). |
| `hub` | `string` | No | The hub to subscribe at (optional if subscription is registered manually). |
| `topic` | `string` | No | The topic to subscribe to (optional if subscription is registered manually). |
| `callback` | `string` | No | The callback URL where events should be delivered (optional, for dynamic or self-registration). |
| `authentication` | `object` | No | Optional authentication configuration for the webhook subscription. See [Section 5.6](#56-authentication) for the schema. |
| `secret` | `string` | No | A secret used to sign or verify webhook payloads (optional, for security). |

<a id="polling-object"></a>
**Polling Object:**

Applies to `platformchat` interfaces with `mode: polling`. Describes how the runtime fetches events from the platform. The entire `polling` object is **OPTIONAL**; when omitted, the defaults below apply.

| Key | Type | Required | Description |
| ------------------ | ---------- | ---------- | ------------- |
| `interval` | `integer` | No | Interval between successive poll requests, in seconds. Default: `30`. |
| `timeout` | `integer` | No | Per-poll request timeout, in seconds. When omitted, the implementation chooses a sensible default. |

##### Exposure Object {#exposure-object}

Applies to agents of type `webchat`, `webhook`, and `platformchat` (with `mode: notification` or `mode: request`), and defines how the corresponding services are exposed.

| Key | Type | Required | Description |
| -------- | ---------- | ---------- | ---------------------------------------------------------------------- |
| `http` | `object` | No | Defines how to expose the agent via a standard HTTP endpoint. |

**HTTP Object:**

| Key | Type | Required | Description |
| ------------------ | ---------- | ---------- | ----------------------------------------------------------------------------- |
| `path` | `string` | No | The URL path segment for the agent's HTTP endpoint (e.g., `/math-tutor`). If not specified, implementations **SHOULD** use `/chat` for `webchat` interfaces, `/webhook` for `webhook` interfaces, and `/{platform}` for `platformchat` interfaces (e.g., `/slack`). |

!!! note "HTTP Exposure Configuration"
    The `http` object is applicable for agents of type `webchat`, `webhook`, or `platformchat` (in `notification` and `request` modes). It defines how the agent is exposed via a standard HTTP endpoint, allowing other systems to interact with it over the web.

    `platformchat` interfaces with `mode: polling` are outbound — the runtime fetches events from the platform — and therefore do not use `exposure`.

    **Default Paths:**

    - `webchat`: If no `exposure.http.path` is specified, implementations **SHOULD** default to `/chat`
    - `webhook`: If no `exposure.http.path` is specified, implementations **SHOULD** default to `/webhook`
    - `platformchat`: If no `exposure.http.path` is specified, implementations **SHOULD** default to `/{platform}` (e.g., `/slack`, `/gchat`)

    AFM does not define the HTTP methods (GET, POST, etc.) for the agent's endpoint. This is left to the implementation to decide based on the agent's functionality and requirements.


#### 5.3.4. Example Usages

**Web chat agent (default simple string):**
```yaml
interfaces:
  - type: webchat
    signature:
      input:
        type: string
      output:
        type: string
```

**Web chat agent (custom with structured input/output):**
```yaml
interfaces:
  - type: webchat
    signature:
      input:
        type: object
        properties:
          message:
            type: string
            description: "The user's chat message"
          context:
            type: object
            description: "Additional context for the conversation"
        required: [message]
      output:
        type: object
        properties:
          reply:
            type: string
            description: "The agent's chat reply"
          confidence:
            type: number
            description: "Confidence score for the response"
        required: [reply]
    exposure:
      http:
        path: "/webchat"
```

**Console chat agent:**
```yaml
interfaces:
  - type: consolechat
    signature:
      input:
        type: string
      output:
        type: string
```

**Webhook agent (with prompt templating):**
```yaml
interfaces:
  - type: webhook
    prompt: |
      A new ${http:payload.event} event was received from ${http:header.User-Agent}.

      Event Details:
      - Type: ${http:payload.event}
      - Timestamp: ${http:payload.timestamp}
      - Source: ${http:payload.source}

      Payload:
      ${http:payload.data}

      Please analyze this webhook event and provide a summary of the action taken.
    signature:
      output:
        type: object
        properties:
          result:
            type: string
            description: "The agent's response to the webhook event"
        required: [result]
    subscription:
      protocol: "websub"
      hub: "https://example.com/websub-hub"
      topic: "https://example.com/events/agent"
      callback: "https://myagent.example.com/webhook-callback"
      secret: "${env:WEBHOOK_SECRET}"
    exposure:
      http:
        path: "/webhook-handler"
```

**Platformchat agent (Google Chat, request mode):**

The platform delivers an interactive event over HTTP and expects the agent's reply in the response body.

```yaml
interfaces:
  - type: platformchat
    platform: gchat
    mode: request
    platform_config:
      project_number: "${env:PROJECT_NO}"
    signature:
      output:
        type: object
        properties:
          text:
            type: string
        required: [text]
    exposure:
      http:
        path: "/gchat"
```

**Platformchat agent (Slack, notification mode):**

Slack delivers events the runtime acknowledges; any user-visible reply happens out-of-band (e.g., via an MCP tool that posts back to Slack).

```yaml
interfaces:
  - type: platformchat
    platform: slack
    mode: notification
    prompt: |
      Slack event:

      ${http:payload.event}

      Reply as a threaded message in channel ${http:payload.event.channel}, using
      event.thread_ts as the parent timestamp when present and falling back to
      event.ts only when there is no thread_ts.
    platform_config:
      signing_secret: "${env:SLACK_SIGNING_SECRET}"
    exposure:
      http:
        path: "/slack"
tools:
  mcp:
    - name: slack
      transport:
        type: http
        url: "https://mcp.slack.com/mcp"
        authentication:
          type: bearer
          token: "${env:SLACK_USER_TOKEN}"
```

**Platformchat agent (Telegram, polling mode):**

The runtime polls Telegram's `getUpdates` API and invokes the agent for each new message.

```yaml
interfaces:
  - type: platformchat
    platform: telegram
    mode: polling
    polling:
      interval: 30
      timeout: 25
    authentication:
      type: api-key
      api_key: "${env:TELEGRAM_BOT_TOKEN}"
    platform_config:
      allowed_updates:
        - message
```

### 5.4. Tools {#54-tools}

This section defines the tools the agent can access and use.

#### 5.4.1. Schema Overview

The tools fields are specified in the YAML front matter of an AFM file:

```yaml
tools:
  mcp: array         # List of MCP servers to connect to.
```

#### 5.4.2. Field Definitions

| Key | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| `tools` | `object` | No | Container for protocol-specific tool connection configurations. |
| `tools.mcp` | `array` | No | List of MCP servers to connect to. See [Section 6.1](#61-model-context-protocol-mcp) for detailed schema. |

#### 5.4.3. Example Usage

Here's a simple example of tools in an AFM file:

```yaml
tools:
  mcp:
    - name: "github_api"
      transport:
        type: "http"
        url: "https://api.githubcopilot.com/mcp/"
        authentication:
          type: "bearer"
          token: "${env:GITHUB_TOKEN}"
```

### 5.5. Agent Execution {#55-agent-execution}

This section defines execution control and runtime behavior settings for the agent. These settings are **OPTIONAL** and help AFM implementations manage agent execution safely and efficiently.

#### 5.5.1. Schema Overview

```yaml
max_iterations: int    # Maximum number of iterations per agent run
```

#### 5.5.2. Field Definitions

| Key | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| `max_iterations` | `integer` | No | Maximum number of iterations the agent can perform in a single run.<br>This helps prevent infinite loops or runaway execution.<br>Default: Implementation-specific (typically unlimited or a high value like 100).<br>AFM implementations **SHOULD** respect this limit and gracefully terminate agent execution when the limit is reached. |

#### 5.5.3. Example Usage

```yaml
max_iterations: 50
```

### 5.6. Authentication {#56-authentication}

This section defines the generic client authentication schema that is used across different parts of the AFM specification, including MCP server connections and webhook subscriptions.

The authentication object is **OPTIONAL**.

#### 5.6.1. Schema Overview

```yaml
authentication:
  type: string         # Authentication scheme (bearer, jwt, oauth2, api-key, basic, etc.)
  # Additional fields depend on the type
  # Examples:
  # - For bearer: token
  # - For basic: username, password
```

#### 5.6.2. Field Definitions

<a id="authentication-object"></a>**Authentication Object:**

| Key | Type | Required | Description |
| ------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Authentication scheme (e.g., `bearer`, `basic`, `jwt`, `oauth2`).<br>Determines which additional fields are required or supported. |
| `*` | Various | Varies | Additional fields are authentication-type specific. See examples below for common patterns.<br>Values **SHOULD** use [variable substitution](#7-variable-substitution) to reference credentials securely. |

<!-- !!! note "Authentication Field Structure"
    The authentication object uses a type-specific structure where the `type` field determines which additional fields are needed:
    
    - **bearer**: Requires `token` field
    - **basic**: Requires `username` and `password` fields
    - **oauth2**: May require a `grant_type` field and fields like `client_id`, `client_secret`, `token_url`, `scope`, etc.
    
    The exact set of fields and their semantics are implementation-specific, but implementations **SHOULD** follow common authentication patterns for each type. -->

<!-- !!! warning "Security Best Practices"
    Sensitive credentials (e.g., tokens, passwords, secrets, keys) **SHOULD NOT** be hardcoded in AFM files. Instead:
    
    - Use [variable substitution](#7-variable-substitution) to reference credentials from secure sources
    - Let the agent's host environment manage actual credential storage and retrieval -->

#### 5.6.3. Example Usage

```yaml
# Bearer token authentication
authentication:
  type: bearer
  token: "${env:API_TOKEN}"

# Basic authentication
authentication:
  type: basic
  username: "${env:API_USERNAME}"
  password: "${env:API_PASSWORD}"
```

### 5.7. Agent Skills {#57-agent-skills}

This section defines how to make skills available to the agent to load and use on demand. Skills follow the [Agent Skills](https://agentskills.io) open standard to give agents new capabilities and expertise.

The `skills` field is **OPTIONAL**.

#### 5.7.1. Schema Overview

```yaml
skills:
  - type: "local"           # Local filesystem path
    path: "./skills"
```

#### 5.7.2. Field Definitions

The `skills` field is an array where each element represents a skill source configuration, identified by the `type` field. This version of the specification defines the `local` source type.

**Local Source:**

| Key | Type | Required | Description |
| ------- | ------ | ---------- | ------------- |
| `type` | `string` | Yes | Must be `"local"`. |
| `path` | `string` | Yes | Filesystem path (absolute or relative) to a single skill directory (containing `SKILL.md`) or a parent directory containing multiple skill subdirectories. |

#### 5.7.3. Behavior

- Implementations **SHOULD** follow the Agent Skills progressive disclosure model: load only skill `name` and `description` at startup, and load full instructions on demand when a skill matches the task.
- Implementations **SHOULD** support the `SKILL.md` format as defined by the [Agent Skills specification](https://agentskills.io/specification).
- Relative paths **SHOULD** be resolved relative to the AFM file's location. Implementations **MAY** support additional resolution strategies but **SHOULD** document their path resolution behavior.

#### 5.7.4. Example Usage

```yaml
skills:
  # A directory containing multiple skills
  - type: "local"
    path: "./my-skills"

  # A single specific skill
  - type: "local"
    path: "/app/skills/pdf-processing"
```

## 6. Protocol Specifications

This section details the protocols that agents use to communicate with external systems and other agents, as referenced in the schema above.

### 6.1. Model Context Protocol (MCP)

The Model Context Protocol (MCP) enables agents to connect to external tools and data sources.

#### 6.1.1. Schema Overview

```yaml
mcp:
  - name: string            # Unique identifier for the server connection
    transport:
      type: string          # Transport mechanism ("http" or "stdio")

      # For HTTP transport:
      url: string           # URL for the MCP server
      authentication:       # Optional authentication configuration
        type: string        # Authentication scheme (bearer, jwt, oauth2, etc.)

      # For STDIO transport:
      command: string       # Executable command to run
      args: [string]        # Optional arguments for the command
      env: {string: string} # Optional environment variables

    tool_filter:            # Optional
      allow: [string]       # Whitelist of tools
      deny: [string]        # Blacklist of tools
```

#### 6.1.2. Field Definitions

The `mcp` field is an array where each element represents an MCP server connection. Each server entry must have a unique `name` that identifies the connection.

**MCP Server Object:**

| Key | Type | Required | Description |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `name` | `string` | Yes | A unique, human-readable identifier for the connection. |
| `transport` | `object` | Yes | An object defining the transport mechanism. See [Transport Object](#transport-object) below. |
| `tool_filter` | `object` | No | Filter configuration for tools from this server. See [Tool Filter Object](#tool-filter-object) below. |

**<a id="transport-object"></a>Transport Object:**

The transport object **MUST** be one of the following variants, discriminated by the `type` field.

**HTTP Transport:**

Used for connecting to remote MCP servers over HTTP.

| Key | Type | Required | Description |
| ---------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"http"`. |
| `url` | `string` | Yes | The URL of the MCP server. |
| `authentication` | `object` | No | Authentication configuration. See [Section 5.6](#56-authentication) for the schema. |

**STDIO Transport:**

Used for running local MCP servers as subprocesses via standard input/output.

| Key | Type | Required | Description |
| ---------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `type` | `string` | Yes | Must be `"stdio"`. |
| `command` | `string` | Yes | The executable command to run (e.g., `python`, `node`, `npx`). |
| `args` | `string[]` | No | An array of arguments to pass to the command. |
| `env` | `map<string, string>` | No | A key-value map of environment variables to set for the process. Values MAY use [variable substitution](#7-variable-substitution). |

**<a id="tool-filter-object"></a>Tool Filter Object:**

| Key | Type | Required | Description |
| ------- | ------------ | -------- | ------------------------------------------------------------------ |
| `allow` | `string[]` | No | A whitelist of tools to expose from this server, using just the tool name (e.g., `create_issue`, `read_file`). If specified, only these tools are available. |
| `deny` | `string[]` | No | A blacklist of tools to hide from this server, using just the tool name (e.g., `write_file`). Applied after `allow` filtering. |

!!! note "Filter Precedence"
    When both `allow` and `deny` are specified, the tools in the `allow` list are made available and then the `deny` list is applied to remove specific tools from that filtered set. If only `deny` is specified, all tools from the server are available except those in the deny list.

#### 6.1.3. Example Usage

**HTTP Transport Examples:**

These examples define tool connections to remote MCP servers, using the streamable HTTP transport, with authentication and tool filtering. Note the use of [variable substitution](#7-variable-substitution) for sensitive and/or variable input.

```yaml
tools:
  mcp:
    - name: "github_mcp_server"
      transport:
        type: "http"
        url: "${env:GITHUB_MCP_URL}"
        authentication:
          type: "bearer"
          token: "${env:GITHUB_OAUTH_TOKEN}"
      tool_filter:
        allow:
          - "issues.create"
          - "repos.list"

    - name: "database_server"
      transport:
        type: "http"
        url: "${env:DATABASE_MCP_URL}"
        authentication:
          type: "bearer"
          token: "${env:DATABASE_API_KEY}"
      tool_filter:
        allow:
          - "query"
          - "search"
        deny:
          - "delete"
          - "drop_table"
```

**STDIO Transport Examples:**

These examples demonstrate MCP tools over the STDIO transport.

```yaml
tools:
  mcp:
    # Node.js MCP server via NPX
    - name: "filesystem_server"
      transport:
        type: "stdio"
        command: "npx"
        args:
          - "-y"
          - "@modelcontextprotocol/server-filesystem"
          - "/path/to/desktop"

    # Local Python MCP server with environment variables
    - name: "local_database_tool"
      transport:
        type: "stdio"
        command: "python"
        args:
          - "server.py"
        env:
          DB_PATH: "./data.db"
          API_KEY: "${env:LOCAL_DB_API_KEY}"
```

## 7. Variable Substitution

AFM files MAY use `${...}` syntax for variable substitution.

This specification defines three standard variable prefixes:

- The `env:` prefix (e.g., `${env:API_TOKEN}`) is **specification-defined** and MUST resolve to an environment variable, generally at agent load time (i.e., variable resolution for `env:` occurs before the agent is made available for use).
- The `http:payload` prefix (e.g., `${http:payload.field}`) is **specification-defined** for `webhook` and `platformchat` interfaces and MUST resolve to the corresponding field in the event payload at runtime. For `webhook` and `platformchat` with `mode: notification` or `mode: request`, this is the body of the incoming HTTP request; for `platformchat` with `mode: polling`, this is the per-event body retrieved by the runtime from the platform's HTTP endpoint. Variable resolution for `http:payload` occurs at runtime for each invocation.
- The `http:header` prefix (e.g., `${http:header.User-Agent}`) is **specification-defined** for `webhook` and `platformchat` interfaces and MUST resolve to the corresponding HTTP header value associated with the event at runtime — the incoming request headers for inbound modes, and the polling response headers for `platformchat` with `mode: polling`. Header names are case-insensitive.

Implementations MAY define and support additional variable substitution conventions beyond those specified here. Common examples include `file:` and `secret:`, but these are **implementation-defined** and MAY vary between AFM implementations. The timing and semantics of resolution for these prefixes are determined by the implementation.


### 7.1. Variable Prefixes

The following table summarizes variable prefixes and their status:

| Prefix | Context | Description | Example | Spec Status |
| -------- | --------- | ------------- | --------- | ------------- |
| `env:` | Static | Environment variable | `${env:API_TOKEN}` | **Spec-defined** |
| `http:payload` | Runtime | Access event payload fields for `webhook` and `platformchat` | `${http:payload.event}` or `${http:payload['nested.field']}` | **Spec-defined** |
| `http:header` | Runtime | Access HTTP headers associated with the event for `webhook` and `platformchat` | `${http:header.User-Agent}` or `${http:header.X-GitHub-Event}` | **Spec-defined** |
| `file:` | Static | Value from external config file | `${file:api.baseUrl}` | Implementation-defined |
| `secret:` | Static | Value from secrets manager | `${secret:MODEL_API_KEY}` | Implementation-defined |

**Static vs Runtime Resolution:**

- **Static variables** (`env:`, `file:`, `secret:`): Resolved once when the agent is loaded or initialized
- **Runtime variables** (`http:payload`, `http:header`): Resolved dynamically for each `webhook` or `platformchat` invocation using event-specific data

### 7.2. Example Usage

**Static variable substitution:**

```yaml
authentication:
  type: "bearer"
  token: "${env:API_TOKEN}"        # Environment variable
transport:
  url: "${file:api.baseUrl}"        # From external config file

model:
  authentication:
    type: "bearer"
    token: "${secret:MODEL_API_KEY}" # From secrets manager
```

**Runtime variable substitution (webhook / platformchat prompts):**

```yaml
interfaces:
  - type: webhook
    prompt: |
      New GitHub ${http:payload.action} event on repository ${http:payload.repository.full_name}

      Event: ${http:header.X-GitHub-Event}
      Sender: ${http:payload.sender.login}

      Details:
      ${http:payload}
```

### 7.3. HTTP Variable Access Patterns

When using `http:payload` and `http:header` in `webhook` or `platformchat` prompts:

**Payload Field Access (Specification Requirements):**

- Implementations **MUST** support dot notation for nested object access (e.g., `${http:payload.field.nested}` resolves to the value of the `nested` property within the `field` object).
- Implementations **MUST** support bracket notation for field names containing special characters or dots (e.g., `${http:payload['field.with.dots']}` resolves to the value of the `field.with.dots` property).
- Implementations **MUST** support array access by index (e.g., `${http:payload.items[0]}` resolves to the first element of the `items` array).
- Implementations **MUST** support combined access for complex paths (e.g., `${http:payload.users[0].name}` or `${http:payload['special-field'][0]}` resolves to the `name` property of the first element in the `users` array, or the first element of the `special-field` array, respectively).
- Implementations **MUST** support root access, where `${http:payload}` resolves to the entire payload as a JSON string.

**Header Access (Specification Requirements):**

- Implementations **MUST** treat header names as case-insensitive (e.g., `${http:header.Content-Type}` and `${http:header.content-type}` MUST resolve to the same value).
- Implementations **MUST** support access to headers with special characters (e.g., `${http:header.X-GitHub-Event}` resolves to the value of the `X-GitHub-Event` header).

**Error Handling:**
Implementations **SHOULD** handle missing or invalid variable references gracefully by using meaningful defaults or failing with clear error messages.

## 8. Future Work

This section outlines potential future enhancements to the AFM specification, including:

- Extending tool support to include OpenAPI-based tools for existing services and functions as tools
- First-class support for multi-agent interaction via the Agent-to-Agent (A2A) protocol
- Support for an Agent memory abstraction covering common memory patterns
- Support for Agent Identity
- Support for additional interface types (e.g., scheduled execution, REST API)
- Support for remote Agent Skills from URLs and skill registries
