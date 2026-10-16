# Gran Shanghai · Sitio web

Sitio estático, mobile-first y compatible con GitHub Pages para Gran Shanghai en Santa Marta. No requiere instalación, backend ni build.

## Incluye

- Carta con filtros por categoría y búsqueda en el navegador.
- Solicitud de reserva que prepara un mensaje con nombre, fecha, hora, número de personas y nota, y lo abre en WhatsApp al **+57 304 533 4401**.
- Ubicación en Cl. 29 #19-28, Comuna 4, Santa Marta, enlazada a la ficha de Google Maps compartida.
- Diseño adaptable, navegación móvil accesible, foco visible y respeto por `prefers-reduced-motion`.
- Imágenes gastronómicas ilustrativas generadas para esta propuesta; no son fotos del restaurante.

## Ejecutar localmente

Desde la carpeta del proyecto:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`. La carta se carga desde `data/menu.json`, así que hay que servir los archivos con HTTP y no abrir `index.html` como `file://`.

## Editar datos

- **Carta y precios:** `data/menu.json`. Se incluyeron solo platos/precios que resultaron legibles en el texto OCR enviado; se omitieron los renglones ambiguos. Antes de anunciar la web, revisa cada nombre, tamaño y precio con el menú vigente del restaurante.
- **WhatsApp de reservas:** busca `573045334401` en `index.html` y `app.js` si cambia el número. El número se interpreta como Colombia (`+57`).
- **Dirección y mapa:** `index.html`; confirmar que la dirección y el enlace de Maps sigan vigentes.
- **Fotografías:** los tres archivos en `assets/images/` son ilustrativos. Sustitúyelos por fotos propias autorizadas antes de presentarlas como imágenes reales del local.
- **Marca:** el encabezado usa un wordmark tipográfico temporal autorizado; no es el logo oficial.

## Límites

La web solo prepara una solicitud y la abre en WhatsApp. **No guarda datos, no contacta un servidor y no confirma automáticamente una reserva.** La disponibilidad la debe confirmar el restaurante. No se muestran horarios porque no se pudieron validar; la página ofrece consultarlos por WhatsApp. No se inventan reseñas.

El repositorio solicitado se mantiene privado. La visibilidad del código no equivale a publicar el sitio: la disponibilidad de GitHub Pages para repositorios privados depende del plan de GitHub. No se ha hecho público ni se ha activado una publicación externa. Para un lanzamiento público, configurar GitHub Pages en **Settings → Pages** y revisar la visibilidad/plan antes de hacer el sitio accesible a clientes.

## GitHub Pages

Si el plan permite Pages desde este repositorio privado: en **Settings → Pages**, elegir **Deploy from a branch**, seleccionar `main` y `/ (root)`, y guardar. Espera a que termine el despliegue y visita la URL que muestre GitHub. Los archivos usan rutas relativas (`./...`) para funcionar en un subdirectorio de Pages.

Si GitHub no permite Pages en un repositorio privado con el plan disponible, no cambies la visibilidad automáticamente. El propietario puede mantener el repositorio privado o autorizar por separado un repositorio/sitio público.

## Pendientes antes de promocionarla

1. Confirmar los precios y nombres de los renglones transcritos.
2. Sustituir las fotografías ilustrativas por fotos autorizadas del restaurante si se desea.
3. Añadir horario vigente y confirmar el canal de reservas.
4. Sustituir el wordmark temporal por el logo oficial cuando esté disponible.
