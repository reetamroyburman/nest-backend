🐳 Docker Cheat Sheet – Zero to Pro

1️⃣ Docker Basics
| Command               | Description                   | Example                      |
| --------------------- | ----------------------------- | ---------------------------- |
| `docker --version`    | Check Docker version          | `docker --version`           |
| `docker info`         | Show Docker system info       | `docker info`                |
| `docker help`         | Show Docker help              | `docker help`                |
| `docker pull <image>` | Pull an image from Docker Hub | `docker pull node:22-alpine` |
| `docker images`       | List local images             | `docker images`              |
| `docker rmi <image>`  | Remove an image               | `docker rmi node:22-alpine`  |


2️⃣ Container Management
| Command                          | Description                      | Example                                                       |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------- |
| `docker ps`                      | List running containers          | `docker ps`                                                   |
| `docker ps -a`                   | List all containers              | `docker ps -a`                                                |
| `docker run <options> <image>`   | Run a container                  | `docker run -d -p 9000:9000 --name nest-backend nest-backend` |
| `docker exec -it <container> sh` | Open terminal in container       | `docker exec -it nest-backend sh`                             |
| `docker stop <container>`        | Stop a running container         | `docker stop nest-backend`                                    |
| `docker start <container>`       | Start a stopped container        | `docker start nest-backend`                                   |
| `docker restart <container>`     | Restart container                | `docker restart nest-backend`                                 |
| `docker rm <container>`          | Remove container                 | `docker rm nest-backend`                                      |
| `docker logs <container>`        | View container logs              | `docker logs nest-backend`                                    |
| `docker attach <container>`      | Attach to container stdin/stdout | `docker attach nest-backend`                                  |


3️⃣ Build & Run Images
| Command                                       | Description                         | Example                                                |
| --------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `docker build -t <tag> .`                     | Build image from Dockerfile         | `docker build -t nest-backend .`                       |
| `docker run -d -p <host>:<container> <image>` | Run container in background         | `docker run -d -p 9000:9000 nest-backend`              |
| `docker run -it --rm <image> sh`              | Temporary interactive container     | `docker run -it --rm node:22-alpine sh`                |
| `docker build --no-cache -t <tag> .`          | Build image without cache           | `docker build --no-cache -t nest-backend .`            |
| `docker run --env-file .env <image>`          | Run container with environment file | `docker run --env-file .env -p 9000:9000 nest-backend` |


4️⃣ Dockerfile Essentials
| Instruction              | Description                           | Example                                        |
| ------------------------ | ------------------------------------- | ---------------------------------------------- |
| `FROM <image>`           | Base image                            | `FROM node:22-alpine`                          |
| `WORKDIR <path>`         | Set working directory                 | `WORKDIR /usr/src/app`                         |
| `COPY <src> <dest>`      | Copy files                            | `COPY package*.json ./`                        |
| `RUN <command>`          | Execute command during build          | `RUN npm install`                              |
| `CMD ["command"]`        | Default command when container starts | `CMD ["node", "dist/main.js"]`                 |
| `EXPOSE <port>`          | Expose port                           | `EXPOSE 9000`                                  |
| `ENV <key>=<value>`      | Set environment variable              | `ENV NODE_ENV=production`                      |
| `ENTRYPOINT ["command"]` | Entrypoint command                    | `ENTRYPOINT ["npm", "start"]`                  |
| `COPY --from=builder`    | Multi-stage build copy                | `COPY --from=builder /usr/src/app/dist ./dist` |


5️⃣ Docker Volumes
| Command                         | Description            | Example                                            |
| ------------------------------- | ---------------------- | -------------------------------------------------- |
| `docker volume create <name>`   | Create volume          | `docker volume create db-data`                     |
| `docker volume ls`              | List volumes           | `docker volume ls`                                 |
| `docker volume inspect <name>`  | Inspect volume         | `docker volume inspect db-data`                    |
| `docker volume rm <name>`       | Remove volume          | `docker volume rm db-data`                         |
| `docker run -v <volume>:<path>` | Mount volume           | `docker run -d -v db-data:/var/lib/mysql mysql`    |
| `docker run -v $(pwd):/app`     | Bind mount host folder | `docker run -v $(pwd):/usr/src/app node:22-alpine` |


6️⃣ Docker Networks
| Command                         | Description                  | Example                                     |
| ------------------------------- | ---------------------------- | ------------------------------------------- |
| `docker network ls`             | List networks                | `docker network ls`                         |
| `docker network create <name>`  | Create network               | `docker network create backend-net`         |
| `docker network inspect <name>` | Inspect network              | `docker network inspect backend-net`        |
| `docker run --network <name>`   | Connect container to network | `docker run --network backend-net -d mysql` |


7️⃣ Docker Compose (Advanced)
| Command                            | Description                      | Example                               |
| ---------------------------------- | -------------------------------- | ------------------------------------- |
| `docker-compose up -d`             | Start all services in background | `docker-compose up -d`                |
| `docker-compose down`              | Stop and remove services         | `docker-compose down`                 |
| `docker-compose build`             | Build images                     | `docker-compose build`                |
| `docker-compose logs`              | Show logs of all services        | `docker-compose logs -f`              |
| `docker-compose exec <service> sh` | Enter service container          | `docker-compose exec nest-backend sh` |
| `docker-compose ps`                | List running services            | `docker-compose ps`                   |


8️⃣ Image & Container Cleanup
| Command                          | Description                                        | Example                          |
| -------------------------------- | -------------------------------------------------- | -------------------------------- |
| `docker system prune`            | Remove stopped containers, unused networks, images | `docker system prune -f`         |
| `docker system prune -a`         | Remove everything unused including images          | `docker system prune -a -f`      |
| `docker rmi $(docker images -q)` | Remove all images                                  | `docker rmi $(docker images -q)` |
| `docker rm $(docker ps -aq)`     | Remove all containers                              | `docker rm $(docker ps -aq)`     |
| `docker volume prune`            | Remove unused volumes                              | `docker volume prune -f`         |


9️⃣ Debugging Tips
docker logs <container> → Check why container crashed

docker exec -it <container> sh → Explore inside container

docker inspect <container> → Detailed container info

docker diff <container> → Show changes inside container filesystem

Always check .dockerignore to reduce image size



🔟 Multi-stage Build Example (Best Practice)
# BUILD STAGE
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# RUN STAGE
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 9000
CMD ["node", "dist/main.js"]


1️⃣1️⃣ Hot Reload / Dev Mode Example
docker run -it --rm -v $(pwd):/usr/src/app -w /usr/src/app -p 3000:3000 node:22-alpine sh
npm install
npm run start:dev


1️⃣2️⃣ Quick Dockerfile Tips
Always use .dockerignore for node_modules, dist, .git

Use multi-stage builds for small production images

Expose only necessary ports

Always set 0.0.0.0 in listen() for network access


1️⃣3️⃣ Common Environment Variable Gotchas
No spaces: PORT=9000 ✅, PORT = 9000 ❌

No quotes unless necessary: DB_DIALECT=mysql

Use .env with --env-file in Docker

Match container port and app port




--------------------------

1️⃣ Interactive Mode (-it)

Definition:
Interactive mode lets you attach a terminal to the container, so you can interact with it as if it’s a normal shell on your machine.

-i → Keep STDIN open (input)

-t → Allocate a pseudo-TTY (terminal interface)

Use case:

You want to run commands inside the container manually.

Good for debugging, testing, or running temporary containers.

Example:

docker run -it node:22-alpine sh


What happens:

You get a shell prompt inside the container:

/usr/src/app #


You can run commands: node, npm install, etc.

To exit:

Type exit → container stops

Or press Ctrl + D

Any server you start inside this container (e.g., npm run start:dev) runs in your terminal, and you can stop it with Ctrl + C.

2️⃣ Detached Mode (-d)

Definition:
Detached mode runs the container in the background, without attaching your terminal to it.

-d → Detached

Container runs independently of your shell.

Use case:

Running a server that should keep running in the background (like NestJS, MySQL, Redis).

You don’t need to interact with it immediately.

Example:

docker run -d -p 9000:9000 --name nest-backend nest-backend


What happens:

Container starts in the background.

You see the container ID output, but no logs appear in your terminal.

To view logs:

docker logs -f nest-backend


To stop the container:

docker stop nest-backend


To attach and interact:

docker attach nest-backend

3️⃣ Quick Comparison Table
Feature	Interactive Mode (-it)	Detached Mode (-d)
Terminal attached?	✅ Yes	❌ No
Runs in background?	❌ No	✅ Yes
Can stop with Ctrl + C?	✅ Yes	❌ Must use docker stop
Best for	Debugging, testing, shell access	Running servers, services in background
Example	docker run -it node:22-alpine sh	docker run -d -p 9000:9000 nest-backend

💡 Pro tip:

For development, use -it so you can see logs and test commands interactively.

For production or long-running services, use -d so the container keeps running in the background.
