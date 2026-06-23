FROM node:22-slim AS build
WORKDIR /app
# build context = repo 根（需 packages/spec 供 /spec、/knowledge 讀取）
COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
RUN cd apps/api && npm install
COPY apps/api ./apps/api
COPY packages/spec ./packages/spec
RUN cd apps/api && npm run build

FROM node:22-slim
WORKDIR /app/apps/api
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/packages/spec /app/packages/spec
EXPOSE 3000
CMD ["node", "dist/main.js"]
