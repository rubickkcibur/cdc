From node:lts-buster as build
WORKDIR kashv
RUN yarn config set registry https://registry.npm.taobao.org/
COPY package.json .
RUN yarn 
COPY . .
RUN yarn next build
CMD yarn next start 

