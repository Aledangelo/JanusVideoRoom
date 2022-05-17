FROM node:16
# Create app directory
WORKDIR /usr/src/app 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=productio

# Bundle app source
COPY . .
ENV USER=greentownvalidator@gmail.com
ENV PASS=joXro8-fatgem-faxris
ENV MONGO=mongodb+srv://Michelle:hello@cluster0.pi64r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
ENV JWT=jldtbo8eelemaprkd
ENV CERT=uninawebrtc

EXPOSE 8008

CMD [ "npm", "start" ]