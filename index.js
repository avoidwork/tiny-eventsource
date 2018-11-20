"use strict";

const {EventEmitter} = require("events");

function transmit (res, arg, id) {
	res.write(`id: ${arg.id || id}\n`);

	if (arg.event !== void 0) {
		res.write(`event: ${arg.event}\n`);
	}

	res.write(`data: ${JSON.stringify(arg.data)}\n\n`);
}

class EventSource extends EventEmitter {
	constructor (...args) {
		super();
		this.initial = [...args];
	}

	init (req, res) {
		let id = -1;
		const fn = arg => transmit(res, arg, ++id);

		req.socket.setTimeout(0);
		req.socket.setNoDelay(true);
		req.socket.setKeepAlive(true);

		res.statusCode = 200;
		res.setHeader("content-type", "text/event-stream");
		res.setHeader("cache-control", "no-cache");
		res.setHeader("connection", "keep-alive");

		this.on("data", fn);
		req.on("close", () => this.off("data", fn));
		this.initial.forEach(i => this.send(i));

		return this;
	}

	send (data, event, id) {
		this.emit("data", {data, event, id});

		return this;
	}
}

module.exports = (...args) => new EventSource(...args);
