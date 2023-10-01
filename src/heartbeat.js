import {DATA, EMPTY} from "./constants.js";

export function heartbeat (arg = {heartbeat: {event: EMPTY, ms: 0}}) {
	if (arg?.heartbeat?.ms > 0) {
		setTimeout(() => {
			if (arg.listenerCount(DATA) > 0) {
				arg.send(arg.heartbeat.msg, arg.heartbeat.event);
				heartbeat(arg);
			}
		}, arg.heartbeat.ms);
	}
}
