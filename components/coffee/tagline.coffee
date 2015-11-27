$ = require 'jquery'

do fill = (item = 'The creative minds in art@#$#@!!') -> 
	$('.tagline').append "#{item}"
fill