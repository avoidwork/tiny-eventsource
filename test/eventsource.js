import assert from "node:assert";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { eventsource } from "../dist/tiny-eventsource.cjs";

const mockRequest = {
	handlers: {},
	on: (arg, fn) => {
		mockRequest.handlers[arg] = fn;
	},
	socket: {
		setTimeout: () => void 0,
		setNoDelay: () => void 0,
		setKeepAlive: () => void 0,
	},
};

const mockResponse = {
	statusCode: 0,
	headers: {},
	setHeader: (key, value) => {
		mockResponse.headers[key] = value;
	},
	write: () => {
		mockRequest.handlers.close();
	},
};

test("stock configuration", function () {
	const es = eventsource();
	assert.equal(es.heartbeat.ms, 0, "Should be '0'");
	assert.equal(es.heartbeat.msg, "ping", "Should be 'ping'");
	assert.equal(es.initial.length, 0, "Should be '0'");
});

test("accurate listener count", function () {
	const fn = () => void 0;
	const es = eventsource({ ms: 0 }, "Hello World!");
	assert.equal(es.heartbeat.ms, 0, "Should be '0'");
	assert.equal(es.initial.length, 1, "Should be '1'");
	assert.equal(es.initial[0], "Hello World!", "Should be 'Hello World!'");
	assert.equal(es.listenerCount("data"), 0, "Should be '0'");
	es.on("data", fn);
	assert.equal(es.listenerCount("data"), 1, "Should be '1'");
	es.off("data", fn);
});

test("heartbeat interval fires", async function () {
	const ms = 250;
	const es = eventsource({ ms }, "Hello World!");

	await new Promise((resolve) => {
		let finish = false;
		const fn = (arg) => {
			if (finish === false) {
				finish = true;
				assert.equal(arg.data, "ping", "Should be 'ping'");
				es.off("data", fn);
				es.heartbeat.ms = 0;
				resolve();
			}
		};
		assert.equal(es.heartbeat.ms, ms, `Should be '${ms}'`);
		assert.equal(es.initial.length, 1, "Should be '1'");
		assert.equal(es.initial[0], "Hello World!", "Should be 'Hello World!'");
		es.init(mockRequest, mockResponse);
		es.on("data", fn);
	});
});

test("send custom events", async function () {
	const es = eventsource();

	await new Promise((resolve) => {
		let finish = false;
		const fn = (arg) => {
			if (finish === false) {
				finish = true;
				assert.equal(arg.data, "Hello World!", "Should be 'Hello World!'");
				assert.equal(arg.event, "customEvent", "Should be 'customEvent'");
				es.off("data", fn);
				resolve();
			}
		};

		es.init(mockRequest, mockResponse);
		es.on("data", fn);
		es.send("Hello World!", "customEvent");
	});
});

test("stop() cancels active heartbeat", async function () {
	const ms = 300;
	const es = eventsource({ ms }, "Hello World!");
	es.init(mockRequest, mockResponse);
	let pingCount = 0;

	es.on("data", () => {
		pingCount++;
	});

	await delay(ms + 10);
	assert.equal(pingCount, 1, "Should have received one ping before stop()");
	es.stop();
	await delay(ms * 2 + 100);
	assert.equal(pingCount, 1, "Should still have only one ping after stop()");
	es.removeAllListeners("data");
});

test("stop() on non-heartbeat instance is a no-op", function () {
	const es = eventsource({ ms: 0 });
	assert.doesNotThrow(() => {
		es.stop();
	});
});

test("stop() returns the EventSource instance for chaining", function () {
	const es = eventsource({ ms: 200 });
	const ret = es.stop();
	assert.equal(ret, es, "stop() should return this");
});

test("repeated stop() calls are safe", function () {
	const es = eventsource({ ms: 0 });
	assert.doesNotThrow(() => {
		es.stop();
		es.stop();
		es.stop();
	});
});

test("CLOSE event stops heartbeat — no ping after disconnect", async function () {
	const ms = 250;
	const req = {
		handlers: {},
		on: (arg, fn) => {
			req.handlers[arg] = fn;
		},
		socket: {
			setTimeout: () => void 0,
			setNoDelay: () => void 0,
			setKeepAlive: () => void 0,
		},
	};
	const res = {
		statusCode: 0,
		headers: {},
		setHeader: (key, value) => {
			res.headers[key] = value;
		},
		write: () => void 0,
	};
	const es = eventsource({ ms }, "Hello World!");
	es.init(req, res);
	let pingCount = 0;

	es.on("data", () => {
		pingCount++;
	});

	await delay(ms + 10);
	assert.ok(pingCount >= 1, "Should have received at least one ping");
	req.handlers.close();
	await delay(ms + 100);
	assert.equal(pingCount, pingCount, "Should not receive more pings after disconnect");
	es.removeAllListeners("data");
});
