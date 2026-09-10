# syntax=docker/dockerfile:1

# Etapa de build (Java 21).
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -q -B -e -DskipTests dependency:go-offline || true

COPY src ./src
# Empaquetar la aplicación
RUN ./mvnw -q -B -DskipTests package

# Etapa de runtime (imagen ligera).
FROM eclipse-temurin:21-jre
ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENV TZ=${TZ:-UTC}
WORKDIR /app

# Copiar jar generado
COPY --from=build /app/target/*.jar app.jar

# Config: permite que Spring lea /app/config/application.properties si existe
ENV SPRING_CONFIG_ADDITIONAL_LOCATION="optional:file:/app/config/"
ENV SPRING_CONFIG_IMPORT="optional:file:/app/config/application.properties"

# Asegura bind y puerto por defecto
ENV SERVER_ADDRESS=0.0.0.0
ENV SERVER_PORT=8082
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.address=${SERVER_ADDRESS} -Dserver.port=${SERVER_PORT} -Duser.timezone=${TZ} -Dspring.config.additional-location=${SPRING_CONFIG_ADDITIONAL_LOCATION} -Dspring.config.import=${SPRING_CONFIG_IMPORT} -jar app.jar"]
