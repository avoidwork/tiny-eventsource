import {EventEmitter} from "node:events";
import {heartbeat} from "./heartbeat.js";
import {transmit} from "./transmit.js";
import {
	CACHE_CONTROL,
	CLOSE,
	CONNECTION,
	CONTENT_TYPE,
	DATA,
	INT_0,
	INT_200,
	INT_NEG_1,
	KEEP_ALIVE,
	MESSAGE,
	NO_STORE_MAX_AGE_0,
	NUMBER,
	PING,
	STRING,
	TEXT_EVENT_STREAM
} from "./constants.js";

export class EventSource extends EventEmitter {
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
			req.on(CLOSE, () => {
				this.off(DATA, fn);
				this.emit(CLOSE);
			});
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

export function eventsource (...args) {
	return new EventSource(...args);
}
