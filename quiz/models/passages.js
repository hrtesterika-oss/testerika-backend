module.exports = (sequelize, Sequelize) => {
    const Passage = sequelize.define(
        "tbl_passage",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            passage_bank_id:{
                type: Sequelize.INTEGER,
            },
            language:{
               type:Sequelize.STRING
            },
            passage: {
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
        tableName: "tbl_passage"
    });
    return Passage
}