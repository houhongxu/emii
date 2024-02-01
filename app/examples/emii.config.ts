export default {
  title: 'Hi',
  keepalive: [/./],
  proxy: {
    '/octocat': {
      target: 'https://api.github.com/users/',
      changeOrigin: true,
      rewrite: () => '/vagusx',
      logs: true,
    },
  },
}
