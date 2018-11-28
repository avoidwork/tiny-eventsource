# tiny-eventsource
Tiny EventSource for API servers.

## API
__constructor__([...msgs])

Creates an `EventSource` instance with optional messages to be transmitted on successful connection.

__send__(msg[, event, id]);

Sends a message over an existing `EventSource`.

## Example
```javascript
const streams = new Map(),
    eventsource = require("tiny-eventsource"),
    {STATUS_CODES} = require("http");

function heartbeat (arg) {
	if (streams.has(arg)) {
		streams.get(arg).send("ping");
		setTimeout(() => heartbeat(arg), 2e4);
	}
}

module.exports = (req, res) => {
	if (req.isAuthenticated()) {
		const id = req.user.id;

		if (!streams.has(id)) {
			streams.set(id, eventsource("connected"));
			heartbeat(id);
		}

		streams.get(id).init(req, res);
	} else {
		res.statusCode = 401;
		res.writeHead(res.statusCode, {headers: {"cache-control": "no-cache, must re-validate"}})
		res.end(STATUS_CODES[res.statusCode]);
	}
};
```
