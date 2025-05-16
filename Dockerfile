# 1. 빌드 스테이지: Node.js를 사용해 Vue CLI로 빌드
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. 배포 스테이지: Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드 결과물을 Nginx html 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]