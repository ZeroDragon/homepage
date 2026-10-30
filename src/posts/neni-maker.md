---
title: "Neni Maker"
type: post
slug: "neni-maker"
layout: layouts/post.njk
permalink: /neni-maker/index.html
date: "2021-07-21T16:44:38Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "LOL"
    slug: "lol"
featuredImage: "/assets/uploads/2021/07/Screenshot-2021-07-21-162212.jpg"
featuredImageAlt: "Screenshot 2021-07-21 162212"
---

Hace un tiempo hice un proyecto con Vue que se llama [Neni Maker](https://zerodragon.github.io/neni-maker/)

La idea original era intentar hacer algo con React + Styled Components y TypeScript.

Sin embargo tuve muchos problemas con todo este setup, así que después de escuchar [este episodio de El Pocast DEV](https://elpodcast.dev/episodes/98), me cayó el 20 de que es mejor prototipar en algo que conoces cuando tu objetivo es probar una idea y salir con "algo". Entonces cambié a usar VUE :)

El objetivo del neni-maker es poder crear historias ficticias de personas random en una pseudo conversación de whatsapp para poder generar screenshots que se puedan compartir en redes sociales.

Para eso se agregó una sección donde se pueden agregar mensajes siguiendo un sistema muy sencillo. Al entrar al sitio se muestra un ejemplo el cual se puede usar para cambiar todos los datos y ponerle más o menos cosas.

El proyecto es [open source](https://github.com/ZeroDragon/neni-maker) y se aceptan comentarios y pull requests para agregar cosas siempre que agregen cosas divertidas xD

En el lado derecho de la aplicación, se puede configurar toda la pantalla de la siguiente forma: ![Editor](/assets/uploads/2021/07/Screenshot-2021-07-21-163511.jpg)

Para definir un mensaje, debe tener la siguiente estructura:

```
tipo
mensaje
hora
```

Los mensajes se dividen por una línea que exáctamente tenga solo `=====`.

Los tipos de mensajes pueden ser `system`, `incoming` y `outgoing`. Esto define si un mensaje sale del lado izquierdo del lado derecho de la pantalla.

Además con los campos superiores se pueden modificar secciones del layout de whatsapp para que en el screenshot no se vea todos iguales.

Me falta poder cambiar el background del chat e implementar alguna forma de poder tomar el screnshot automágicamente.. Sin embargo, como me vi bien fresco en usar CSS nuevo, no sale bien en los plugins de JS para ese propósito :(

Sin embargo, el ejercicio estuvo divertido, jueguen con eso y si les late, no olivden compartirlo :)
