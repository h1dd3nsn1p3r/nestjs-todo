const env = {
  PORT: Number(process.env.PORT) || (3000 as number),
};

export default () => ({
  env: env,
});
