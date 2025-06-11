FROM node:20-alpine

RUN apk update && \
    apk add git

WORKDIR /app

RUN git clone https://github.com/LiveChurchSolutions/MembershipApi.git .

RUN git submodule init && git submodule update

RUN npm install

CMD npm run initdb && npm run $API_ENV

EXPOSE 8083
