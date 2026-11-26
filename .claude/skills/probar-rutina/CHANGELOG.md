# Cambios
- 2026-11-01: creada a partir de los scripts repetidos en la sesión de Lugares y Recordatorios.
- 2026-11-26: probar.mjs también encuentra Chrome en Linux (o en CHROME_PATH) y con CI usa --no-sandbox, para correr las pruebas en GitHub Actions antes de publicar.
- 2026-11-26: estado() lee la llave de la cuenta en uso (claveActual), no la primera que empiece con rutina_v1 (podía ser la copia rutina_v1:antes).
