Uso de Inteligencia Artificial en el proyecto

Durante el desarrollo de este backend se utilizó inteligencia artificial como copiloto en las siguientes áreas:

- Tests
La IA ayudó a generar la estructura inicial de pruebas unitarias (helpers), de integración (endpoints con Supertest) y de end-to-end (flujo completo contra el backend en Docker).
Todas las pruebas fueron revisadas, ajustadas y ejecutadas localmente para asegurar su correcto funcionamiento.

- Modelos y migraciones de Sequelize
Se utilizó IA para redactar los modelos iniciales (Espacio, Reserva) y sus migraciones asociadas.
Posteriormente se revisó y corrigió manualmente el código (por ejemplo, nombres de tablas, claves foráneas y reglas de negocio).

- README
La IA colaboró en la redacción y estructura del README, asegurando que la documentación fuera clara y fácil de seguir para levantar el proyecto, correr migraciones y ejecutar tests.

Decisiones tomadas manualmente

Definición de reglas de negocio:

Sin solapamientos de reservas.

Máximo de 3 reservas por semana por cliente.

Configuración de config.js en lugar de config.json para usar variables de entorno.

Elección de la estructura final del proyecto (src/controllers, src/routes, src/utils).

Configuración de Docker Compose con backend y base de datos.

Debugging de errores de conexión a Postgres y ajuste de puertos.

Validación final de todas las funcionalidades con Postman, curl y logs de Docker.

Conclusión

La IA se utilizó como herramienta de apoyo para acelerar la escritura de código repetitivo y la documentación.
Todas las funcionalidades fueron validadas manualmente, y el diseño del sistema, las reglas de negocio y la integración final se realizaron de forma consciente y controlada.

El resultado final es un backend mantenible, probado y listo para producción, independientemente de la ayuda inicial de la IA.