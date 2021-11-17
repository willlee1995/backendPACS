import passport from "passport";
import { User } from '../models';
import { SECRET as secretOrKey} from '../constants';
import { Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'

const opts = {
    secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  
  passport.use(
    new JWTStrategy(opts, async ({ id }, done) => {
      try {
        let user = await User.findById(id);
        if (!user) {
          throw new Error("User not found.");
        }
        return done(null, user.getUserInfo());
        
      } catch (err) {
        done(null, false);
      }
    })
  );