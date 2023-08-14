FROM debian:bullseye
RUN apt-get update -y && apt-get upgrade -yy
RUN apt-get install -yy wget openjdk-11-jre python3
WORKDIR /app
COPY verify_jena.sh .
RUN ./verify_jena.sh
ENV PATH="${PATH}:/app/apache-jena/bin/"
ENV PYTHONUNBUFFERED=1
COPY . .
ENTRYPOINT ["/app/shacl_validate.py"]