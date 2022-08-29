FROM debian:latest
RUN apt-get update -y && apt-get upgrade -yy
RUN apt-get install -yy wget openjdk-11-jre python3
WORKDIR /app
RUN wget https://dlcdn.apache.org/jena/binaries/apache-jena-4.6.0.tar.gz 
RUN tar -xzf apache-jena-4.6.0.tar.gz
ENV PATH="${PATH}:/app/apache-jena-4.6.0/bin/"
ENV PYTHONUNBUFFERED=1
COPY . .
ENTRYPOINT ["/app/shacl_validate.py"]
