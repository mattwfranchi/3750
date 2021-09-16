FROM ubuntu:latest

RUN apt-get update

RUN apt-get --yes --force-yes install curl

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt install --yes --force-yes nginx nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt update && apt --yes --force-yes install yarn

RUN npm install create-react-app --global

ENV PUBLIC_URL=/project6

RUN mkdir -p /app

WORKDIR /app

