/**
 * tiny-eventsource
 *
 * @copyright 2023 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.0
 */
'use strict';

var node_events = require('node:events');

const DATA = "data";
const EMPTY = "";
const ID_MSG = "id: %ID\n";
const ID_TOKEN = "%ID";
const EVENT_MSG = "event: %EVENT\n";
const EVENT_TOKEN = "%EVENT";
const DATA_MSG = "data: %DATA\n\n";
const DATA_TOKEN = "%DATA";
const STRING = "string";
const MESSAGE = "message";
const NUMBER = "number";
const PING = "ping";
const INT_NEG_1 = -1;
const INT_0 = 0;
const INT_200 = 200;
const CONTENT_TYPE = "content-type";
const TEXT_EVENT_STREAM = "text/event-stream";
const CACHE_CONTROL = "cache-control";
const NO_STORE_MAX_AGE_0 = "no-store, max-age=0";
const CONNECTION = "connection";
const KEEP_ALIVE = "keep-alive";
const CLOSE = "close";

function heartbeat (arg = {heartbeat: {event: EMPTY, ms: 0}}) {
	if (arg?.heartbeat?.ms > 0) {
		setTimeout(() => {
			if (arg.listenerCount(DATA) > 0) {
				arg.send(arg.heartbeat.msg, arg.heartbeat.event);
				heartbeat(arg);
			}
		}, arg.heartbeat.ms);
	}
}

function transmit (res, arg = {data: ""}, id = 0) {
	res.write(ID_MSG.replace(ID_TOKEN, id));

	if (arg.event !== void 0) {
		res.write(EVENT_MSG.replace(EVENT_TOKEN, arg.event));
	}

	res.write(DATA_MSG.replace(DATA_TOKEN, typeof arg.data === "object" ? JSON.stringify(arg.data) : arg.data));
}

class EventSource extends node_events.EventEmitter {
	constructor (config, ...args) {
		const str = typeof config === STRING,
			obj = !str && config !== void 0 && config instanceof Object;

		super();
		this.heartbeat = {
			event: obj && typeof config.event === STRING ? config.event : MESSAGE,
			ms: obj && typeof config.ms === NUMBER ? config.ms : INT_0,
			msg: obj && typeof config.msg === STRING ? config.msg : PING
		};
		this.initial = str ? [config, ...args] : [...args];
		this.setMaxListeners(INT_0);
	}

	init (req, res) {
		let id = INT_NEG_1;
		const fn = arg => transmit(res, arg, ++id);

		if (req !== void 0) {
			req.socket.setTimeout(INT_0);
			req.socket.setNoDelay(true);
			req.socket.setKeepAlive(true);
			req.on(CLOSE, () => this.off(DATA, fn));
		}

		if (res !== void 0) {
			res.statusCode = INT_200;
			res.setHeader(CONTENT_TYPE, TEXT_EVENT_STREAM);
			res.setHeader(CACHE_CONTROL, NO_STORE_MAX_AGE_0);
			res.setHeader(CONNECTION, KEEP_ALIVE);
			this.on(DATA, fn);
		}

		this.initial.forEach(i => this.send(i));

		if (this.heartbeat.ms > INT_0) {
			heartbeat(this);
		}

		return this;
	}

	send (data, event, id) {
		this.emit(DATA, {data, event, id});

		return this;
	}
}

function eventsource (...args) {
	return new EventSource(...args);
}

exports.eventsource = eventsource;
