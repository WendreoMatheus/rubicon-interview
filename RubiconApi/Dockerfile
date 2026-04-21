# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore first for better layer cache
COPY RubiconApi.csproj ./
RUN dotnet restore RubiconApi.csproj

# Copy the rest and publish
COPY . .
RUN dotnet publish RubiconApi.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:5000 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 5000

ENTRYPOINT ["dotnet", "RubiconApi.dll"]
