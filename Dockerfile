FROM node:latest

EXPOSE 3000

RUN mkdir -p /opt/organization
WORKDIR /opt/organization

COPY . /opt/organization
RUN rm -rf /opt/organization/node_modules
RUN npm install

CMD ["bash", "-c", "node index.js" ]