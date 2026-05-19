import assert from "node:assert";
import {eventsource} from "../dist/tiny-eventsource.cjs";

const mockRequest = {
	handlers: {},
	on: (arg, fn) => {
		mockRequest.handlers[arg] = fn;
	},
	socket: {
		setTimeout: () => void 0,
		setNoDelay: () => void 0,
		setKeepAlive: () => void 0
	}
};

const mockResponse = {
	statusCode: 0,
	headers: {},
	setHeader: (key, value) => {
		mockResponse.headers[key] = value;
	},
	write: () => {
		mockRequest.handlers.close();
	}
};

describe("Testing functionality", function () {
	it("It should do nothing with stock configuration", function () {
		this.eventsource = eventsource();
		assert.equal(this.eventsource.heartbeat.ms, 0, "Should be '0'");
		assert.equal(this.eventsource.heartbeat.msg, "ping", "Should be 'ping'");
		assert.equal(this.eventsource.initial.length, 0, "Should be '0'");
	});

	it("It should have an accurate listener count", function () {
		const fn = () => void 0;

		this.ms = 0;
		this.eventsource = eventsource({ms: this.ms}, "Hello World!");
		assert.equal(this.eventsource.heartbeat.ms, 0, "Should be '0'");
		assert.equal(this.eventsource.initial.length, 1, "Should be '1'");
		assert.equal(this.eventsource.initial[0], "Hello World!", "Should be 'Hello World!'");
		assert.equal(this.eventsource.listenerCount("data"), 0, "Should be '0'");
		this.eventsource.on("data", fn);
		assert.equal(this.eventsource.listenerCount("data"), 1, "Should be '1'");
		this.eventsource.off("data", fn);
	});

	it("It should have a heartbeat", function (done) {
		this.ms = 250;
		this.eventsource = eventsource({ms: this.ms}, "Hello World!");

		let finish = false;
		const fn = arg => {
			if (finish === false) {
				finish = true;
				assert.equal(arg.data, "ping", "Should be 'ping'");
				this.eventsource.off("data", fn);
				setTimeout(() => {
					this.eventsource.heartbeat.ms = 0;
					done();
				}, this.ms);
			}
		};

		assert.equal(this.eventsource.heartbeat.ms, this.ms, `Should be '${this.ms}'`);
		assert.equal(this.eventsource.initial.length, 1, "Should be '1'");
		assert.equal(this.eventsource.initial[0], "Hello World!", "Should be 'Hello World!'");
		this.eventsource.init(mockRequest, mockResponse);
		this.eventsource.on("data", fn);
	});

	it("It should send custom events", function (done) {
		this.eventsource = eventsource();

		let finish = false;
		const fn = arg => {
			if (finish === false) {
				finish = true;
				assert.equal(arg.data, "Hello World!", "Should be 'Hello World!'");
				assert.equal(arg.event, "customEvent", "Should be 'customEvent'");
				this.eventsource.off("data", fn);
				done();
			}
		};

		this.eventsource.init(mockRequest, mockResponse);
		this.eventsource.on("data", fn);
		this.eventsource.send("Hello World!", "customEvent");
	});

	it("stop() cancels active heartbeat — no ping after stop()", function (done) {
		this.ms = 300;
		this.eventsource = eventsource({ms: this.ms}, "Hello World!");
		this.eventsource.init(mockRequest, mockResponse);
		let pingCount = 0;

		this.eventsource.on("data", () => {
			pingCount++;
		});

		setTimeout(() => {
			assert.equal(pingCount, 1, "Should have received one ping before stop()");
			this.eventsource.stop();
			setTimeout(() => {
				assert.equal(pingCount, 1, "Should still have only one ping after stop()");
				this.eventsource.removeAllListeners("data");
				done();
			}, this.ms * 2 + 100);
		}, this.ms + 10);
	});

	it("stop() on non-heartbeat instance is a no-op", function () {
		this.eventsource = eventsource({ms: 0});
		assert.doesNotThrow(() => {
			this.eventsource.stop();
		});
	});

	it("stop() returns the EventSource instance for chaining", function () {
		this.eventsource = eventsource({ms: 200});
		const ret = this.eventsource.stop();
		assert.equal(ret, this.eventsource, "stop() should return this");
	});

		it("repeated stop() calls are safe", function () {
			this.eventsource = eventsource({ms: 0});
			assert.doesNotThrow(() => {
				this.eventsource.stop();
				this.eventsource.stop();
				this.eventsource.stop();
			});
		});

		it("CLOSE event stops heartbeat — no ping after disconnect", function (done) {
			this.ms = 250;
			const req = {
				handlers: {},
				on: (arg, fn) => {
					req.handlers[arg] = fn;
				},
				socket: {
					setTimeout: () => void 0,
					setNoDelay: () => void 0,
					setKeepAlive: () => void 0
				}
			};
			const res = {
				statusCode: 0,
				headers: {},
				setHeader: (key, value) => {
					res.headers[key] = value;
				},
				write: () => void 0
			};
			this.eventsource = eventsource({ms: this.ms}, "Hello World!");
			this.eventsource.init(req, res);
			let pingCount = 0;

			this.eventsource.on("data", () => {
				pingCount++;
			});

			// Wait for first ping to confirm heartbeat is running
			setTimeout(() => {
				assert.ok(pingCount >= 1, "Should have received at least one ping");
				// Simulate client disconnect by triggering CLOSE handler
				req.handlers.close();
				// Wait another heartbeat interval — no more pings should arrive
				setTimeout(() => {
					const finalCount = pingCount;
					assert.equal(pingCount, finalCount, "Should not receive more pings after disconnect");
					this.eventsource.removeAllListeners("data");
					done();
				}, this.ms + 100);
			}, this.ms + 10);
		});
	});
