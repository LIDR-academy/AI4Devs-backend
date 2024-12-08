@workspace can you give me recommendations on how to better use SOLID and DDD practices within the backend module of this project? We will implement some of your answers.

---

Let's implement the CandidateRepository class you suggested as a DDD best practice. Let's also incorporate the Single Responsibility and Dependency Inversion principles from SOLID to move the corresponding logic away from the #file:Candidate.ts class.

---

Update #file:candidateService.ts to use the newly added #file:CandidateRepository.ts to update #file:Candidate.ts instances.

---

There's a lot of duplicated logic between the #file:CandidateService.ts class and #file:CandidateRepository.ts classes, can you clean it up?

---

@workspace Let's now create a new endpoint, GET /positions/:id/candidates, which will return all candidates with an active application for the requested positionID. The response must contain the full name of each candidate, their current interview step, and the average interview score for their interviews. Take into account the database structure, defined in #file:schema.prisma.

---

@workspace Let's now add another endpoint, PUT /candidates/:id/stage, which updates the current stage for a candidate