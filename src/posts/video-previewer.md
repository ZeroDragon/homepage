---
title: "Video Previewer"
type: post
slug: "video-previewer"
layout: layouts/post.njk
permalink: /video-previewer/index.html
date: "2015-04-19T21:49:18Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Legacy Blog"
    slug: "legacy-blog"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2015/04/2015-04-19-video-previewer.jpg"
featuredImageAlt: "2015-04-19-video-previewer"
---

## Un script para enchular los videos

Este es un _plugin_ que hice hace mucho para un amigo ([@memorex18](https://twitter.com/memorex18)) que me pidió ayuda. Básicamente el tenía muchos videos de youtube y de vimeo en su sitio y quería una forma de presentarlos homogéneamente, sin embargo, los plugins existentes eran de paga o los desarrolladores se ponían sus moños para soltar el código.

> Primero me fuí por la forma sencilla, utlizando _jQuery_ y encapsulándolo para no causar conflicto en donde se insertara mi _plugin_, sin embargo, sentí que eso era hacer trampa y la siguiente iteración la hice en puro _vanilla javascript_.

### Algo de historia

Una tarde de ocio desarrollé este (en ese entonces, _plugin_ de _jQuery_) que tomaba un _tag_ especial con la _url_ del video y generaba una vista previa del video.

Lo primero que tuve que investigar fue la forma de sacar la imagen estática de los videos directo de youtube, eso fue bastante sencillo, pues youtube te da una _url_ directa que te regresa una imagen. El reto fue vimeo, pues ellos te dan un endpoint en _JSON_ el cual te regresa la información del video y entre esas cosas la _url_ de la imagen.

Para ese entonces yo desarrollaba todo en _PHP_ y se me hizo muy sencillo hacer un pequeño _script_ que funcionara de _proxy_, el cual le pides la url y te regresaba la imagen.

Muchos ciclos después me acordé de dicho _plugin_ y me dieron ganas de revivirlo para ponerlo en la sección de [los pininos](/experimentos). Y lo primero que noté fue que ya no tengo servidores con _PHP_, así que acepté el reto de hacerlo todo en el lado del cliente.

Primero me fuí por la forma sencilla, utlizando _jQuery_ y encapsulándolo para no causar conflicto en donde se insertara mi _plugin_, sin embargo, sentí que eso era hacer trampa y la siguiente iteración la hice en puro _vanilla javascript_.

No fue precísamente sencillo pero el resultado fue muy gratificante, el _script_ completo lo reduje de 99kb a solo 5kb y es fácilmente extendible para funcionar con los requerimientos estéticos de cada sitio donde se use.

### Ahora si, el script

El script lo puedes localizar completo con todo y ejemplos en [Github](https://github.com/ZeroDragon/Video-Previewer) o si lo deseas y usas _bower_, me tomé la libertad de hacer un paquete de _[bower](http://libraries.io/bower/Video-Previewer)_.

### Como usarlo

> Si no está documentado, no lo uso - @Alexserver

Simplemente hacemos un _tag script_ apuntando a la librería del Video-Previewer en cualquier parte de tu _HTML_, (yo prefiero ponerla en el _head_, pero funciona en cualquier lado, de hecho).

Ya con esto, puedes usar en cualquier parte del _body_ el nuevo tag **VP**

```xml
<vp src="ID-DEL-VIDEO"></vp>
```

El _ID_ puede ser la _URL_ de youtube, o lo que te pone cuando le das click en "compartir", o si quieres verte más _pro_, solo el ID (lo que está después de "v=" en la URL de youtube). También puedes copiar el _URL_ de algún video de vimeo o el puro _ID_.

El resultado será un recuadro de un tamaño predeterminado con la vista previa de dicho video y con un botón de _play_. Al dar _click_ en el botón dicho cuadro se reemplazará por el video que el usuario quiera ver. De esta forma mantienes un mismo estilo sin importar de donde sea el video y además ahorras transferencia haciendo más ligera la carga de tu sitio.

### Demostración de código funcionando.

Como dicen por ahí, _Read the source, Luke_. Aquí les dejo la demostración de un código funcionando. Convenientemente hice un _JSFiddle_ con la **[DEMOSTRACIÓN](http://jsfiddle.net/ZeroDragon/50y6j10d/1/)** para que la vean funcionar.

### Documentación

Alguna vez [@Alexserver](https://twitter.com/alexserver) me comentó "si no está documentado no lo uso". Así que aquí les dejo el link al [README](https://github.com/ZeroDragon/Video-Previewer/blob/master/README.MD) con la explicación de los parámetros disponibles para que no tengan dudas de como usarlo.

Hasta aquí por hoy, si tienen dudas o sugerencias, pueden hacer un _fork_ o meter un _issue_ directo a github. También pueden encontrarme en **telegram** como **[@ZeroDragon](http://telegram.me/zerodragon)** para platicar o invitarme un café :D

Saludos!
