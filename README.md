# happy-coach

npm run typeorm migration:create ./src/data/migrations/ini

npm run typeorm migration:generate -d .\src\data\context.ts ./src/data/migrations/init2

npm run typeorm migration:run -- -d path-to-datasource-config

typeorm migration:generate -d .\src\data\context.ts ./src/data/migrations/init2

npm run typeorm migration:run -- -d path-to-datasource-config
