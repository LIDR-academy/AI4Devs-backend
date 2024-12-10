# Prompts GET /positions/:id/candidates

## Prompt 1: Contexto del proyecto
```
    Vamos a empezar a trabajar en unas tareas del Backend de este proyecto, pero para iniciar quiero que tengas un contexto general del proyecto, de las tecnologias que se usan, de las buenas practicas y delas estructuras de los componentes incluyendo las maneras como se separa el codigo
```

## Prompt 2: Especificaciones del requerimiento 1

```
    Requiero implemenar un enpoint GET /positions/:id/candidates,este recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

    * Nombre completo del candidato (de la tabla candidate).
    * current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
    * La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score

    para su implementacion quiero que me ayudes a:
    1. Diseñar un plan para su implementación
    2. usar las buenas practicas con las que esta construido el proyecto (DDD, solid y patrones de diseño como Singleton, Factory, Observer o Strategy )
    3. usar TDD

    recuerda no generar codigo aun, primero diseñaremos el plan e ire decidiendo como implementarlo. Si tienenes dudas cuentamelas antes de continuar

```

Respuesta a preguntas del proceso
```
    en respuesta a tus preguntas:
    1. la puntuación media es un promedio del score de cada entrevista
    2. Si no tiene entrevistas, se debe devolver un mensaje diciendo que no tiene información de entrevistas
    3. el formato esperado es un json
```	

Entendiendo el plan de implementación
```
    Enumera paso a paso las actividades que vamos a desarrollar para la implementación de este endpoint
```

## Prompt 3: Implementación del requerimiento 1
```
   vamos por el Paso 2: Desarrollo de la Lógica de Negocio, asegurate de tener en cuenta las recomendaciones dadas en la elaboración del plan referente a buenas pacticas y uso de TDD
```

## Prompt 4: Refactorización del requerimiento 1
```
    las pruebas iniciales de getCandidatesByPositionId ya estan aprobadas, podemos refactorizar la funconalidad? entregame por favor  **SIEMPRE** la ruta y los archivos donde se deben aplicar los cambios
```

## Prompt 5: Revisión del plan de implementación
```
    quiero volver a revisar el plan de implementación y validemos que nos falta para terminar de implementar la funcionalidad
```
```
    cual seria entonces el codigo del archivo mencionado en el punto 2?
```

```
    ya entonces esta implementada la funcionalidad requerida? puedo ejecutar las pruebas finales?
```

## Prompt 6: Validación final del requerimiento 1

```
    quiero hacer la ultima validación, asegutare col el codigo implementado y con el [requerimiento], que todo este correctamente implementado

    [requerimiento]= "GET /positions/:id/candidates
    Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

    Nombre completo del candidato (de la tabla candidate).
    current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
    La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score"
```
## Prompt 7: Validación final del requerimiento 1
```
    quiero hacer la ultima validación, asegutare col el codigo implementado y con el [requerimiento], que todo este correctamente implementado

    [requerimiento]= "GET /positions/:id/candidates
    Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

    Nombre completo del candidato (de la tabla candidate).
    current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
    La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score"
```


# Prompts PUT /candidates/:id/stage

## Prompt 1: Contexto del requerimiento
 ```
    ahora requiero implementar el endopoint PUT /candidates/:id/stage
    Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

    para su implementacion quiero que me ayudes a:
    1. Implementar un plan para si implementación
    2. usar las buenas practicas con las que esta construido el proyecto (DDD, solid y patrones de diseño como Singleton, Factory, Observer o Strategy )
    3. usar TDD

    recuerda no generar codigo aun, primero diseñaremos el plan e ire decidiendo como implementarlo. Si tienenes dudas cuentamelas antes de continuar
 ```

 ```
    vamos a iniciar con la implementación
 ```

 ```
    como ejecuto las pruebas unitarias de este endpoint por consola?
 ```

```
    ahora podemos refactorizar el codigo implementado?
```

```
    ahora podemos refactorizar el codigo implementado?
```
 
 ```
    la modificación sugerida no aplico ningun cambio en el codigo, por ende el error debe persistir
 ```

  ```
    Ejecutemos las pruebas finales
 ```

  ```
    verifica el codigo @Codebase con la solución implementada y asegura que se cumplen con el [requisito] solicitado.
    [requisito] = "ahora requiero implementar el endopoint PUT /candidates/:id/stage
    Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

    para su implementacion quiero que me ayudes a:
    1. Implementar un plan para si implementación
    2. usar las buenas practicas con las que esta construido el proyecto (DDD, solid y patrones de diseño como Singleton, Factory, Observer o Strategy )
    3. usar TDD
    "
 ```