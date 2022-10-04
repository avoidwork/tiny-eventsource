export function transmit (res, arg, id) {
	res.write(`id: ${arg.id || id}\n`);

	if (arg.event !== void 0) {
		res.write(`event: ${arg.event}\n`);
	}

	res.write(`data: ${typeof arg.data === "object" ? JSON.stringify(arg.data) : arg.data}\n\n`);
}
