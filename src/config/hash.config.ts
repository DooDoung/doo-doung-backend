export default () => ({
  hash: {
    saltRound: parseInt(process.env.SALT_ROUND ?? "10", 10),
  },
})
