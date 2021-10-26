# The image is built on top of one that has node preinstalled
FROM bitnami/node:14 as builder

ENV NODE_ENV=""

# Copy app's source code to the /app directory
COPY . /app

# The application's directory will be the working directory
WORKDIR /app

RUN chmod 777 -R /app/*

# Install dependencies
RUN npm install -g --unsafe-perm

RUN npm install -g @vue/cli
RUN npm install -g @vue/cli-service
RUN npm install

# Create a non-root user
# RUN useradd -r -u 1001 -g root nonroot
# RUN chown -R nonroot /app
# USER nonroot


ARG PORT=8080
ENV PORT=${PORT}

EXPOSE ${PORT}

# Start the application
CMD  ["npm", "run", "serve"]
