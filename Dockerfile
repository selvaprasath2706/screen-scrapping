FROM  --platform=linux/amd64 node:16
# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./
COPY .puppeteerrc.cjs ./
RUN npm install pnpm -g
RUN pnpm install

COPY . .

EXPOSE 3001
CMD [ "pnpm", "dev-start" ]

# FROM node:14-slim
# #Create app directory
# RUN mkdir -p /usr/src
# WORKDIR /usr/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)

# COPY package*.json ./
# COPY .puppeteerrc.cjs ./
# RUN npm install 

# COPY . .

# EXPOSE 3001
# CMD [ "npm", "dev-start" ]
# FROM node:16

# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)

# COPY package*.json ./
# COPY .puppeteerrc.cjs ./
# RUN npm install pnpm -g
# RUN pnpm install

# COPY . .

# EXPOSE 3001


# FROM node:14-slim


# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*


# RUN npm init -y &&  \
#     npm i puppeteer \
#     # Add user so we don't need --no-sandbox.
#     # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
#     && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /node_modules \
#     && chown -R pptruser:pptruser /package.json \
#     && chown -R pptruser:pptruser /package-lock.json

# # Run everything after as non-privileged user.
# USER pptruser

# WORKDIR /usr/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)

# COPY package*.json ./
# COPY .puppeteerrc.cjs ./
# RUN npm install pnpm -g
# RUN pnpm install

# COPY . .

# EXPOSE 3001
# CMD [ "pnpm", "dev-start" ]
# # # Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# # ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# # # Puppeteer v13.5.0 works with Chromium 100.
# # RUN yarn add puppeteer@13.5.0

# # # Add user so we don't need --no-sandbox.
# # RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
# #     && mkdir -p /home/pptruser/Downloads /app \
# #     && chown -R pptruser:pptruser /home/pptruser \
# #     && chown -R pptruser:pptruser /app

# # # Run everything after as non-privileged user.
# # USER pptruser
# # WORKDIR /usr/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)

# # COPY package*.json ./
# # COPY .puppeteerrc.cjs ./
# # RUN npm install pnpm -g
# # RUN pnpm install

# # COPY . .

# # EXPOSE 3001
# # CMD [ "pnpm", "dev-start" ]

# # FROM node:slim

# # # We don't need the standalone Chromium
# # ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # RUN  apt-get update \
# #     && apt-get install -y wget gnupg ca-certificates \
# #     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
# #     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
# #     && apt-get update \
# #     && apt-get install -y google-chrome-stable \
# #     && rm -rf /var/lib/apt/lists/* \
# #     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
# #     && chmod +x /usr/sbin/wait-for-it.sh
