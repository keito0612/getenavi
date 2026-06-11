FROM node:24-alpine

WORKDIR /app

# 開発用ツールのインストール
RUN apk add --no-cache libc6-compat

# コンテナを起動し続ける
CMD ["tail", "-f", "/dev/null"]
