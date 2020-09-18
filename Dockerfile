FROM node:12.18.4-buster
WORKDIR /usr/src/smart
COPY ./ ./
RUN npm install
CMD ["/bin/bash"]