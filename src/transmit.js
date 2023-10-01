import {DATA_MSG, DATA_TOKEN, EVENT_MSG, EVENT_TOKEN, ID_MSG, ID_TOKEN} from "./constants";

export function transmit (res, arg = {data: ""}, id = 0) {
	res.write(ID_MSG.replace(ID_TOKEN, id));

	if (arg.event !== void 0) {
		res.write(EVENT_MSG.replace(EVENT_TOKEN, arg.event));
	}

	res.write(DATA_MSG.replace(DATA_TOKEN, typeof arg.data === "object" ? JSON.stringify(arg.data) : arg.data));
}
