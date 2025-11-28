export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DB_HOST", "localhost"),
      port: env.int("DB_PORT", 5432),
      database: env("DB_NAME"),
      user: env("DB_USER"),
      password: env("DB_PASSWORD"),
      ssl: env.bool("DB_SSL", false),
    },
    pool: { min: 1, max: 5 },
  },
});
