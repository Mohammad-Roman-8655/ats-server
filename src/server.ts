import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function bootstrap() {
  await connectDB();

  app.listen(Number(env.PORT), () => {
    console.log(`✅ Server running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
