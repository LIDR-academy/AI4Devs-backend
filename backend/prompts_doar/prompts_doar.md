# Creación de Endpoints para la Gestión de Candidatos en un Tablero Kanban

## Contexto
Tu misión es crear dos nuevos endpoints de API que facilitarán la gestión de la lista de candidatos en una interfaz estilo Kanban.

---

## Pasos

### GET `/positions/:id/candidates`

- **Descripción:** Recupera todos los candidatos en proceso para una posición específica (especificada por `positionID`).
- **Datos devueltos por candidato:**
  - Nombre completo (de la tabla `candidate`).
  - Paso actual de la entrevista (de la tabla `application`).
  - Puntaje promedio basado en todas las entrevistas realizadas (los puntajes se obtienen de la tabla `interview` asociada con el candidato).

---

### PUT `/candidates/:id/stage`

- **Descripción:** Actualiza la etapa actual de entrevista de un candidato específico.
- **Funcionalidad:** Permite modificar la fase actual de entrevista en la que se encuentra un candidato (especificada por el ID del candidato).

---

## Formato de salida

### Para el endpoint GET:
Devuelve un arreglo JSON de objetos de candidatos, cada uno con los siguientes campos:
- `full_name`
- `current_interview_step`
- `average_score`

### Para el endpoint PUT:
Se espera un mensaje de confirmación en formato JSON que indique si la actualización de la etapa fue exitosa o si hubo un error.

---

## Ejemplos

### Respuesta de ejemplo para GET `/positions/123/candidates`:
```json
[
  {
    "full_name": "John Doe",
    "current_interview_step": "Phone Screen",
    "average_score": 4.5
  },
  {
    "full_name": "Jane Smith",
    "current_interview_step": "Technical Interview",
    "average_score": 4.75
  }
]
# Respuesta de Ejemplo para PUT /candidates/456/stage

```json
{
  "status": "success",
  "message": "La etapa de entrevista del candidato se actualizó con éxito."
}
```

## Notas
- Asegúrate de que todos los datos recuperados y actualizados sean precisos y reflejen el estado más reciente de las tablas involucradas.
- Maneja posibles errores, como IDs de posición o candidatos inválidos, asegurándote de proporcionar mensajes de error claros en formato JSON.
- Considera casos límite, como un candidato sin entrevistas completadas, y gestiona estos casos de manera adecuada en el cálculo del puntaje promedio.


# Lineamientos para Cambios en el Proyecto

Los cambios en el proyecto deben cumplir los siguientes lineamientos:

- Usar **TypeScript**.
- Seguir la **arquitectura en capas**.
- Usar **Prisma** como ORM.
- Manejar errores de manera apropiada.
- Devolver respuestas **JSON consistentes**.
- Adopta los principios DDD, SOLID, DRY y patrones de diseño para una arquitectura backend escalable y mantenible.
- Asegúrate de que los datos recuperados y actualizados sean precisos y estén actualizados.
- Maneja posibles errores con mensajes claros de error en formato JSON, considerando a los candidatos sin entrevistas   completas para el cálculo del puntaje promedio.-

## Configuración de la Aplicación

La aplicación se ejecuta en:

- **Backend**: [http://localhost:3010](http://localhost:3010)
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Base de datos**: PostgreSQL en Docker.

actualiza el readme con los cambios  realizados 

