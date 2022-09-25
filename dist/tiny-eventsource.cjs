/**
 * tiny-eventsource
 *
 * @copyright 2022 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 2.0.0
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_events = require('node:events');

function heartbeat (arg) {
	if (arg.heartbeat.ms > 0) {
		setTimeout(() => {
			if (arg.listenerCount("data") > 0) {
				arg.send(arg.heartbeat.msg, arg.heartbeat.event);
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

class EventSource extends node_events.EventEmitter {
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

function eventsource (...args) {
	return new EventSource(...args);
}

exports.eventsource = eventsource;
