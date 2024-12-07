# **Prompts-JLSO**

| **Author**        | Jorge Luis Sánchez Ocampo |
|--------------------|---------------------------|
| **AI Assistant**   | GitHub Copilot            |
| **LLM’s**          | o1-preview, Claude 3.5 (preview) |

---

## **Table of Contents**
1. [GET /positions/:id/candidates - Prompts](#get-positionsidcandidates---prompts)
2. [PUT /candidates/:id/stage - Prompts](#put-candidatesidstage---prompts)

---

## **1. GET /positions/:id/candidates - Prompts**

### **Prompts**
```markdown
#codebase Vamos a crear un nuevo endpoint el proyecto /backend:

1. path: /positions/:id/candidates
2. Method: GET
3. Description: este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado `positionID`. Debe proporcionar la siguiente información básica:
    - Nombre completo del candidato (de la tabla `candidate`).
    - `current_interview_step`: en qué fase del proceso está el candidato (de la tabla `application`).
    - La puntuación media del candidato. Recuerda que cada entrevista (`interview`) realizada por el candidato tiene un score

Dime los pasos que para implementar este nuevo endpoint, todavía no empieces a ejecutar.
```

```markdown
Empecemos con el primer paso, la creación de la ruta en el router. Usa el router #file:candidateRoutes.ts ya existente
```

```markdown
continuemos con el segundo punto, la creación del controlador. Usa el controlador #file:candidateController.ts ya existente
```

```markdown
continuemos con el tercer paso: Realizar la consulta a la base de datos:

Utiliza Prisma (o el ORM que estés usando) para obtener las aplicaciones (application) que correspondan al positionId proporcionado. Por cada aplicación: Obtén el candidato asociado y su nombre completo de la tabla candidate. Obtén el current_interview_step de la tabla application. Calcula la puntuación media del candidato obteniendo todas las entrevistas (interview) asociadas y promediando sus score.
```

```markdown
Cannot find module '../../prismaClient' or its corresponding type declarations.
```

```markdown
revisa algunos errores de tipos que tengo en el archivo #file:candidateService.ts, usa los siguientes modelos para revisar los tipos #file:Candidate.ts, #file:Position.ts en el servicio getCandidatesByPositionService
```

```markdown
Object is possibly . (method) Array<number | null>.reduce(callbackfn: (previousValue: number | null, currentValue: number | null, currentIndex: number, array: (number | null)[]) => number | null (+2 overloads) Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

@param callbackfn — A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

@param initialValue — If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
```

```markdown
continuemos con el paso 4 del plan inicial: Estructurar y enviar la respuesta:

Formatea los datos en un arreglo de objetos que incluyan: candidateName: Nombre completo del candidato. currentInterviewStep: Fase actual del proceso del candidato. averageScore: Puntuación media del candidato. Envía la respuesta con un código de estado HTTP 200.
```

---

### **Testing**
#### **Curl Commands for Testing**
- **Test `positionId = 1`:**
  ```bash
  curl -X GET 'http://localhost:3010/candidates/positions/1/candidates'
  ```
- **Test `positionId = 2`:**
  ```bash
  curl -X GET 'http://localhost:3010/candidates/positions/2/candidates'
  ```

#### **Sample Results**
```markdown
# Test positionId=1
curl -X GET 'http://localhost:3010/candidates/positions/1/candidates'

# Test positionId=2
curl -X GET 'http://localhost:3010/candidates/positions/2/candidates'
[{"candidateName":"John Doe","currentInterviewStep":2,"averageScore":5},{"candidateName":"Jane Smith","currentInterviewStep":2,"averageScore":4},{"candidateName":"Carlos García","currentInterviewStep":1,"averageScore":null}][{"candidateName":"John Doe","currentInterviewStep":2,"averageScore":5}]%  
```

---

## **2. PUT /candidates/:id/stage - Prompts**

### **Prompts**
```markdown
#file:candidateService.js #file:candidateController.ts #file:candidateRoutes.ts #file:Candidate.ts #file:schema.prisma   Ahora vamos a implementar un nuevo endpoint: 
1. path: /candidates/:id/stage
2. method: PUT
3. Descripción: Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.
```

```markdown
revisa errores de tipo en el servicio updateCandidateStageService, verifica los tipos en #file:Application.ts 
```

```markdown
/fix Cannot find name 'Application'.
```

```markdown
/fix Cannot find name 'updateCandidateStageService'. Did you mean 'updateCandidateStage'?
```

---

### **Testing**
#### **Curl Command for Testing**
```bash
curl -X PUT 'http://localhost:3010/candidates/1/stage' \
-H "Content-Type: application/json" \
-d '{"newStageId": 3}'
```
 
---


## **`Refactor` updateCandidateStageService**
### **Prompts**

```markdown
Eres un experto ingeniero de backend. Quiero que analices el uso de buenas prácticas en el servicio updateCandidateStageService de #file:candidateService.ts y sus funciones relacionadas en #file:candidateController.ts, #file:candidateRoutes.ts, #file:Candidate.ts, #file:Application.ts y #file:schema.prisma, como DDD y SOLID, y me propongas posibles mejoras. No programes nada aún, te iré indicando cuáles de las medidas que propongas quiero adoptar.
```

```markdown
Comencemos con la primer propuesta de mejora: Separación de Responsabilidades

- Crear un repositorio específico para Application
- Separar la lógica de validación
- Implementar un servicio de notificación para cambios de estado
```

```markdown
Si, implementemos los cambios paso a paso, genera los shell scripts necesarios para crear los nuevos archivos si hace falta
```

```markdown
/fix Expected 5 arguments, but got 2.
```

```markdown
🚀 ~ updateCandidateStage ~ error: TypeError: Cannot read properties of undefined (reading 'findByCandidate') at /Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:190:64 at step (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:33:23) at Object.next (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:14:53) at /Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:8:71 at new Promise (<anonymous>) at __awaiter (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:4:12) at updateCandidateStageService (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/application/services/candidateService.js:186:139) at /Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/presentation/controllers/candidateController.js:130:89 at step (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/presentation/controllers/candidateController.js:33:23) at Object.next (/Users/macbook/Documents/development/ia4devs/sessions/session_9/AI4Devs-backend/backend/dist/presentation/controllers/candidateController.js:14:53)
```

```markdown
Continuemos con la siguiente propuesta de mejora:
2. **Value Objects**
    - Crear InterviewStage como Value Object
    - Encapsular reglas de transición entre estados
```

```markdown
hasta este momento, cuantas de las 6 mejoras propuestas has aplicado?
```

```markdown
hasta este momento, cuantas de las 6 mejoras propuestas has aplicado?
```

```markdown
Si, continúa con la implementación de value objects para interviewStage
```

```markdown
crea varios curls para probar el servicio #sym:updateCandidateStageService
```


```markdown
can you verify the curls generated, i get an internal server error, analyze #file:candidateController.ts #file:candidateRoutes.ts #file:candidateService.ts
```

```markdown
Ahora continuemos con la implementación de la tercera propuesta de mejora: 3. Repository Pattern - Crear interface IApplicationRepository - Implementar PrismaApplicationRepository
```

```markdown
continuemos con la implementación de la siguiente propuesta de mejora: 4. **Domain Events**
    - Implementar evento StageUpdated
    - Permitir reacciones a cambios de estado
```

```markdown
/fix Cannot find name 'EventDispatcher'.
```