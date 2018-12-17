"use strict";

const {EventEmitter} = require("events");

function heartbeat (arg) {
	if (arg.heartbeat.ms > 0) {
		setTimeout(() => {
			if (arg.listenerCount("data") > 0) {
				arg.send(arg.heartbeat.msg);
				heartbeat(arg);
			}
		}, arg.heartbeat.ms);
	}
}

function transmit (res, arg, id) {
	res.write(`id: ${arg.id || id}\n`);

	if (arg.event !== void 0) {
		res.write(`event: ${arg.event}\n`);
	}

	res.write(`data: ${typeof arg.data === "object" ? JSON.stringify(arg.data) : arg.data}\n\n`);
}

class EventSource extends EventEmitter {
	constructor (config, ...args) {
		const str = typeof config === "string";

		super();
		this.heartbeat = {
			ms: !str && typeof config.ms === "number" ? config.ms : 0,
			msg: !str && typeof config.msg === "string" ? config.msg : "ping"
		};
		this.initial = str ? [config, ...args] : [...args];
		this.setMaxListeners(0);
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

		if (this.heartbeat.ms > 0) {
			heartbeat(this);
		}

		return this;
	}

	send (data, event, id) {
		this.emit("data", {data, event, id});

		return this;
	}
}

module.exports = (...args) => new EventSource(...args);
