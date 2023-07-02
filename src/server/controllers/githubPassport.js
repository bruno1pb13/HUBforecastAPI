const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

passport.use(
    new GitHubStrategy(
      {
        clientID: '39b586b3a08bf8c9ea82',
        clientSecret: '814e1d7ab47b52f74b9ca56638eec48c279c1e22',
        callbackURL: 'https://192.168.100.29:3000/session/auth/github/callback'
      },
      (accessToken, refreshToken, profile, done) => {
        // Aqui você pode tratar a resposta do GitHub após a autenticação
        // profile conterá as informações do usuário autenticado
        // done é uma função de callback para continuar o fluxo da autenticação
      }
    )
  );
  