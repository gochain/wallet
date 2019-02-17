FROM node:8-alpine  as frontend_builder
WORKDIR /wallet
RUN apk add --no-cache make
ADD . /wallet
RUN npm install -g @angular/cli && npm rebuild node-sass && npm i && rm -rf dist/wallet && ng build --aot


FROM nginx:alpine

# copy artifact build from the 'build environment'
COPY --from=frontend_builder /wallet/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]