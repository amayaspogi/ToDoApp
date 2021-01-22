FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app

ARG VERSION
ENV VERSION=$VERSION

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS build
WORKDIR /src
COPY ./Portal ./Portal

WORKDIR ./Portal
RUN dotnet build -c Release -o /build

FROM build AS publish
RUN dotnet publish -c Release -o /publish
RUN rm -rf ./ClientApp

FROM base AS final
COPY --from=publish /publish /app

FROM node:latest AS node
WORKDIR /src

COPY ./Portal/ClientApp/package*.json ./
RUN npm install

COPY ./Portal/ClientApp .
RUN npm run build

FROM final AS final-node
COPY --from=node /src/dist /app/dist

WORKDIR /app
ENTRYPOINT ["dotnet", "Portal.dll"]
