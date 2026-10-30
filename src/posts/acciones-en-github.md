---
title: "Acciones en Github"
type: post
slug: "acciones-en-github"
layout: layouts/post.njk
permalink: /acciones-en-github/index.html
date: "2021-07-21T18:06:49Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/07/githubactions.png"
featuredImageAlt: "githubactions"
---

EEEEEEntonces, hace un tiempo hice el [Neni Maker](/blog/). Como el proyecto no necesitaba un servidor para poder funcionar, se me ocurrió montarlo dentro de un Github Pages.

Todo estaba muy bien, sin embargo, para poder desplegar el proyecto tenía que mover el contenido de /dist a root en una nueva rama... para hacer esto lo que hacía yo era montar un repositorio nuevo y ponerle ahi el contenido... repoblar el directorio cada vez y darle push... todo un proceso manual y arcaico.

Entonces debido a la última llamada de CI/CD en Devxoditas, recordé que [Ivan Zenteno](https://github.com/k001) nos explicó como montar el Github Actions (y que era muy parecido a CircleCI, algo que ya conozco). Además a la hora de platicarles el problema, varios me dijeron: "Github Actions wey".

Entonces pos va, después de un quick google fu, encontré como montar el actions con algo muy sencillo.

-   Paso 1) Crear un `archivo.yml` dentro de `.github/workflows`
-   Paso 2) Definir el proceso de deploy dentro del yml
-   Paso 3) Profit

Este fué el yml inicial que hice:

```yaml
name: Build and Deploy
on:
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1

      - name: Install
        run: |
          npm install

      - name: Build
        run: |
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: dist
```

Básicamente lo que hace es definir que en cada push a la rama `main`, corre un proceso llamado "build-and-deploy".

Este proceso se divide en varios pasos, el primero es hacer un checkout del código, para esto, github se vale de una acción ya existente, así que no hay que crearla, solo usarla.

Luego hacemos el npm install, seguido del npm build y finalmente el deploy creando (o usando) una rama llamada gh-pages y usando el contenido del folder `dist`.

Esto funcionó muy bien, en cuestión de unos minutos ya pude reducir todo el trabajo manual de crear el build y mandarlo a la rama adecuada. Sin embargo, recordé que todo esto es tiempo perdido que además lo cobra github si te pasas de uso. Entonces aqui lo importante, HAY QUE METER CACHE para reducir este tiempo.

Aquí fue donde empezó la faena interesante. Hacíendo un sencillo google fu, encontré que para hacer un cache, hay que usar un action ya creado y agregarle que cacheara el directorio de `~/.git`.

Intenté esto y no jaló :D Entonces mi siguiente idea fue pelotearlo en el chat donde K001 me ayudó a probar distintos acercamientos. Logramos montar el cache y evitar que el action estuviera re-creando el npm install en cada run, sin embargo, el step de build fallaba porque no tenía los datos del node\_modules en el repositorio para hacer el build.

Después de varios intentos, estuve leyendo que no es recomendable cachear el `node_modules` porque puede cambiar el build dependiendo de la máquina o de la versión de node. Sin embargo el problema que yo tenía era que estaba cacheando el directorio `~/.npm`, ese solo sirve si se manda a instalar algo al global scope y no en local. Para el local solo se guarda en `node_modules`...

Entonces decidí cachear el local `node_modules` y FUNCIONÓ ... no solo eso, los builds posteriores tardan solo unos segundos porque el paso de npm install lo brinca complétamente. Esto se logra porque le puse un IF en el paso de install con el resultado del cache.

El resultado final del yaml quedó así:

```yaml
name: Build and Deploy
on:
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1

      - name: Cache node modules
        uses: actions/cache@v2
        env:
          cache-name: cache-node-modules
        id: npm-cache
        with:
          path: ./node_modules
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - name: Install
        if: steps.npm-cache.outputs.cache-hit != 'true'
        run: |
          npm install

      - name: Build
        run: |
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: dist
```

De nuevo tenemos un action de cache que recibe unos parámetros. Lo imporatante aquí, es el path que está cacheando `./node_modules`. La definición del restore-keys es utilizado para guardar y buscar el caché generado previamente. Otra definición importante es el `id` para poder obtener el resultado en el siguiente step. Dentro del install traemos el resultado del step anterior. De ser negativo, hacemos el install.
