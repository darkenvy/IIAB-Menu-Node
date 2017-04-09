## How To Use
1. cd into /library
2. `Git pull` & cd into the folder you just pulled
3. `npm install`
4. node node_modules/gulp/bin/gulp.js

No official deamon is used currently. `forever` will probably be used. We are using gulp.js for development as it injects browser-sync into the page for development convenience.


When using gulp, we host on port 4000, gulp proxies to port 8080, and we use iptables to redirect port 80 to 8080 (or 8081 if 8080 is bound to). Yes, gulp probably doesn't need to proxy, but during development it got built up this way; seeing as this is a development tool, it's not worth spending time to adjust.


We will need to unbind port 80 from Apache and bind Apache to port 81 (currently not reserved to my knowledge)

vim `/etc/https/conf/httpd.conf` => line42: change "listen 80" to "listen 81"

`sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8080`

## Why?
* With this setup, we can identify content packs on the fly. Specifically, only on node start/restart.
* The rendering is done by the server instead of the client. The rendered results contain no JS and we can even push back our HTML to HTML4 standards.
* This results in higher compatibility and REALLY small transfer sizes.
* By IDing content packs on the fly, further development can be done to create a content manager & sharing tool.
* If a content pack does not have a json (used for metadata), one is generated.
* Every zim now gets it's own frontpage section. Trying to avoid ever seeing the kiwix zim-selector as it's an extra menu that can be avoided.
* The design is now responsive (mobile, tablet, desktop)

## ToDo
* Extra_HTML
	* The *Extra_HTML* portion is not loaded correctly. Because it is loading from an external file, I cannot perorm interpolation. This causes problems with link creation.
	* Creating a format inside JSON is the solution. Right now, each extra_html can be entirely different. We need unification
* Create a button that changes view.
  * Already implemented, but a cookie to save the view would need to be implemented
* Choices of favorite content packs per user (using cookies or local storage)