
.PHONY: dep run build docker release install test deploy

run:
	ng serve

build:
	ng build --prod --aot

runprod: build
	ruby -run -e httpd ./dist/ -p 8080

deploy: build
	firebase deploy
