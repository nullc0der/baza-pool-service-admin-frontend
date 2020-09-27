FROM debian:buster-slim
LABEL maintainer Prasanta Kakati <prasantakakati@baza.foundation>
RUN apt update
RUN apt install --yes nodejs curl
RUN curl -L https://npmjs.org/install.sh | sh
RUN npm install -g yarn
RUN yarn global add serve
RUN mkdir /baza-pool-service-frontend
WORKDIR /baza-pool-service-frontend
COPY . /baza-pool-service-frontend
CMD ["sh", "start.sh"]
