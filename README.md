# Tiny EventSource

Tiny EventSource simplifies `server-sent` events for API servers.

## Example

### Using the factory

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

### Using the Class

```javascript
import {EventSource} from "tiny-eventsource";
```

## Testing

Tiny EventSource has 100% code coverage with its tests.

```console
  Testing functionality
    ✔ It should do nothing with stock configuration
    ✔ It should have an accurate listener count
    ✔ It should have a heartbeat (502ms)
    ✔ It should send custom events


  4 passing (508ms)

----------------------|---------|----------|---------|---------|----------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s    
----------------------|---------|----------|---------|---------|----------------------
All files             |     100 |    72.22 |     100 |     100 |                      
 tiny-eventsource.cjs |     100 |    72.22 |     100 |     100 | 35-36,49,56,66,68-88 
----------------------|---------|----------|---------|---------|----------------------
```

## Options

### event

Default is `message`.

### ms

Default is `0`. If greater than 0 a heart beat will be created from `init()`.

### msg

Default is `ping`. Message sent if `ms` is greater than `0`.

## Events

### close

Emitted when an `EventSource` request is closed.

## API

### constructor({options}, [...msgs])

Creates an `EventSource` instance with optional messages to be transmitted on successful connection.

### init(req, res)

Initializes an `Event Source` stream.

### listenerCount()

Returns the number of listeners on the `EventSource` instance.

### send(msg[, event, id]);

Sends a message over an `EventSource` instance.

### setMaxListeners(n)

Sets the maximum listeners on the `EventSource` instance; default is `0`.

## License
Copyright (c) 2023 Jason Mulligan
Licensed under the BSD-3 license.
