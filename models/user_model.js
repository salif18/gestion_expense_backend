//IMPORTATIONS
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     phone_number: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     email_verified_at: {
//         type: Date,
//         default: null
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     remember_token: {
//         type: String,
//         default: null
//     }
// }, { timestamps: true });



// UserSchema.plugin(uniqueValidator)

// module.exports = mongoose.model("User", UserSchema)

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    email_verified_at: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    remember_token: {
        type: String,
        default: null
    }
}, { 
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.remember_token;
            return ret;
        }
    }
});

// Relations virtuelles
userSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'userId',
    justOne: false
});

userSchema.virtual('budgets', {
    ref: 'Budget',
    localField: '_id',
    foreignField: 'userId',
    justOne: false
});

userSchema.plugin(uniqueValidator);

module.exports  = mongoose.model('User', userSchema);


