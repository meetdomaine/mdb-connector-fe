/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mooseknuckles-fe-mdb-connector",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "mooseknuckles"
        }
      },
      copyFiles: [{ from: "./node_modules/.prisma/client/" }],
    };
  },
  async run() {
    const SHOPIFY_APP_URL = $app.stage !== "production"
      ? "https://foo@sentry.io/bar"
      : "https://d387owu54d9uht.cloudfront.net/";

     const SHOPIFY_API_KEY = $app.stage !== "production"
      ? "https://foo@sentry.io/bar"
      : "7fbee76e08179de1c8718d76030f59da";

     const SHOPIFY_API_SECRET = $app.stage !== "production"
      ? "https://foo@sentry.io/bar"
      : "f3fa01a57656241f2e8a47270af2583c";
     
      const DATABASE_URL = $app.stage !== "production"
      ? "https://foo@sentry.io/bar"
      : "postgresql://postgres:d6QSozQoN6zeWqV54RlwjPtaSK34Sg14@mooseknuckles-fe-mdb-conn-production-shopifyfeinstance-bchvcwnc.cbsmekksosvl.us-west-2.rds.amazonaws.com:5432/mooseknuckles_fe_mdb_connector";

    const vpc = new sst.aws.Vpc("mdbConnectorFeVpc", { nat: "managed" });
    const rds = new sst.aws.Postgres("shopifyFe", {
      vpc,
     });

    new sst.aws.Remix("MyWeb", {
      vpc,
      link: [rds],
      environment: {
        SHOPIFY_APP_URL,
        SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET
      }
  });
  },
});
