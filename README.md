#DWA Project 4

##Description
A real-time chat website with rooms. All changes are pushed to everyone viewing the website via Server Sent Events.

##Live URL
<http://p4.dwa.sebastian.io/>

##Demo
<http://screencast.com/t/8HyVWc8yo8W>

##Details for teaching team
My project, while using primarily Laravel and MySQL, also uses several other technologies. It uses NodeJS for pushing realtime updates to users, and Redis in order to enable pub/sub style communication between Laravel and NodeJS.

It also relies heavily on Server Sent Events which are not supported in all browsers (see <http://caniuse.com/#feat=eventsource>). Most notably, it won't work in any version of Internet Explorer.

Also, not all browsers have implemented the protocol the same way, and while the standard states that the browser should automatically reconnect after being disconnected, not all browsers do this. So if you enter a message and nothing happens, try refreshing the page.

##Outside code
- <http://laravel.com/>
- <http://nodejs.org/>
- <http://necolas.github.io/normalize.css/>
- <http://getskeleton.com/>
- <http://expressjs.com/>
- <http://redis.io/>
