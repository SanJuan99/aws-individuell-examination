# 📋 Message Board Project

Ett enkelt meddelandesystem byggt med **React (frontend)** och **AWS Serverless (backend)**.

## Funktioner
- Posta nya meddelanden
- Se alla meddelanden
- Uppdatera ett meddelande (endast om det existerar)
- Sortera meddelanden (nyast/äldst först)
- Filtrera på användarnamn (backend-query, inte bara frontend)

## Teknisk stack
- **Frontend**: React (Vite) → deployad till AWS S3
- **Backend**: AWS Lambda, API Gateway, DynamoDB → via Serverless Framework
- **Databas**: DynamoDB (lagrar `id`, `username`, `text`, `createdAt`)