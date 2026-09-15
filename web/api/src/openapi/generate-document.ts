// openapi/generate-document.ts
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';
import './paths/item.path.js'; // side-effect imports — each file calls registry.registerPath(...)

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'LendTrack API',
      version: '1.0.0',
      description:
        'API for tracking items you lend and borrow with your neighborhood contacts.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local dev' }],
  });
}
