# Tiny EventSource

Tiny EventSource simplifies server-sent events (SSE) for API servers. An EventEmitter-based abstraction over the [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) for streaming events to HTTP clients.

[![npm version](https://img.shields.io/npm/v/tiny-eventsource.svg)](https://www.npmjs.com/package/tiny-eventsource)
[![Build](https://github.com/avoidwork/tiny-eventsource/actions/workflows/ci.yml/badge.svg)](https://github.com/avoidwork/tiny-eventsource/actions)
[![Downloads](https://img.shields.io/npm/dm/tiny-eventsource.svg)](https://www.npmjs.com/package/tiny-eventsource)
[![License: BSD-3](https://img.shields.io/badge/License-BSD--3-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

<details>
<summary><strong>Table of Contents</strong></summary>

- [Installation](#installation)
- [Quick-Start](#quick-start)
- [Usage](#usage)
- [API](#api)
  - [Constructor](#constructor)
  - [eventsource()](#eventsource)
  - [init()](#inits)
  - [send()](#sendmsg-event-id)
  - [listenerCount()](#listenercountevent)
  - [setMaxListeners()](#setmaxlistenersn)
- [Options](#options)
- [Events](#events)
  - [close](#close)
- [License](#license)

</details>

## Installation

```bash
npm install tiny-eventsource
```

## Quick-Start

```javascript
import { eventsource } from "tiny-eventsource";

const stream = eventsource({ ms: 2e4 });
stream.init(req, res);
stream.send({ data: "hello" });
```

## Usage

### Basic Express Example

```javascript
import { eventsource } from "tiny-eventsource";
import { STATUS_CODES } from "node:http";

const streams = new Map();

export function stream(req, res) {
	if (req.isAuthenticated()) {
		const id = req.user.id;

		if (!streams.has(id)) {
			streams.set(id, eventsource({ ms: 2e4 }, "connected"));
		}

		streams.get(id).init(req, res);
	} else {
		res.statusCode = 401;
		res.writeHead(res.statusCode, { headers: { "cache-control": "no-cache, must re-validate" } });
		res.end(STATUS_CODES[res.statusCode]);
	}
}
```

## API

### Constructor

Creates an `EventSource` instance with optional messages to be transmitted on successful connection.

```javascript
new EventSource({event?: string, ms?: number, msg?: string}, ...msgs)
```

| Parameter | Type             | Default     | Description                                 |
| --------- | ---------------- | ----------- | ------------------------------------------- |
| config    | `object\|string` | `undefined` | Options object or initial event name string |
| ...msgs   | `string[]`       | `[]`        | Initial messages to send on connection      |

**Returns:** `EventSource` instance

### eventsource()

Factory function that creates and returns an `EventSource` instance.

```javascript
eventsource({event?: string, ms?: number, msg?: string}, ...msgs)
```

| Parameter | Type             | Default | Description                         |
| --------- | ---------------- | ------- | ----------------------------------- |
| ...args   | `string\|object` | —       | Config options and initial messages |

**Returns:** `EventSource` instance

### init(req, res)

Initializes the SSE stream, sets response headers, and starts the heartbeat if configured.

```javascript
stream.init(req, res);
```

| Parameter | Type              | Default     | Description                                                                        |
| --------- | ----------------- | ----------- | ---------------------------------------------------------------------------------- |
| req       | `IncomingMessage` | `undefined` | HTTP incoming request — supports `socket.setTimeout`, `setNoDelay`, `setKeepAlive` |
| res       | `ServerResponse`  | `undefined` | HTTP server response — sets `Content-Type`, `Cache-Control`, `Connection` headers  |

**Returns:** `this` (`EventSource`)

### send(msg[, event, id])

Emits a data event that is transmitted to the client.

```javascript
stream.send(data, event, id);
```

| Parameter | Type             | Required | Description                                 |
| --------- | ---------------- | -------- | ------------------------------------------- |
| data      | `string\|object` | yes      | Message data — objects are JSON-stringified |
| event     | `string`         | no       | Custom event name (default: `"message"`)    |
| id        | `number`         | no       | Message ID for client reconnection          |

**Returns:** `this` (`EventSource`)

### listenerCount(event)

Returns the number of listeners registered for the given event.

```javascript
stream.listenerCount("data");
```

| Parameter | Type     | Required | Description                       |
| --------- | -------- | -------- | --------------------------------- |
| event     | `string` | yes      | Event name to count listeners for |

**Returns:** `number` — listener count

### setMaxListeners(n)

Sets the maximum number of listeners for the instance. Pass `0` to disable the limit.

```javascript
stream.setMaxListeners(0);
```

| Parameter | Type     | Required | Description                                      |
| --------- | -------- | -------- | ------------------------------------------------ |
| n         | `number` | yes      | Maximum number of listeners; `0` means unlimited |

**Returns:** `this` (`EventSource`)

## Options

| Option  | Type     | Default     | Description                                             |
| ------- | -------- | ----------- | ------------------------------------------------------- |
| `event` | `string` | `"message"` | Event name for heartbeat/ping                           |
| `ms`    | `number` | `0`         | Heartbeat interval in milliseconds; set `> 0` to enable |
| `msg`   | `string` | `"ping"`    | Message sent for heartbeat pings                        |

## Events

### close

Emitted when an `EventSource` request is closed or the client disconnects.

```javascript
stream.on("close", () => {
	// cleanup
});
```

## License

Copyright (c) 2023-2026 Jason Mulligan
Licensed under the [BSD-3 License](LICENSE)
