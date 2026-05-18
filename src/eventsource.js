import { EventEmitter } from "node:events";
import {
	CACHE_CONTROL,
	CLOSE,
	CONNECTION,
	CONTENT_TYPE,
	DATA,
	DATA_MSG,
	DATA_TOKEN,
	EVENT_MSG,
	EVENT_TOKEN,
	ID_MSG,
	ID_TOKEN,
	INT_0,
	INT_200,
	INT_NEG_1,
	KEEP_ALIVE,
	MESSAGE,
	NO_STORE_MAX_AGE_0,
	NUMBER,
	OBJECT,
	PING,
	STRING,
	TEXT_EVENT_STREAM,
} from "./constants.js";

export class EventSource extends EventEmitter {
	#heartbeatTimeout = null;

	constructor(config, ...args) {
		const str = typeof config === STRING,
			obj = !str && config !== void 0 && config instanceof Object;

		super();
		this.heartbeat = {
			event: obj && typeof config.event === STRING ? config.event : MESSAGE,
			ms: obj && typeof config.ms === NUMBER ? config.ms : INT_0,
			msg: obj && typeof config.msg === STRING ? config.msg : PING,
		};
		this.initial = str ? [config, ...args] : [...args];
		this.#heartbeatTimeout = null;
		this.setMaxListeners(INT_0);
	}

	init(req, res) {
		let id = INT_NEG_1;
		const fn = (arg) => this.#transmit(res, arg, ++id);

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

		this.initial.forEach((i) => this.send(i));

		if (this.heartbeat.ms > INT_0) {
			this.#startHeartbeat();
		}

		return this;
	}

	#startHeartbeat() {
		this.#heartbeatTimeout = setTimeout(() => {
			if (this.listenerCount(DATA) > 0) {
				this.send(this.heartbeat.msg, this.heartbeat.event);
			}
			if (this.heartbeat.ms > INT_0) {
				this.#heartbeatTimeout = null;
				this.#startHeartbeat();
			}
		}, this.heartbeat.ms);
	}

	#transmit(res, arg, id) {
		res.write(ID_MSG.replace(ID_TOKEN, id));

		if (arg.event !== void 0) {
			res.write(EVENT_MSG.replace(EVENT_TOKEN, arg.event));
		}

		res.write(
			DATA_MSG.replace(
				DATA_TOKEN,
				typeof arg.data === OBJECT ? JSON.stringify(arg.data) : arg.data,
			),
		);
	}

	send(data, event, id) {
		this.emit(DATA, { data, event, id });

		return this;
	}

	stop() {
		if (this.#heartbeatTimeout !== null) {
			clearTimeout(this.#heartbeatTimeout);
			this.#heartbeatTimeout = null;
		}

		return this;
	}
}

export function eventsource(...args) {
	return new EventSource(...args);
}
