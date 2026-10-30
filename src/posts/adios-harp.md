---
title: "Adios Harp"
type: post
slug: "adios-harp"
layout: layouts/post.njk
permalink: /adios-harp/index.html
date: "2015-09-05T21:56:34Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
  - name: "Legacy Blog"
    slug: "legacy-blog"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/01/2015-09-05-adios-harp.jpg"
featuredImageAlt: "2015-09-05-adios-harp"
---

## Hola ChaiTea Framework

Cuando descubrí [Harp](http://harpjs.com/) me pareció una muy buena opción para crear este blog al mismo tiempo de crear un motor de blog desde cero.

Desafortunadamente, me estuve topando con problemas al usar Harp, al parecer tiene un módulo de [SASS](http://sass-lang.com/) que no se estaba compilando bien, en especial con versiones nueva de [NodeJS](https://nodejs.org/en/). Así que empecé a crear una opción aparte que mantenga la funcionalidad de SASS y al mismo tiempo mantener un esquema de [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

Ok Los puristas dirán "MVC es de los 2000's". Sin embargo, a mi me ha funcionado bastate bien el mantener un esquema donde tienes tus procesos de base de datos en un lugar, tus operaciones de [API](https://en.wikipedia.org/wiki/Application_programming_interface) en otro lado mientras que tus vistas están en un tercer lugar separado. Además puedes aprovechar esta funcionalidad para Crear _endpoints_ sin vistas para extender su aplicación más allá de tu servidor.

En todo caso, estuve afinando este framework por cierto tiempo y hoy me di la tarea de pasar todo este blog de Harp a [ChaiTea Framework](https://github.com/ZeroDragon/chaitea-framework). Lo sé la documentación hoy en día está algo escueta, sin embargo, planeo documentarlo apropiadamente en estos días.

También tengo un _post_ acerca de unos filtros y truquitos de CSS que me he encontrado, pero no he tenido el tiempo para escribirlo. En parte porque primero quería pasar este blog a _ChaiTea Framework_. De hecho tengo ganas de crear una versión ligera del blog para poder hacer entradas express desde el teléfono.

Hasta aquí los dejo con esta actualización. Pronto haré la entrada de CSS y la documentación del framework.

Saludos :)
