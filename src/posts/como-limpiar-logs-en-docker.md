---
title: "Cómo limpiar logs en docker"
type: post
slug: "como-limpiar-logs-en-docker"
layout: layouts/post.njk
permalink: /como-limpiar-logs-en-docker/index.html
date: "2019-03-28T23:25:37Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/01/1_uARfS-6sSe4WuY96w2df7w.jpg"
featuredImageAlt: "1_uARfS-6sSe4WuY96w2df7w"
---

Después de trabajar un rato con contenedores de docker para desarrollo, me he encontrado con el momento en que los logs, al iniciar el contenedor, cargan y cargan y cargan y parece que no tienen fin. Eso, sumado a que tienes una gran cantidad de logs por request, solo se vuelve más y más largo.

![](/wp-content/uploads/2021/01/post-130-6007b18a6db46.)

Preguntando a mis compañeros de trabajo, me encontré que la solución más común es simplemente borrar la máquina y volverla a crear. Borrar los logs manualmente había probado ser tedioso y en algunos eventos, hasta ha corrompido el contenedor.

No conforme con esto, (y que tenía el internet bastante limitado), no quería volver a descargar la imagen y volverla a instalar localmente. Así que estuve buscando alguna alternativa. Hasta que encontré esto:

```yaml
version: '3.1'
services:
  my-service:
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
    image: ......
```

Solo es una pequeña configuración que se pone en el docker-compose.yml justo dentro de la definición del servicio que estás usando para trabajar.

Esta definición va a realizar dos cosas con tus logs la próxima vez que levantes el servicio:

1.  Va a borrar los logs actuales
2.  Los nuevos logs van a estar limitados a 50mb

Efectivamente limpiando los logs todo tu contenedor y teniendo un poco más de paz mental.

Si eres como yo y no confías en lo que haga esta configuración en el servidor de producción (no sé, digamos que usas K8s y subes el docker). Te recomiendo que hagas lo siguiente:

-   Inserta en tu docker-compose.yml la definición
-   Levanta el contenedor y ve cómo ya no hay logs
-   Detén el contenedor
-   Regresa el docker-compose.yml a la normalidad
-   Levanta de nuevo el contenedor

Listo, ahora tienes un contenedor limpio de logs para trabajar y no afectarás los logs en ningún otro lado.

Espero les sirva este pequeño hack. Yo sé que a mí me sirvió xD

Zero out!
