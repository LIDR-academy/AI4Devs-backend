# Endpoint GET /positions/:id/candidates

## Primer prompt
Dado el contexto del proyecto en @README.md, como experto en desarrollo backend en Typescript, el objetivo es crear un nuevo endpoints que nos permita manipular la lista de candidatos de una aplicación en una interfaz tipo kanban.

- GET /positions/:id/candidates

 - Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

  - Nombre completo del candidato (de la tabla candidate).
  - current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
  - La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score

Antes de proponer cualquier cambio, hazme todas las preguntas que necesites

## Respuesta Claude 3.5 Sonnet
Gracias por la descripción del nuevo endpoint. Antes de proponer una solución, tengo algunas preguntas importantes para asegurarme de que entiendo completamente los requisitos:

1. **Formato de respuesta**:
   - ¿Hay algún formato específico requerido para la respuesta (por ejemplo, un formato específico para el nombre completo como "lastName, firstName" o "firstName lastName")?
   - ¿Necesitamos incluir el ID del candidato en la respuesta?

2. **Puntuación media**:
   - ¿Cómo deberíamos manejar los candidatos que aún no tienen entrevistas (y por lo tanto no tienen puntuaciones)?
   - ¿La puntuación media debería ser redondeada a algún número específico de decimales?

3. **Ordenación**:
   - ¿Los resultados deben estar ordenados de alguna manera específica (por ejemplo, por nombre, por puntuación media o por fase del proceso)?

4. **Paginación**:
   - ¿Se requiere paginación para este endpoint? Veo que podría haber muchos candidatos para una posición.

5. **Validación**:
   - Si se proporciona un ID de posición que no existe, ¿qué tipo de respuesta de error debemos devolver?

6. **Estado de la aplicación**:
   - ¿Debemos incluir solo las aplicaciones activas o también las que puedan estar en estado cerrado/rechazado?

7. **Información adicional**:
   - Además de nombre, fase actual y puntuación media, ¿hay algún otro campo que podría ser útil incluir en la respuesta (por ejemplo, fecha de la última entrevista o email del candidato)?

Por favor, ayúdame a aclarar estos puntos para poder proponer una solución que se ajuste exactamente a tus necesidades.

## Prompt 2
1. El formato del nombre será: "name": "firstName lastName"
2. Excluimos las entrevistas sin puntuación para la media. Devolveremos null si no tiene entrevistas o todas tienen score null
3. Ordenaremos por puntuación media
4. Sí, un 404
5. Consideramos todas
6. Sí, con el esquema de paginación de endpoint REST más habitual
7. No

## Prompt 3
¿En qué nombre de fichero propones crear los interfaces CandidatePositionResponse y PaginatedResponse?

## Respuesta 3 
Propone en '../../domain/types/responses'

## Prompt 4
Al pertenecer a la capa de la API del backend, deberían estar esos tipos en la caerpeta presentation, ¿qué opinas?

## Prompt 5
Al ser solo del candidato, te propongo modificarlo para que el fichero esté en: presentation/types/responses/candidateResponses.ts, y que el interface PaginatedResponse, lo denomines CandidatePositionPaginatedResponse

## Prompt 6 
Sí, ¿podrías actualizarme el resto de cambios?

## Prompt 7
Me gustaría que refactorizaras el candidateService, el método findCandidatesByPosition, para que no haga la búsqueda en Prisma en el servicio, sino que use un método de búsqueda del modelo de Candidate

# Endpoint PUT /candidates/:id/stage

## Prompt 1
Con la misma estructura, y teniendo el contexto del proyecto, como desarrollador Typescript necesito que agregues un nuevo endpoint: 
 - PUT /candidates/:id/stage
 - Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

 ## Prompt 2
 Podrías refactorizar el método updateCandidateInterviewStage para mover la lógica de persistencia al modelo de Candidate?

