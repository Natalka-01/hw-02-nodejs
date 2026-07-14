import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const security = [{ bearerAuth: [] }];


// AUTH
registry.registerPath({ method: 'post', path: '/auth/register', summary: 'Реєстрація', responses: { 201: { description: 'Created' } } });
registry.registerPath({ method: 'post', path: '/auth/login', summary: 'Логін', responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'post', path: '/auth/refresh', summary: 'Оновлення токена', responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'get', path: '/auth/me', summary: 'Профіль', security, responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'post', path: '/auth/logout', summary: 'Логаут', security, responses: { 201: { description: 'Created' } } });

//ANNOUNCEMENTS
registry.registerPath({ method: 'get', path: '/announcements', summary: 'Всі оголошення', responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'get', path: '/announcements/{id}', summary: 'Одне оголошення', responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'post', path: '/announcements', summary: 'Створити', security, responses: { 201: { description: 'Created' } } });
registry.registerPath({ method: 'patch', path: '/announcements/{id}', summary: 'Оновити', security, responses: { 200: { description: 'OK' } } });
registry.registerPath({ method: 'delete', path: '/announcements/{id}', summary: 'Видалити', security, responses: { 204: { description: 'No Content' } } });


export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "REST API for your project",
    },
    servers: [{ url: "http://localhost:3000" }],
  });
}