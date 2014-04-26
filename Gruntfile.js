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
                jquery: true,
                globals: {
                    "App": true,
                    "api": true,
                    "getReportButton": true,
                    "array2ints": true,
                    "array2strings": true,
                    "codes": true,
                    "Ember": true,
                    "Em": true,
                    "_": true,
                    "moment": true,
                    "Handlebars": true,
                    "io": true,
                    "CoSConfig": true
                },
                ignores: ["source/vendor/*"]       
            },
            all: 'source/**/*.js'        
        },

        concat: {
            main: {
                files: {
                    'dist/js/main.js': ['js/**/*.js'],

                }
            },
            // vendors: {
            //     files: {
            //         'dist/js/vendor.js': ["src/Lynx.js"],
            //     }
            // }
        },
        uglify: {
            main: {
                files: {
                    'dist/js/main.min.js': 'dist/js/main.js'
                }
            },
            // vendors: {
            //     files: {
            //         'dist/js/vendor.min.js': 'dist/js/vendor.js',
            //     }
            // }
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
            // vendors: {                
            //     files: ['src/**/*js'],
            //     tasks: ['concat:vendors']            
            // }
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
        
    grunt.registerTask('default', ['shell', 'jshint', 'concat', 'uglify', 'connect', 'watch']);

};