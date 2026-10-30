---
title: "SiteCraft Desplegado"
type: post
slug: "sitecraft-desplegado"
layout: layouts/post.njk
permalink: /sitecraft-desplegado/index.html
date: "2023-06-16T23:50:23Z"
categories:
  - name: "Javascript"
    slug: "javascript"
  - name: "NodeJS"
    slug: "nodejs"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2023/06/sitecraft.png"
featuredImageAlt: "sitecraft"
---

Que onda, bandita. Les cuento lo que me pasó esta semana... El otro día necesitaba levantar un sitio barato para un side project. Así que estuve investigando que podía hacer y me topé con Hugo. Después de intentar hackearlo un poco y probar varios templates, me di cuenta de algunos problemas:

-   Cada template tiene muchas diferencias en la forma en que funcionan y estarlos hackeando para tener lo que busco era demasiado tedioso.
-   Hugo está muy enfocado (o por lo menos los templates que vi) a blogs y yo solo quería una simple página estática a la web 1.0

Así que borré ese desarrollo y me dediqué a hacer mi propia versión de Hugo pero en nodejs, que tenga todos los juguetes que me gustan y que sea pluggeable con templates (como Hugo) con la diferencia de que los template sean tontos (sin lógica pues) y enfocado a página (con soporte para blog, pero opcional)

Después de hackear por las noches (ok le metí como 1hr diaria o chance 2 xD) en la primera semana hice el sitio de [Los Armaños](https://losarmanos.com). Los primeros retos que tuve fueron como crear un sitio 100% estático y como desplegarlo a githubpages. Ya había yo hecho esto manualmente, sin embargo esta vez quería hacerlo usando github actions.

No fué dificil encontrar un par de lugares de github donde te dicen como hacer esto. Así que hice el setup y funcionó. PERO el dominio no jalaba, a pesar de que hacía yo el setup en el github, cada que corria el action, reseteaba el dominio. Así que me puse a investigar y resulta que en el despliegue de tu sitio hay que poner un archivo `CNAME` con el nombre del dominio ahi dentro. Hice eso y funcionó.

Después de hacer esto me di cuenta que el unico costo que voy a tener al año es el doninio, porque el hosting lo tengo en github y el CNAME setteado en github y en el registrar son gratuitos, incluso github me dió un SSL gratis. Así que literal, solo estoy pagando el dominio (además en namecheap te dan email forward gratuito también).

Entonces me puse a pensar, hace unas semanas, un amigo que tiene una empresa personal, necesitaba un landing para poder mostrar lo que vende, litearl un sitio a la 1.0 sin interacción, sin blog, sin contenido dinámico 3.0 blockchain ni nada de eso. Simplemente un landing donde pudiera apuntar a sus clientes cuando le pregunten donde pueden saber de sus servicios. En su momento le comenté que lo más barato que puede hacer es que haga su landing en WIX (es cuasi gratuito) o si ya quería algo más sofisticado, le pasaba el contacto de un amigo que se dedica a algo más robusto. Pero ahora con este approach, puedo ofrecer un sitio con un landing, con opcion a varias páginas **e incluso** ofrecerle un blog ahi mismo por el costo de unicamente el dominio. Se hace el setup y apuntas a GitHub Pages.

Ahora bien, para poder lograr esto tenía que desacoplar el builder que cree para mi sitio semilla. Así que después de un par de intentos fallidos, logré dar con el path correcto. Aqui es donde nace...

## SiteCraft

SiteCraft (en su momento llamado proyecto amaranto) primero lo hice replicando lo que ya tenía creado en el repo original, sin embargo, el primer reto que tuve fue que ahora ya no vivía dentro de la carpeta de `/src`, ahora era un modulo de npm y no podía usar paths relativos para crear el `/public` y acceder a los assets. Resolví eso usando `process.cwd()` el cual siempre me regresa el path desde donde se ejecuta el módulo. ¡Eso fué un gran avance, porque ese mismo root es el root del sitio que estoy desarrollando!

Lo siguiente y más interesante (y fue algo que me estuvo pateando todo el tiempo) fue que cuando hacía server de desarrollo, el root de mi sitio es el root del servidor y las urls relativas funcionan bien. Incluso cuando hago el despliegue a un sitio con un dominio comprado, no tengo ese problema. Sin embargo, al desplegar a GitHub Pages sin un dominio definido, el problema era evidente, pues ya no es el root del sitio, ahora es usuario.github.io/tu-repo

> OMG WE ARE SCREWED

Así que tuve que hacer uso de mañas y definiciones para poder agregar shorthands en los archivos `.md` y en los `.pug` para poder entregar al usuario las herramientas para personalizar su sitio sin tener que cambiar el framework. Así que ahora tenemos **shorthands** en el stack de SiteCraft D:

## El buen compa Chat GPT

A todo esto mencioné que antes el proyecto se llamaba proyecto amaranto. Pero necesitaba un nombre chido para mi sitio. Como este proyecto esta inspirado en Hugo, dije "vamos a ponerle nombre" pero no se me ocurría nada. Así que fui al ChatGPT y le dije "aver aviéntame unos acrónimos para ZERO" y me dio algunas alternativas que no me gustaron mucho. Luego le pregunté "dime algunos nombres para un software que haga sitios estáticos" y me dio una opción toda qlera... cambié el input pidiéndole 10 opciones y de ahi salieron algunas buenas. Posteriormente le dije "ok te los voy a ordenar en orden del que más me gustó al que menos me gustó y quiero que borres la mitad final y me generes nuevos tomando como referencia los que si me gustaron". Y de ahi salió **SiteCraft**

## La Galería

A todo esto mientras desarrollaba SiteCraft, tenía en mente que necesitaba hacer una galería de templates, pues si alguien quiere empezar a hackear con SiteCraft, necesita una semilla para poder jugar. Así que necesitaba hacer **un nuevo sitio** que sirviera de galería de templates. OBVIAMENTE usando SiteCraft como mi builder. Pensando en que se pueden usar blog posts como cada elemento de la galería, se me ocurrió cambiar el listado de posts a una galería de templates. Y así cualquiera que hiciera un template pudiera simplemente hacer un PR al repo de al galería subiendo su `.md` con la información de su template. Y como ya tengo el github actions que al aceptar un pull request se despliega el github pages.. ¡todo queda automático! Aqui es donde tuve otros retos, no solo tenía el problema del root que no es root en este sitio, sino que también necesitaba una forma escalable de soportar imágenes para usar dedntro del contenido, no solo como parte del template

> OMG WE ARE SCREWED x2

Para todo esto, el sistema de building en la carpeta de `/public` lo hice desde scratch, copio archivos, parseo markdown, compilo markups y preproceso stylus. Además del CNAME y considerando detalles en loa headers para compartir el sitio en social media y el favicon. Todo eso lo tuve que parametrizar y tener mucho cuidado en solo re-generar los archivos que estaba modificando y no todo el sitio cada vez. Además tuve que meter un live-reloader para poder desarrollar rápidamente el template y SiteCraft al mismo tiempo.

## Como linkear un paquete de node desde local

Hace .... 10 años en el 2013, (omg 10 años) alguna vez quise hacer un paquete y poderlo editar desde mi localhost al mismo tiempo que lo estaba requiriendo en otro módulo para poder ver comportamientos específicos. En ese tiempo podías hacer `npm install /path/a/tu/modulo`. Pero los que tengan suficiente tiempo en esto, recordarán que en ese tiempo, npm instalaba todos los paquetes dentro de `node_modules/` indiscriminadamente, sin hacecr tree shaking ni removiendo duplicados. Además si modificabas el source, tenías que reinstalarlo porque lo que estaba en node\_modules era una copia.

Esta vez hice la instalación local y lo primero que fui a revisar fue como estaba node\_modules y tuve una agradable sorpresa: ¡Era un SymLink! Así que podía desarrollar tanto SiteCraft como el nuevo template al mismo tiempo. Esta fue la parte más divertida, porque estuve trabajando en 2 ambientes y tiempos de trabajo al mismo tiempo y revisando con el live-reload los resultados sin tener que estar cambiando de aplicaciones.

## Si bueno pero ¿donde está la carnita?

Bien al final pude publicar SiteCraft con ese mismo nombre directo en NPM (increible que nadie hubiera usado ese nombre antes en npm xD) así que lo puedes instalar usando `npm i -D sitecraft` (recuerda el -D pues solo es una dependencia de desarrollo, una vez publicado, genera archivos estáticos).

Toda la documentación la puedes ver en [este repositorio](https://github.com/zerodragon/SiteCraft). El readme lo hice super explicito de como se debe hacer el setup de los archivos y el scaffolding (será que en un futuro le meta un generador de scaffolding?.. Chance)

También la galería (que por el momento solo tiene 1 template) lo puedes ver [aqui](https://zerodragon.github.io/SiteCraft-Gallery) porciero el mismo template es de hecho el que está siendo usado para la galería 🤯

Y si quieres ver otro template, también puedes ver el de Los Armaños en [su repositorio](https://github.com/losarmanos/homepage). Ese lo voy a subir más tarde a la galería hehe.

## TO DO

-   Quiero dejar de usar el paquete de live-server porque su último commit fue hace un año y están usando unas versiones de chokidar viejas que tienen warnings de uso. No me preocupa mucho porque es solo en ambiente de desarrollo, pero pues mejor algo más mejor xD
-   Hay que subir el template de los armaños a la galetía :D
-   Será que migro este blog en wordpress a SiteCraft? xD

## And one more thing...

Sé que había pasado mucho tiempo desde mi último post, pero esta entrega que les hago trae muchisima carnita, además pueden usar SiteCraft para crear sus sitios cuasi-gratuitos para vender a clientes o para sus pet-proyects.

> Díganme si quieren que les de un tour de como se debe configurar namecheap para vincular con github pages xD

Y pues ya, eso es todo lo que les traigo hoy, espero les haya gustado esta entrada y lo publicado. Zero Out
