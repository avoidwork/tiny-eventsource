module.exports = function (grunt) {
	grunt.initConfig({
		eslint: {
			target: [
				"Gruntfile.js",
				"test/**.js",
				"index.js"
			]
		},
		nodeunit: {
			all: ["test/*.js"]
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");

	// aliases
	grunt.registerTask("test", ["eslint", "nodeunit"]);
	grunt.registerTask("default", ["test"]);
};
