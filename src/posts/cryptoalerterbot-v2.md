---
title: "CryptoAlerterBot v2"
type: post
slug: "cryptoalerterbot-v2"
layout: layouts/post.njk
permalink: /cryptoalerterbot-v2/index.html
date: "2017-06-26T22:47:41Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Javascript"
    slug: "javascript"
featuredImage: "/assets/uploads/2021/01/0_7m9SbWaGtmgVlpZS.png"
featuredImageAlt: "0_7m9SbWaGtmgVlpZS"
---

Como muchos de ustedes ya saben, CyptoAlerterBot empezó parte como un hobby y parte como una necesidad de tener ciertas monedas a la mano para saber su valor. Y como ya tengo telegram en mi teléfono, hacer un bot fue lo más sencillo de lograr.

Este proyecto creció gracias a sus preguntas en especial en el canal “Bitcoin Español” y “Bitcuners” en telegram. Siempre quise agregar muchas cosas que me pidieron y remover otras que no se usaban, pero el código con el que empecé el bot ya estaba viejo y tuve que empezar desde cero para la versión 2. Para empezar tuve que dividir el bot en dos partes:

-   Mineo de datos desde donde sea que estos estén
-   El proceso de mensajes de usuarios

En la primera versión del bot, estos dos procesos eran uno solo y cuando alguno de los dos fallaba, los dos morían. Pero ahora, están separados y esto significa más estabilidad y velocidad.

Así que vamos por el registro de cambios:

-   La página CryptoAlerterBot.tk ya no se necesita para configurar el bot. De hecho esta página ya no hace nada.
-   Toda la configuración ahora se hace desde el bot mismo:

![](/assets/uploads/2021/01/post-114-6007aa1ca758e.png)

-   Todos los comandos con “barra” ahora son semánticos. Si quieres alguna respuesta del bot, solo pregúntasela.
    
-   Debido a mucho spam en los canales, el bot ya no funciona en canales. Solo en mensajes privados, y para los que se preguntan ¿como? Solo manden un mensaje a @CryptoAlerterBot.
    
-   Si pides un rate sin especificar la moneda, el bot te va a preguntar que moneda quieres. Esto también funciona en casi todos los demás comandos.
    

![](/assets/uploads/2021/01/post-114-6007aa1cdc0ff.png)

-   Ahora las alertas se pueden configurar de y hacia cualquier moneda. ¿Quieres que te alerte el valor del dash en dogecoin en lugar de dólares? Si, si puedes!

![](/assets/uploads/2021/01/post-114-6007aa1d17c23.png)

-   De hecho las alertas ahora traen botones para mandarlas a dormir o deshabilitarlas desde la misma alerta.
    
-   ¿Ya mencioné que todas las funciones “unlimited” de la versión 1 del bot ahora son GRATIS? Ya no es necesario pagar o donar nada (claro que con las donaciones me motivan a seguir desarrollando mejoras para el bot. Solo escribe “donate”).
    
-   Los recordatorios son una forma sencilla de mantener vigilada una moneda cada cierto tiempo.
    

![](/assets/uploads/2021/01/post-114-6007aa1d432a2.png)

-   Las gráficas aun las estoy trabajando. Porque la base de datos cambió bastante. Además hay otros bots que dan gráficas más completas y ahorita me estoy enfocando en una mejor experiencia de usabilidad en la versión 2.
    
-   ¿No sabes el código de una moneda? solo escribre @CryptoAlerterBot \[ 3 letras minimo \] y el bot te ofrecerá una lista de las monedas que tengan esas letras.
    

![](/assets/uploads/2021/01/post-114-6007aa1d6b3e2.png)

-   La información que el bot regresa cuando pides un rate, ahora trae más datos como el movimiento, la volatilidad y una recomendación básica.

![](/assets/uploads/2021/01/post-114-6007aa1da2280.png)

Y pues con esto termino este post. Espero que les sea de mucho uso este bot para cualquier fin que ustedes quieran. También si les sirve como a mi me ha servido, no olviden compartir el bot con sus amigos para que también lo puedan usar.

Zero Fuera
