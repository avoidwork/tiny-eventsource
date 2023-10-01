# Tiny EventSource

Tiny EventSource simplifies `server-sent` events for API servers.

## Example

```javascript
import {eventsource} from "tiny-eventsource";
import {STATUS_CODES} from "node:http";

const streams = new Map();

export function stream (req, res) {
	if (req.isAuthenticated()) {
		const id = req.user.id;

		if (!streams.has(id)) {
			streams.set(id, eventsource({ms: 2e4}, "connected"));
		}

		streams.get(id).init(req, res);
	} else {
		res.statusCode = 401;
		res.writeHead(res.statusCode, {headers: {"cache-control": "no-cache, must re-validate"}})
		res.end(STATUS_CODES[res.statusCode]);
	}
};
```

## Options

### event

Default is `message`.

### ms

Default is `0`. If greater than 0 a heart beat will be created from `init()`.

### msg

Default is `ping`. Message sent if `ms` is greater than `0`.

## API

### constructor({options}, [...msgs])

Creates an `EventSource` instance with optional messages to be transmitted on successful connection.

### init(req, res)

Initializes an `Event Source` stream.

### send(msg[, event, id]);

Sends a message over an existing `EventSource`.

## License
Copyright (c) 2023 Jason Mulligan
Licensed under the BSD-3 license.
