## Good sources:

https://github.com/cloudflare/miniflare-typescript-esbuild-jest
https://github.com/cloudflare/itty-router-openapi
https://itty.dev/itty-router/typescript#uniform-routers
https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-openapi
https://github.com/tsndr/cloudflare-worker-router
https://duck.brainy.sh/#/?id=getting-started


## Lerna (monorepo)
https://developers.cloudflare.com/workers/tutorials/manage-projects-with-lerna/

## How to run
1. Open as dev container in VS Code
1. Create database Products:
11. Go to Fauna extension in the VS Code
11. Press Create button and select collection
11. Name collection as Products

# list all installed packages
npm ll

# install all packages
npm install


npx brainyduck --domain localhost --port 8443 --scheme http --graphql-domain localhost --graphql-port 8084

npx wrangler kv:namespace create fitbit --preview
npx wrangler tail fitbit
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"

Need to create personal token, because:
https://dev.fitbit.com/build/reference/web-api/intraday/
A Fitbit developer’s personal Intraday data is automatically available through the “Personal” application type. You do not need to submit a request.




https://developers.cloudflare.com/workers/tutorials/
https://developers.cloudflare.com/workers/learning/integrations/databases/

NoSQL:
https://filess.io/#pricing
https://www.harperdb.io/pricing -> https://api.harperdb.io/#16985084-0ada-492b-a202-46500d844ab9 -> https://hub.docker.com/r/harperdb/harperdb
https://www.mongodb.com/pricing -> https://www.mongodb.com/docs/realm/web/install/ -> https://www.mongodb.com/developer/products/atlas/cloudflare-worker-rest-api/ -> https://davistobias.com/articles/mongodb-cloudflare/ -> https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas/blob/main/src/index.ts
https://fauna.com/pricing



https://www.mongodb.com/community/forums/t/bulk-write-operations-in-realm-node-js-sdk/118327/3

TODO: Implement sleep