FROM lefuturiste/vue-spa
LABEL maintainer="contact@thingmill.fr"
ADD . /app
RUN npm install
RUN npm run build
