WatoCMS
=======

To Install (warning ubuntu instructions ahead)

## Step One: Node

	sudo apt-get install nodejs
	sudo apt-get install npm

## Step Two: Mongo

	sudo apt-get install mongodb
	sudo service mongodb start

## Step Three: Nginx

	sudo apt-get install nginx
	sudo service nginx start
	cd /etc/nginx/sites-enabled
	mv default <yoursitesname>
	sudo vi <yoursitesname>

copy and paste this:

	upstream app_wato {
    	server 127.0.0.1:8126;
	} 
	server { 
        listen 0.0.0.0:80;
        server_name <yoursitesname>.com <yoursitesname>;
        location / { 
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://app_wato; 
            proxy_redirect off;
        }
	}

then
	
	sudo service nginx restart

## Step Four: WatoCMS

	cd /wherever/you/feel/like
	git clone http://github.com/robinsr/WatoCMS_express
	cd WatoCMS_express
	npm install
	forever start app.js

aaaaaand your done

