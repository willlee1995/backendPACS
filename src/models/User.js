import {
    Schema,
    model
} from 'mongoose';
import {
    compare,
    hash,
    genSalt
} from 'bcrypt-nodejs'
import {
    sign
} from 'jsonwebtoken';
import {
    SECRET
} from '../constants'; 
import { pick } from 'lodash'

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified("password")) return next();
    await genSalt(10, (err, salt)=>{
        if (err) {
            return next(err)
        }
        user.password = hash(user.password, salt, null, (err, hash) =>{
            if (err) {
                return next(err);
            }
            user.password = hash
        } )
    })
    
    next();
});

UserSchema.methods.comparePassword = async function (next) {
    return await compare(password, this.password)
};

UserSchema.methods.generateJWT = async function (next) {
    let payload = {
        username: this.username,
        email: this.email,
        name: this.name,
        id: this._id
    }
    return await sign(payload, SECRET, {expiresIn: "1 day"})
}

UserSchema.methods.getUserInfo = function () {
    return pick(this, ["_id", "username","name","email",])
}

const User = model("users", UserSchema)

export default User