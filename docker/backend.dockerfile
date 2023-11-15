FROM maven:3.8.6-eclipse-temurin-17 AS build
ENV HOME=/usr/app/backend
RUN mkdir -p $HOME
WORKDIR $HOME
ADD backend/pom.xml $HOME
RUN mvn verify --fail-never
ADD backend $HOME
RUN mvn clean package -DskipTests

FROM openjdk:17.0.2-slim
WORKDIR /app
COPY --from=build /usr/app/backend/target/trkpo-0.1.0.jar /app/
CMD [ "java", "-jar", "/app/trkpo-0.1.0.jar"]
