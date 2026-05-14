module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define(
        "tblbook",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            hash: {
                type: Sequelize.STRING,
                unique: true
            },
            image: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING
            },
            book_pdf: {
                type: Sequelize.STRING
            },
            new_release: {
                type: Sequelize.BOOLEAN
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1
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
        tableName: "tblbook"
    });
    return Books
}