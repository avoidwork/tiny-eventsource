# tiny-eventsource
Tiny EventSource for API servers.

## Example
```javascript
const streams = new Map(),
    eventsource = require("event-source");

module.exports = (req, res) => {
	if (req.isAuthorized()) {
		const id = req.user.id;

		if (!streams.has(id)) {
			streams.set(id, eventsource("hello!"));
		}

		streams.get(id).init(req, res);
	}
};
```
