---
title: "Una para los managers"
type: post
slug: "una-para-los-managers"
layout: layouts/post.njk
permalink: /una-para-los-managers/index.html
date: "2022-02-17T14:19:48Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2022/02/tg7qums6qrp11.jpg"
featuredImageAlt: "Git Hero"
---

### Así que eres un manager?

Por lo regular, cuando eres manager, tu trabajo está enfocado en llevar proyectos, organizar el sprint y dependiendo del trabajo, armar los releases.

Es aqui donde para armar un buen resultado de releases, tienes que echarte un clavado al github/gitlab para traer todos los cambios desde el último tag. Pero pues no siempre es grato estar jugando en la UI del sitio para cazar estos registros.

> Aunque ya no seas dev, aun no te gustan las GUI xD

Claro que puedes tener un clon del repositorio y checar con [tig](https://jonas.github.io/tig/) para revisar los ultimos cambios. Pero ¿no sería más bonito que pudieras tener estos cambios en un archivo listo para copiar y pegar?

### Este comando es lo que buscas

```bash
git log $(git describe --tags --abbrev=0)..HEAD --no-merges --oneline > new-in-this-release.log
```

¿Pero que hace ese comando? Básicamente busca todos los commits que entraron a master desde el último tag (que por lo regular es tu último release) y los deja en un archivo llamado `new-in-this-release.log` (haciendo overwrite, así que no te preocupes por contaminación de un proceso anterior)

Sin embargo, esto no es perfecto, primero, a tu repositorio le va a crecer un archivo log (que dependiendo de tu `.gitignore` puede que no te afecte). Pero cuando eres manager y tienes que revisar un par de docenas de repositorios, no es siempre lo mejor tener todos esos repositorios en tu máquina solo para sacar el log ¿Entonce que puedes hacer?

### Git Bare al rescate

Git tiene una opción para levantar repositorios en forma `bare` que básicamente significa que no va a traer el código, pero si los commits, configs y si lo usas en el server, incluso puedes poner hooks y cosillas que podemos ver en otro momento.

Entonces ¿Qué pasa si hacer un `git clone bare <url>.git`? Pues básicamente hace un clon del repo pero no trae nada de código, solo lo esencial para funcionar como repositorio, es decir, trae los commits (es lo que necesitamos).

**IMPORTANTE**, algo que no trae el `git clone --bare` son las referencias del fetch a los heads. Así que tienes que agregarselas al config.

Después de esto, simplemente tienes que hacer `git fetch` para traer los nuevos cambios en el repositorio. (ojo, no puedes hacer `git pull` porque pull intenta hacer un merge al head, pero no tienes head en este tipo de repositorio mwhahah).

Finalmente solo necesitas correr el mismo comando de log para obtener tus cambios y LISTO. Además en este tipo de repositorios, ¡los archivos generados no se versionan! Así que no es necesario agregar nada al `.gitignore`

El código final queda así:

```bash
# setup
git clone --bare url/to.git
git config remote.origin.fetch 'refs/heads/*:refs/heads/*'

# usage
git fetch
git log $(git describe --tags --abbrev=0)..HEAD --no-merges --oneline > new-in-this-release.log

# reading file
vim new-in-this-release.log
```

Listo, con este setup, puedes tener todos los repositorios que necesites sin preocuparte de que te consuman espacio en tu computadora y aun así poder tener en un archivo por repositorio los últimos cambios de cada uno desde el último release.

Hice un [gist](https://gist.github.com/ZeroDragon/41f10c46a4bab9b438b954b900ff5611) de esto por si lo quieres tener concentrado

Ahora si, a dedicarte al management! xD

Si te gusta este contenido y se te hace útil, no dejes de compartir este blog con quienes creas les hará falta. Y si realmente quieres ser un héroe, visita [mi patreon](https://www.patreon.com/zerodragon)
