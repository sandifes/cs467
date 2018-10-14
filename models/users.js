module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        username: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        }, 

        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },

        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
            notEmpty: true
        },

    });
 
    return User;
 
}