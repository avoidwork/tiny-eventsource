import assert from "node:assert";
import {eventsource} from "../dist/tiny-eventsource.cjs";

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
				done();
			}
		};

		assert.equal(this.eventsource.heartbeat.ms, this.ms, `Should be '${this.ms}'`);
		assert.equal(this.eventsource.initial.length, 1, "Should be '1'");
		assert.equal(this.eventsource.initial[0], "Hello World!", "Should be 'Hello World!'");
		this.eventsource.init();
		this.eventsource.on("data", fn);
	});
});
