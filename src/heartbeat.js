export function heartbeat (arg) {
	if (arg.heartbeat.ms > 0) {
		setTimeout(() => {
			if (arg.listenerCount("data") > 0) {
				arg.send(arg.heartbeat.msg, arg.heartbeat.event);
				heartbeat(arg);
			}
		}, arg.heartbeat.ms);
	}
}
