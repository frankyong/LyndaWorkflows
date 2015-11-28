$ = require 'jquery'

do fill = (item = 'asdfasCreative minds in art!') -> 
	$('.tagline').append "#{item}"
fill