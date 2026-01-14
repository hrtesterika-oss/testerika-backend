module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tbluser_referral_codes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            refered_by: {
                type: Sequelize.STRING
            },
            referral_code: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        }),
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('tbluser_referral_codes')
    }
}