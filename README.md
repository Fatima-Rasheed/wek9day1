# Mini Research Team Web App

A multi-agent research system built with Next.js, NestJS, and MongoDB that intelligently answers questions using a workflow of specialized agents.

## Architecture

- **Frontend**: Next.js (Port 3000)
- **Backend**: NestJS (Port 3001)
- **Database**: MongoDB

## Workflow Agents

1. **Question Splitter** - Breaks questions into sub-questions
2. **Document Finder** - Searches MongoDB for relevant documents
3. **Ranker** - Scores documents using TF-IDF (no LLMs)
4. **Summarizer** - Extracts key sentences using TextRank
5. **Cross-Checker** - Detects contradictions between sources
6. **Final Answer Maker** - Composes answer with full trace

## Project Structure

```
/backend          - NestJS API server
/frontend         - Next.js web application
/documents        - Sample documents for seeding
```

## Setup Instructions

### 1. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Create database: `research_team_db`

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB connection in .env
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure backend URL in .env.local
npm run dev
```

### 4. Seed Documents
```bash
cd backend
npm run seed
```

## API Endpoints

- `POST /ask` - Submit a question
- `POST /documents/upload` - Upload new documents
- `GET /documents` - Get all documents (optional ?topic=TopicName filter)
- `GET /trace/:id` - Retrieve query trace
- `DELETE /documents/:id` - Delete a document

### Upload Document Example

```bash
curl -X POST http://localhost:3001/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Docker",
    "topic": "Containerization",
    "content": "Docker is a platform for developing, shipping, and running applications in containers...",
    "pros": ["Consistent environments", "Fast deployment"],
    "cons": ["Learning curve", "Resource overhead"],
    "tags": ["docker", "containers", "devops"]
  }'
```

## Topics Covered

1. SQL vs NoSQL Databases
2. REST API vs GraphQL
3. Monolithic vs Microservices Architecture
4. Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)
5. WebSockets vs HTTP Polling
