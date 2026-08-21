# Notes — how we are completing the task

1. First we carefully read the task  
   We went through the assignment (all three parts) before building anything: API documentation, chat app, landing page, write-up, stack (React / Next.js), deadline, and the requirement for live demo links.

2. Then we verified the endpoints from Postman as well  
   Swagger only documents requests. We called the live API (login, search, conversations, groups, messages, health, Socket.io) and recorded real status codes and response bodies. We also checked the same flows in Postman.

3. Create API doc and generate a comprehensive collection for Postman  
   - `docs/api-doc.md` — API reference for us while building  
   - `docs/Chat-API.postman_collection.json` — Postman collection to submit as the Part 1 API documentation

**Next:** scaffold the Next.js app and implement the chat screens against the live API.
