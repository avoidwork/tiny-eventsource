# tiny-eventsource
Tiny EventSource for API servers.

## Example
```javascript
const streams = new Map(),
    eventsource = require("tiny-eventsource"),
    {STATUS_CODES} = require("http");

module.exports = (req, res) => {
	if (req.isAuthenticated()) {
		const id = req.user.id;

		if (!streams.has(id)) {
			streams.set(id, eventsource("hello!"));
		}

		streams.get(id).init(req, res);
	} else {
		res.statusCode = 400;
		res.writeHead(res.statusCode, {headers: {"cache-control": "no-cache, must re-validate"}})
		res.end(STATUS_CODES[res.statusCode]);
	}
};
```
