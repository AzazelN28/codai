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

## Solución de problemas

### Nitro Worker EADDRINUSE

#### Problema

A veces al arrancar nitro, el socket del worker anterior no se eliminó y da un error de este tipo:

```sh
ui_1     | [nitro] [dev] [uncaughtException] Error: listen EADDRINUSE: address already in use /tmp/nitro/worker-35-1.sock
ui_1     |     at Server.setupListenHandle [as _listen2] (node:net:1723:21)
ui_1     |     at listenInCluster (node:net:1788:12)
ui_1     |     at Server.listen (node:net:1887:5)
ui_1     |     at file:///home/node/services/ui/.nuxt/dev/index.mjs:584:8
ui_1     |     at ModuleJob.run (node:internal/modules/esm/module_job:194:25) {
ui_1     |   code: 'EADDRINUSE',
ui_1     |   errno: -98,
ui_1     |   syscall: 'listen',
ui_1     |   address: '/tmp/nitro/worker-35-1.sock',
ui_1     |   port: -1
ui_1     | }
ui_1     |
ui_1     |  ERROR  [worker reload] [worker] exited
ui_1     |
ui_1     |   at Worker.<anonymous> (/home/node/node_modules/.pnpm/nitropack@2.3.3/node_modules/nitropack/dist/shared/nitro.96034a6e.mjs:3939:9)
ui_1     |   at Object.onceWrapper (node:events:628:26)
ui_1     |   at Worker.emit (node:events:513:28)
ui_1     |   at Worker.emit (node:domain:489:12)
ui_1     |   at [kOnExit] (node:internal/worker:279:10)
ui_1     |   at Worker.<computed>.onexit (node:internal/worker:199:20)
```

#### Solución

Entrar dentro del contenedor y borrar manualmente el socket.

```sh
docker exec -it codai_ui-1 bash
```

Una vez dentro del contenedor:

```sh
rm /tmp/nitro/*
```

Rearrancamos la interfaz:

```sh
docker-compose restart ui
```

Made with :heart: by [AzazelN28](https://github.com/azazeln28)
