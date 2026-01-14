module.exports = (sequelize, Sequelize) => {
    const PassageBank = sequelize.define(
        "tbl_passage_bank",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            passage_english: {
                type: Sequelize.TEXT
            },
            status:{
                type: Sequelize.INTEGER,
                defaultValue:1
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
        }, {
        tableName: "tbl_passage_bank"
    });
    return PassageBank
}