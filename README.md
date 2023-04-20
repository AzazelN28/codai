# Codai

## ¿Qué es esto?

CodAI es una especie de pseudo clon de CodePen con funcionalidades de IA como poder entrar audio, texto, etc.

## Cómo ejecutarlo

Necesitarás [docker](https://docs.docker.com) y [docker-compose](https://docs.docker.com/compose/).

```sh
docker-compose up
```

## Servicios

Todo el proyecto está dividido en varios servicios:

- `nginx`: Como gateway.
- `ui`: Interfaz de usuario, implementada utilizando [Nuxt.js](https://nuxt.com/), [pinia](https://pinia.vuejs.org/ssr/nuxt.html) y [CodeMirror](https://codemirror.net/).
- `api`: API REST que sirve de intermediario entre las APIs de OpenAI y la interfaz de usuario. Aquí se almacena toda la información de los CodAI pens usando SQLite 3.
- `redis`: Para la comunicación entre servicios.

Made with :heart: by [AzazelN28](https://github.com/azazeln28)
