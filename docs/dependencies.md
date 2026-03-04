# Dependency Decisions

## Fastify
Chosen over express js for it's performance and plugin architecture.

## Fastify/swagger
A robust tool for API documentation.

## Bcrypt
A hashing library for hashing passwords before storing them in the database.

## Typebox
Using this library to build json schema. which is then passed our server which checks the incoming request against our given schema and throws error if the coming request is not valid.
