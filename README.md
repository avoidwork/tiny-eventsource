# tiny-eventsource

[![build status](https://secure.travis-ci.org/avoidwork/tiny-eventsource.svg)](https://travis-ci.org/avoidwork/tiny-eventsource)

Tiny EventSource for API servers.

## Attributes

__heartbeat.event__ *string*

Default is `message`.

__heartbeat.ms__ *int*

Default is `0`. If greater than 0 a heart beat will be created from `init()`.

__heartbeat.msg__ *string*

Default is `ping`. Message sent if `heartbeat.ms` is greater than 0.

## API

__constructor__([heartbeat], [...msgs])

Creates an `EventSource` instance with optional messages to be transmitted on successful connection.

__init__(req, res)

Initializes an `Event Source` stream.

__send__(msg[, event, id]);

Sends a message over an existing `EventSource`.

## Example

```javascript
const streams = new Map(),
    eventsource = require("tiny-eventsource"),
    {STATUS_CODES} = require("http");

module.exports = (req, res) => {
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
