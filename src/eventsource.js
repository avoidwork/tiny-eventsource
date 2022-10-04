import {EventEmitter} from "node:events";

import {heartbeat} from "./heartbeat.js";
import {transmit} from "./transmit.js";

class EventSource extends EventEmitter {
	constructor (config, ...args) {
		const str = typeof config === "string",
			obj = !str && config !== void 0 && config instanceof Object;

		super();
		this.heartbeat = {
			event: obj && typeof config.event === "string" ? config.event : "message",
			ms: obj && typeof config.ms === "number" ? config.ms : 0,
			msg: obj && typeof config.msg === "string" ? config.msg : "ping"
		};
		this.initial = str ? [config, ...args] : [...args];
		this.setMaxListeners(0);
	}

	init (req, res) {
		let id = -1;
		const fn = arg => transmit(res, arg, ++id);

		if (req !== void 0) {
			req.socket.setTimeout(0);
			req.socket.setNoDelay(true);
			req.socket.setKeepAlive(true);
			req.on("close", () => this.off("data", fn));
		}

		if (res !== void 0) {
			res.statusCode = 200;
			res.setHeader("content-type", "text/event-stream");
			res.setHeader("cache-control", "no-store, max-age=0");
			res.setHeader("connection", "keep-alive");
			this.on("data", fn);
		}

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

export function eventsource (...args) {
	return new EventSource(...args);
}
