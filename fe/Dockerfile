From node:lts-buster as build
WORKDIR kash_v
COPY package.json .
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn 

COPY . .
RUN yarn next build
CMD yarn next start 

