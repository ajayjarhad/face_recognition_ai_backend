FROM node:12.18.4-buster
WORKDIR /usr/src/theApp
COPY ./ ./
CMD ["rm -rf node_modules"]
RUN npm install -g nodemon
RUN npm install
EXPOSE 3552
CMD ["/bin/bash"]