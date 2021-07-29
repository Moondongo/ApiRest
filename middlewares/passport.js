const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'user',
			passwordField: 'password',
		},
		async (user, password, done) => {
			try {
				const usuario = await User.findOne({ user });
				if (!usuario) {
					return done(null, false, { message: 'User not found' });
				}

				const validate = await usuario.matchPassword(password);

				if (!validate) {
					return done(null, false, { message: 'Wrong password' });
				}

				return done(null, usuario, { message: 'Login successfull' });
			} catch (e) {
				return done(e);
			}
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			secretOrKey: 'top_secret',
			jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (e) {
				done(error);
			}
		}
	)
);
