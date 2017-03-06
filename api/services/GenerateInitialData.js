/**
 * Generates Initial Data on App Bootstrap
 * @returns {Promise}
 */
module.exports = function () {
  return new Promise(function (resolve) {

    checkIfThereIsAdminRole()
      .then(checkIfThereIsAdminUser)
      .then(resolve);


    function checkIfThereIsAdminRole () {
      return new Promise(function (resolve) {
        Role.findOne({key: 'admin'}).then(function(role) {
          if(role) resolve();
          else {
            Role.create({
              display: 'Admin',
              key: 'admin'
            }).then(resolve);
          }
        });
      })
    }

    function checkIfThereIsAdminUser () {
      return new Promise(function (resolve) {
        User.findOne({username: 'admin'}).then(function(user) {
          if(user) resolve();
          else {
            User.create({
              username: 'admin',
              email: 'admin@admin.com',
              firstName: 'Admin',
              lastName: 'Admin',
              displayName: 'Admin',
              passwordNew: 'admin',
              role: 'admin'
            }).then(resolve);
          }
        });
      })
    }
  })

};
