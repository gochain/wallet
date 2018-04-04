
.PHONY: dep build docker release install test deploy

build:
	ng build --prod --aot

runprod:
	ruby -run -e httpd ./dist/ -p 8080

deploy:
	firebase deploy
