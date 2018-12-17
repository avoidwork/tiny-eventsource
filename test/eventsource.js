const path = require("path"),
	eventsource = require(path.join("..", "index.js"));

module.exports = {
	listeners: {
		setUp: function (done) {
			this.eventsource = eventsource();
			done();
		},
		test: function (test) {
			test.expect(2);
			test.equal(this.eventsource.listenerCount("data"), 0, "Should be '0'");
			this.eventsource.on("data", () => console.log("Hello World!"));
			test.equal(this.eventsource.listenerCount("data"), 1, "Should be '1'");
			test.done();
		}
	}
};
