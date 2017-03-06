module.exports = {


  config: {
    defaultField: 'fullName'
  },


  structure: {
    list: ['firstName', 'lastName', 'username', 'email'],
    edit: [
      {fields: ['firstName', 'lastName', 'email', 'username', 'password']}
    ]
  },


  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      config: {
        list: {},
        edit: {}
      }
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
      config: {
        list: {},
        edit: {}
      }
    },
    password: {
      type: 'string',
      config: {
        edit: {template: 'passwordCombo'}
      }
    },
    firstName: {
      type: 'string',
      required: true,
      config: {
        edit: {}
      }
    },
    lastName: {
      type: 'string',
      required: true,
      config: {
        edit: {}
      }
    },
    avatar: {
      model: 'image'
    },
    role: {
      model: 'role'
    },
    token: {
      type: 'string'
    },
    toJSON: function () {
      var obj = this;
      obj.fullName = `${obj.firstName} ${obj.lastName}`;
      delete obj.password;
      return obj;
    }
  },


  i18n: {
    en: {
      slug: 'users',
      singular: 'User',
      plural: 'Users'
    },
    ro: {
      slug: 'useri',
      singular: 'User',
      plural: 'Useri'
    }
  },

  beforeCreate: beforeSave,
  beforeUpdate: beforeSave,

  autoCreatedAt: true,
  autoUpdatedAt: true

};

function beforeSave(newUser, cb) {

  // remove images that are removed on update
  if (newUser.id) {
    User.findOne(newUser.id).populate('avatar').exec(function (err, oldUser) {
      if (oldUser.avatar && newUser.avatar && newUser.avatar != oldUser.avatar.id) {
        Image.destroy({id: oldUser.avatar.id}).exec(cb);
      }
    });
  }

  // handle password change
  delete newUser.password;
  delete newUser.passwordRepeat;
  if (newUser.passwordNew) {
    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.passwordNew, salt, function (err, hash) {
        if (err) {
          console.log('passwordHashError', err);
          cb(err);
        } else {
          newUser.password = hash;
          delete newUser.passwordNew;
          cb();
        }
      });
    });
  } else cb();

}
