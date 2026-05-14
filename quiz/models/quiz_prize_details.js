module.exports = (sequelize, Sequelize) => {
    const QuizPrizeDetails = sequelize.define(
        "tblquiz_prize_details",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            quiz_id: {
                type: Sequelize.INTEGER
            },
            total_spots: {
                type: Sequelize.INTEGER
            },
            entry_fee: {
                type: Sequelize.DECIMAL
            },
            entry_fee_algo: {
                type: Sequelize.DECIMAL
            },
            prize_pool: {
                type: Sequelize.DECIMAL
            },
            first_prize: {
                type: Sequelize.DECIMAL
            },
            total_winner_percentage: {
                type: Sequelize.INTEGER
            },
            prize_distribution_percentage: {
                type: Sequelize.DECIMAL
            },
            prize_algo_id: {
                type: Sequelize.INTEGER
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
        tableName: "tblquiz_prize_details"
    });
    return QuizPrizeDetails
}