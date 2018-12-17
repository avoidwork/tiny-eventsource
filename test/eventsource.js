const path = require("path"),
	eventsource = require(path.join("..", "index.js"));

module.exports = {
	heartbeat: {
		setUp: function (done) {
			this.ms = 250;
			this.eventsource = eventsource({ms: this.ms}, "Hello World!");
			done();
		},
		test: function (test) {
			test.expect(4);
			test.equal(this.eventsource.heartbeat.ms, this.ms, `Should be '${this.ms}'`);
			test.equal(this.eventsource.initial.length, 1, "Should be '1'");
			test.equal(this.eventsource.initial[0], "Hello World!", "Should be 'Hello World!'");
			this.eventsource.init();
			this.eventsource.on("data", arg => {
				test.equal(arg.data, "ping", "Should be 'ping'");
				test.done();
			});
		}
	},
	listeners: {
		setUp: function (done) {
			this.eventsource = eventsource("Hello World!");
			done();
		},
		test: function (test) {
			test.expect(5);
			test.equal(this.eventsource.heartbeat.ms, 0, "Should be '0'");
			test.equal(this.eventsource.initial.length, 1, "Should be '1'");
			test.equal(this.eventsource.initial[0], "Hello World!", "Should be 'Hello World!'");
			test.equal(this.eventsource.listenerCount("data"), 0, "Should be '0'");
			this.eventsource.on("data", arg => console.log(arg));
			test.equal(this.eventsource.listenerCount("data"), 1, "Should be '1'");
			test.done();
		}
	},
	stock: {
		setUp: function (done) {
			this.eventsource = eventsource();
			done();
		},
		test: function (test) {
			test.expect(3);
			test.equal(this.eventsource.heartbeat.ms, 0, "Should be '0'");
			test.equal(this.eventsource.heartbeat.msg, "ping", "Should be 'ping'");
			test.equal(this.eventsource.initial.length, 0, "Should be '0'");
			test.done();
		}
	}
};
