FROM node:20
WORKDIR /
COPY . .
EXPOSE 9000
CMD ["npm", "run", "dev"]
