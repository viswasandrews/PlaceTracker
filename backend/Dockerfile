FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8800
CMD ["npm", "run", "viswas"]