import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { User } from "../models/userModel.js";
import { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } from "../config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Vérifiez si l'utilisateur existe déjà
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // Créez un nouvel utilisateur si nécessaire
        const newUser = await User.create({
          googleId: profile.id,
          nom: profile.name.givenName,
          prenom: profile.name.familyName,
          email: profile.emails[0].value,
        });
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
