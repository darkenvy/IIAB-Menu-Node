##How To Use
1. `Git pull`
2. cd into directory & `npm install`
3. `sudo npm install -g forever`
4. `forever start index.js` OR `node index.js`

Forever is used as a wrapper to ensure that injex.js is always running.

Right now, during development, we are using port 4000 as to not conflict with the current menu. Be sure to allow this port in IPTables

`iptables -I INPUT -p tcp --dport 4000 -j ACCEPT`


##ToDo
* Extra_HTML
	* The *Extra_HTML* portion is not loaded correctly. Because it is loading from an external file, I cannot perorm interpolation. This causes problems with link creation.
	* Creating a format inside JSON is the solution. Right now, each extra_html can be entirely different. We need unification