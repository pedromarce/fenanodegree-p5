exports.config = {
	paths: {
		public: 'public',
		watched: ['app']
	},
	conventions: {
		assets: /(assets)/
	},
	modules: {
		wrapper: false,
		definition: false
	},
	files: {
		javascripts: {
			joinTo: {
				'js/app.js': /^app/,
				'js/vendor.js': /^(bower_components)/
			},
			order: {
				before: [
					'bower_components/console-polyfill/index.js',
					'bower_components/jquery/dist/jquery.js'
				],
				after: [
					'bower_components/bootstrap/js/tooltip.js',
					'bower_components/bootstrap/js/popover.js',
					'bower_components/bootstrap/js/collapse.js',
					'bower_components/bootstrap/js/transition.js'
				]
			}
		},
		stylesheets: {
			joinTo: {
				'css/app.css': /^(app|bower_components)/
			},
			order: {
			}
		}
	},
  sourceMaps: true
};