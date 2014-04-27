module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                debug: false,
                force: true,
                undef: true,
                devel: true,
                browser: true,
                globals: {
                    "Game": true,
                    "Lynx": true,
                    "_": true,
                    "World": true
                },
                ignores: ["vendor/*"]
            },
            all: 'js/**/*.js'
        },

        concat: {
            main: {
                files: {
                    'dist/js/main.js': ['js/game.js', 'js/entities/actions/action.js', 'js/items/item.js', 'js/UI/menus/Menu.js', 'js/entities/entity.js', 'js/**/*.js'],


                }
            },
            vendors: {
                files: {
                    'dist/js/vendor.js': ["vendor/lodash.js"],
                }
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/js/main.min.js': 'dist/js/main.js'
                }
            },
            vendors: {
                files: {
                    'dist/js/vendor.min.js': 'dist/js/vendor.js',
                }
            }
        },
        connect: {
            server: {
                options: {
                    base: 'dist',
                    port: 9001
                }
            }
        },
        shell: {
            ulimit: {
                command: 'ulimit -n 1000'
            }
        },
        watch: {

            main: {
                files: ['js/**/*.js'],
                tasks: ['jshint', 'concat:main']
            },
            vendors: {
                files: ['vendor/**/*.js'],
                tasks: ['concat:vendors']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-shell');      // Default task.

    grunt.registerTask('default', ['shell', 'jshint', 'concat', /*'uglify',*/ 'connect', 'watch']);

};