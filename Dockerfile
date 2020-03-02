FROM node:10-stretch

EXPOSE 8080
ENV DISPLAY=:99

RUN apt-get update 
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install \
  libegl1-mesa-dev \
  libgles2-mesa-dev \
  libcairo2-dev \
  libgbm-dev \
  libllvm3.9 \
  xvfb \
  x11-utils
RUN apt-get autoremove -y

WORKDIR /app
COPY . .
RUN npm install --production
RUN chmod +x /app/start.sh

ENTRYPOINT [ "/app/start.sh" ]
