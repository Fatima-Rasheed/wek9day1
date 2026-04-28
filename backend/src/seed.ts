import { connect, connection } from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/week9day1';

const documents = [
  {
    title: 'Monolithic Architecture',
    topic: 'Architecture',
    content:
      'Traditional approach where all components exist within a single codebase and deployment unit.',
    pros: [
      'Simple development and debugging',
      'Easy deployment',
      'Good performance for simple apps',
      'Straightforward transactions',
    ],
    cons: [
      'Difficult to scale',
      'Technology lock-in',
      'Large codebase complexity',
      'Risky deployments',
    ],
    tags: ['monolithic', 'architecture', 'traditional'],
    createdAt: '2025-09-20',
  },
  {
    title: 'Microservices Architecture',
    topic: 'Architecture',
    content:
      'Architectural style that structures an application as a collection of loosely coupled services.',
    pros: [
      'Independent scaling',
      'Technology flexibility',
      'Fault isolation',
      'Team autonomy',
    ],
    cons: [
      'Complex deployment',
      'Network overhead',
      'Distributed transactions',
      'Monitoring challenges',
    ],
    tags: ['microservices', 'architecture', 'distributed'],
    createdAt: '2025-09-20',
  },
  {
    title: 'Monolithic vs Microservices',
    topic: 'Architecture',
    content:
      'Comparison between monolithic and microservices architectures for application design.',
    pros: ['Clear trade-offs understanding', 'Context-based decision making'],
    cons: ['No one-size-fits-all solution', 'Migration complexity'],
    tags: ['monolithic', 'microservices', 'comparison', 'architecture'],
    createdAt: '2025-09-20',
  },
  {
    title: 'REST API Architecture',
    topic: 'APIs',
    content:
      'Architectural style using standard HTTP methods for networked applications.',
    pros: [
      'Simple and widely adopted',
      'HTTP caching support',
      'Stateless design',
      'Easy to understand',
    ],
    cons: [
      'Over-fetching/under-fetching',
      'Multiple round trips',
      'Versioning challenges',
    ],
    tags: ['REST', 'HTTP', 'API-design'],
    createdAt: '2025-09-20',
  },
  {
    title: 'GraphQL API Architecture',
    topic: 'APIs',
    content:
      'Query language for APIs allowing clients to request exactly the data they need.',
    pros: [
      'Precise data fetching',
      'Single endpoint',
      'Strong typing',
      'Real-time subscriptions',
    ],
    cons: [
      'Complex caching',
      'Learning curve',
      'Query complexity',
      'Over-querying risks',
    ],
    tags: ['GraphQL', 'API-design', 'query-language'],
    createdAt: '2025-09-20',
  },
  {
    title: 'REST vs GraphQL',
    topic: 'APIs',
    content: 'Comparison between REST and GraphQL API architectures.',
    pros: [
      'Flexibility in data fetching',
      'Better mobile performance with GraphQL',
    ],
    cons: ['REST simpler for basic needs', 'GraphQL adds complexity'],
    tags: ['REST', 'GraphQL', 'comparison', 'APIs'],
    createdAt: '2025-09-20',
  },
  {
    title: 'SQL Databases',
    topic: 'Databases',
    content:
      'Relational databases using structured query language with ACID properties.',
    pros: [
      'ACID compliance',
      'Strong consistency',
      'Complex queries',
      'Mature ecosystem',
    ],
    cons: ['Rigid schema', 'Vertical scaling limits', 'Complex sharding'],
    tags: ['SQL', 'relational', 'database', 'ACID'],
    createdAt: '2025-09-20',
  },
  {
    title: 'NoSQL Databases',
    topic: 'Databases',
    content:
      'Non-relational databases designed for flexible schemas and horizontal scaling.',
    pros: [
      'Flexible schema',
      'Horizontal scaling',
      'High performance',
      'Document storage',
    ],
    cons: [
      'Eventual consistency',
      'Limited transactions',
      'Less mature tooling',
    ],
    tags: ['NoSQL', 'document', 'database', 'scalability'],
    createdAt: '2025-09-20',
  },
  {
    title: 'SQL vs NoSQL',
    topic: 'Databases',
    content: 'Comparison between SQL and NoSQL database systems.',
    pros: ['SQL for complex relationships', 'NoSQL for flexibility and scale'],
    cons: ['SQL scaling challenges', 'NoSQL consistency trade-offs'],
    tags: ['SQL', 'NoSQL', 'comparison', 'databases'],
    createdAt: '2025-09-20',
  },
  {
    title: 'Server-Side Rendering (SSR)',
    topic: 'Rendering',
    content: 'Rendering web pages on the server before sending to the client.',
    pros: [
      'Better SEO',
      'Faster initial load',
      'Works without JavaScript',
      'Social media sharing',
    ],
    cons: [
      'Server load',
      'Slower navigation',
      'Complex caching',
      'Higher hosting costs',
    ],
    tags: ['SSR', 'rendering', 'performance', 'SEO'],
    createdAt: '2025-09-20',
  },
  {
    title: 'Client-Side Rendering (CSR)',
    topic: 'Rendering',
    content: 'Rendering web pages in the browser using JavaScript frameworks.',
    pros: [
      'Rich interactions',
      'Fast navigation',
      'Lower server costs',
      'Offline capabilities',
    ],
    cons: [
      'Poor initial SEO',
      'Slower first load',
      'JavaScript required',
      'Bundle size',
    ],
    tags: ['CSR', 'rendering', 'SPA', 'JavaScript'],
    createdAt: '2025-09-20',
  },
  {
    title: 'SSR vs CSR',
    topic: 'Rendering',
    content:
      'Comparison between server-side and client-side rendering strategies.',
    pros: ['SSR for SEO and initial load', 'CSR for interactivity'],
    cons: ['SSR increases server load', 'CSR hurts initial performance'],
    tags: ['SSR', 'CSR', 'comparison', 'rendering'],
    createdAt: '2025-09-20',
  },
  {
    title: 'WebSockets',
    topic: 'Real-time Communication',
    content:
      'Full-duplex communication protocol for real-time bidirectional data transfer.',
    pros: [
      'True real-time',
      'Low latency',
      'Bidirectional',
      'Efficient for frequent updates',
    ],
    cons: [
      'Complex infrastructure',
      'Scaling challenges',
      'Firewall issues',
      'Connection management',
    ],
    tags: ['WebSockets', 'real-time', 'bidirectional', 'protocol'],
    createdAt: '2025-09-20',
  },
  {
    title: 'HTTP Polling',
    topic: 'Real-time Communication',
    content:
      'Technique where clients repeatedly request updates from the server.',
    pros: [
      'Simple implementation',
      'Works everywhere',
      'Easy debugging',
      'No special infrastructure',
    ],
    cons: [
      'High latency',
      'Server overhead',
      'Wasted requests',
      'Not truly real-time',
    ],
    tags: ['polling', 'HTTP', 'real-time', 'requests'],
    createdAt: '2025-09-20',
  },
  {
    title: 'WebSockets vs Polling',
    topic: 'Real-time Communication',
    content:
      'Comparison between WebSockets and HTTP polling for real-time features.',
    pros: ['WebSockets for true real-time', 'Polling for simplicity'],
    cons: ['WebSockets complex to scale', 'Polling inefficient'],
    tags: ['WebSockets', 'polling', 'comparison', 'real-time'],
    createdAt: '2025-09-20',
  },
  {
    title: 'MongoDB',
    topic: 'Databases',
    content:
      'Document-oriented NoSQL database that stores data in flexible, JSON-like documents with dynamic schemas.',
    pros: [
      'Flexible schema design',
      'Horizontal scalability',
      'Rich query language',
      'Built-in replication and sharding',
      'High performance for read/write operations',
      'Native JSON support',
    ],
    cons: [
      'Memory intensive',
      'No ACID transactions across documents (before v4.0)',
      'Data duplication in denormalized designs',
      'Limited join support',
    ],
    tags: [
      'MongoDB',
      'NoSQL',
      'document-database',
      'database',
      'JSON',
      'scalability',
    ],
    createdAt: '2025-09-20',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const documentsCollection = db.collection('documentmodels');

    // Clear existing documents
    await documentsCollection.deleteMany({});
    console.log('Cleared existing documents');

    // Insert documents
    if (documents.length > 0) {
      await documentsCollection.insertMany(documents);
      console.log(`Inserted ${documents.length} documents`);
    }

    // Drop existing text indexes if any
    try {
      const indexes = await documentsCollection.indexes();
      for (const index of indexes) {
        if (index.key && index.key._fts === 'text' && index.name) {
          await documentsCollection.dropIndex(index.name);
          console.log(`Dropped existing text index: ${index.name}`);
        }
      }
    } catch (error) {
      console.log('No existing text indexes to drop');
    }

    // Create text index (or skip if it already exists with correct fields)
    try {
      await documentsCollection.createIndex(
        { content: 'text', title: 'text', tags: 'text' },
        { name: 'text_search_index' },
      );
      console.log('Created text search index');
    } catch (error: any) {
      if (error.code === 85) {
        console.log('Text index already exists, skipping creation');
      } else {
        throw error;
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
