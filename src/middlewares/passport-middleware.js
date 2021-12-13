import passport from "passport";
import { User } from '../models';
import { SECRET as secretOrKey} from '../constants';
import { Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['auth'];
  return token;
};
const opts = {
    secretOrKey,
    jwtFromRequest: cookieExtractor,
  };
  
  passport.use(
    new JWTStrategy(opts, async ({ id }, done) => {
      try {
        
        let user = await User.findById(id);
        if (!user) {
          throw new Error("User not found.");
        }
        console.log(user.getUserInfo())
        return done(null, user.getUserInfo());
        
      } catch (err) {
        done(err, false);
      }
    })
  );