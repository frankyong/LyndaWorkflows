$ = require 'jquery'

do fill = (item = 'Creative minds in art!') -> 
	$('.tagline').append "#{item}"
fill