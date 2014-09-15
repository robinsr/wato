NPM=npm

BIN=node_modules/.bin
BOWER=$(BIN)/bower
GRUNT=$(BIN)/grunt
NOD=node_modules/nodemon/bin/nodemon.js

install: clean-deps
	@$(NPM) install
	@$(BOWER) install

test:
	@$(GRUNT) test

run-dev:
	@$(NOD) src/server/app.js