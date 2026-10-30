---
title: "Hacer Streaming a varios servicios"
type: post
slug: "hacer-streaming-a-varios-servicios"
layout: layouts/post.njk
permalink: /hacer-streaming-a-varios-servicios/index.html
date: "2019-11-08T23:29:30Z"
categories:
  - name: "Experimentos"
    slug: "experimentos"
  - name: "Tecnología"
    slug: "tecnologia"
featuredImage: "/assets/uploads/2021/01/0_bwyCFImbfiZa-j8I.png"
featuredImageAlt: "0_bwyCFImbfiZa-j8I"
---

Para los eventos en la empresa, actualmente estamos usando Youtube live. Sin embargo, no podemos transmitir al mismo tiempo a Facebook de forma fácil.  
Nuestras actuales opciones son

1.  Transmitir 2 veces (pero necesitamos el doble de ancho de banda y recursos de sistema)
2.  Usar restream.io (que nos cuesta $16usd al mes)

Eso es hasta ahora.

[Alvaro Lizama](https://medium.com/u/5d4a4978e36b?source=post_page-----b7f8968bd6e4--------------------------------) encontró un [módulo para nginx](https://github.com/arut/nginx-rtmp-module) que permite hacer un relayer de protocolo RTMP, en esencia nos permite recibir un stream de audio y video y replicarlo N cantidad de veces. Y todo esto sin consumir demasiados recursos (corre incluso en una raspberry pi).

Así que para hacer esto, tenemos que compilar el módulo de nginx y montarlo en el servidor, ver que no haga conflicto con... O PODEMOS usar un docker y tadaaaahh.

[Este es el tutorial original que seguí](https://iamsaravana.com/stream-to-multiple-destinations-with-obs/) pero a continuación pongo lo que hice exactamente para echarlo a andar en mi VPS personal:

Primero debemos instalar docker en el server

```bash
sudo curl -sS <https://get.docker.com/> | sh
```

Luego bajamos la imagen de nginx-rtmp

```bash
docker pull tiangolo/nginx-rtmp
docker run -d -p 1935:1935 --name nginx-rtmp tiangolo/nginx-rtmp
```

Esto lo corrí en mi VPS personal que está montado en [http://mi-url.com.](http://mi-url.com./) Así que una vez montado el servicio, me habilita la opción de recibir un stream en rtmp://mi-url.com/live

Así que lo siguiente fue configurar el OBS para que hiciera transmisión a mi server en vez de la configuración de Youtube:

![](/assets/uploads/2021/01/post-134-6007b2c2c247a.png)

Como verán el stream key es simplemente `multistream`

Si le damos "Start streaming" en este momento al OBS, no pasará nada, porque aun nos falta configurar los lugares a donde vamos a transmitir, Así que es lo que haremos a continuación:

Entramos a la imagen de docker ejecutando:

```bash
docker exec -it nginx-rtmp "bash"
```

Si esto marca error, intenta con `docker ps -a` para ver si está funcionando y revisa pasos anteriores

Ahora vamos a instalar vim, porque vamos a necesitar editar la configuración de nginx

```bash
apt-get update
apt-get install vim
```

Y luego editamos la configuración de nginx para agregarle los servicios que queremos usar:

```bash
vim /etc/nginx/nginx.conf
```

Esto nos regresará un pedazo de código como esto:

![](/assets/uploads/2021/01/post-134-6007b2c2edd95.png)

Aqui solo hay que agregar debajo de la línea que dice `record off;` una línea como la siguiente por cada servicio que querramos agregar:

```bash
push rtmp://<stream_service_url>/<stream_key>
```

Digamos que queremos agregar youtube donde nuestra llave es abc-123-abc-123, esto quedaría así:

```bash
push rtmp://a.rtmp.youtube.com/live2/abc-123-abc-123
```

Repite esta configuración por cada servicio que quieras usar (twitch, youtube, facebook, etc), luego reinicia nginx con `nginx reload` y manda a transmitir desde tu OBS o lo que uses para transmitir. Si todo sale bien, estarás publicando al live de tu servicio de tu configuración.

Ahora bien, si quieres publicar también a Facebook, aqui hay un pequeño problema. Facebook desde mayo del 2019 bloqueó los streams a la url sin SSL. Es decir que Facebook requiere que le empujes el stream a rtmps:// en vez de rtmp://

Esto es un problema porque este módulo solo soporta mandar streams usando el protocolo rtmp y no rtmps.

Para solucionar esto, necesitas instalar (dentro del mismo docker) el stunnel, [aquí les dejo el link al tutorial original](https://dev.to/lax/rtmps-relay-with-stunnel-12d3), pero vamos a desglosar lo que yo hice específicamente en este caso.

Primero instalamos el stunnel

```bash
apt install stunnel4
```

Luego tenemos que editar el archivo localizado en: `/etc/stunnel/stunnel.conf` con la siguiente info:

```bash
setuid = stunnel4
setgid = stunnel4
pid=/tmp/stunnel.pid
output = /var/log/stunnel4/stunnel.log
include = /etc/stunnel/conf.d
```

luego en `/etc/default/stunnel4` cambiamos ...

```bash
ENABLE=1
```

Ahora en `/etc/stunnel/conf.d/fb.conf` tenemos que agregar esto:

```bash
[fb-live]
client = yes
accept = 127.0.0.1:19350
connect = live-api-s.facebook.com:443
verifyChain = no
```

Ojo que en mi caso no existía el directorio /etc/stunnel/conf.d así que tuve que crearla con mkdir

Ahora hay que reiniciar el stunnel con

```bash
/etc/init.d/stunnel4 restart
```

Finalmente regresamos a editar la configuración del Nginx para agregar la configuración del stunel

## En lugar de esto:

```bash
push rtmps://live-api-s.facebook.com:443/rtmp/<facebook-live-stream-key>;
# cambialo a esto:
push rtmp://127.0.0.1:19350/rtmp/<facebook-live-stream-key>;
```

Es importante que notes el server 19350, estamos usando este puerto porque el default del RTMP (1935) lo está usando nginx.

Si todo salió bien, ya estarás transmitiendo a varios lugares desde una misma configuración y sin hacer una doble transmisión desde tu máquina.

Es obvio que vas a estar usando más ancho de banda, pero solo desde el VPS hacia los servicios de streaming, no desde tu máquina hacia cada uno de los servicios.

Si el ancho de banda no es problema para ti, puedes montar este docker en una máquina extra que tengas en tu misma casa/trabajo y úsala para retransmitir. Así te ahorras el VPS.

Zero out
