---
title: "Coffee y múltiples módulos"
type: post
slug: "coffee-y-multiples-modulos"
layout: layouts/post.njk
permalink: /coffee-y-multiples-modulos/index.html
date: "2015-03-04T21:13:46Z"
categories:
  - name: "Javascript"
    slug: "javascript"
  - name: "Legacy Blog"
    slug: "legacy-blog"
  - name: "NodeJS"
    slug: "nodejs"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/01/2015-03-04-coffee-y-multiples-modulos.jpg"
featuredImageAlt: "2015-03-04-coffee-y-multiples-modulos"
---

## Bienvenido al requirelandia

Últimamente, en el trabajo me ha tocado re-escribir algo de código, hacer nuevos módulos y darles mantenimiento a otros existentes, sin embargo, cuando tienes un script de mil líneas de código empiezas a tener problemas en entender qué demonios estabas haciendo. Sin embargo, en NodeJS tienes la opción de crear sub-módulos para manejar la información de una forma más sencilla (y no se diga poder hacer pruebas unitarias para cada uno de los módulos).

Todo va muy bien hasta que te das cuenta que tienes que adaptarte a tener diferentes _scopes_ para cada uno de los módulos.

> Es decir: cada módulo tiene sus propias variables globales y no se comparten entre sí.

Esto puede ser un problema cuando necesitas que un módulo mute información recibida, y esta información la ocupan en otro lugar. O cuando necesitas heredar el mismo archivo de configuración a todos los requires.

Esto es lo que regularmente haríamos (_coffeescript_):

### main.coffee

```coffeescript
config = require 'config.json'
modulo1 = require('modulo1')(config)
config modulo1.mutarconfig()

modulo2 = require('modulo2')(config)
config modulo2.mutarconfig()
```

### modulo1.coffee y modulo2.coffee (demo)

```coffeescript
module.exports = (cfg)->
return {
    mutarconfig : ->
    cfg.item1 = false
    return cfg
}
```

Esto en un inicio no parece gran problema, sin embargo, cuando tienes bastantes _includes_ se convierte en uno.

## Usando el _process_

Una forma de darle la vuelta a esto es usando el objeto _process_ para almacenar tus variables que quieres se hereden a todos los sub-módulos. Esto nos cambia el paradigma de esta forma:

### main.coffee

```coffeescript
process.config = require 'config.json'

require('modulo1').mutarconfig()
require('modulo2').mutarconfig()
```

### modulo1.coffee y modulo2.coffee (demo)

```coffeescript
export.mutarconfig = ->
process.config.item1 = false
```

De esta forma hemos logrado el mismo resultado con la mitad de línea de código. Además es un más sencillo darle mantenimiento.

Hasta aquí por hoy. Espero les haya servido de algo, si tienen comentarios, no duden en contactarme por la red social que más les guste.

¡Saludos!
