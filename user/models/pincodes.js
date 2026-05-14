module.exports = (sequelize, Sequelize) => {
    const Pincodes = sequelize.define(
        "tblpincodes",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            officename: {
                type: Sequelize.STRING
            },
            pincode: {
                type: Sequelize.STRING
            },
            officeType: {
                type: Sequelize.STRING
            },
            Deliverystatus: {
                type: Sequelize.STRING
            },
            divisionname: {
                type: Sequelize.STRING
            },
            regionname: {
                type: Sequelize.STRING
            },
            circlename: {
                type: Sequelize.STRING
            },
            Taluk: {
                type: Sequelize.STRING
            },
            Districtname: {
                type: Sequelize.STRING
            },
            statename: {
                type: Sequelize.STRING
            },
            Telephone: {
                type: Sequelize.STRING
            },
            Related_Suboffice: {
                type: Sequelize.STRING
            },
            Related_Headoffice: {
                type: Sequelize.STRING
            },
            longitude: {
                type: Sequelize.STRING
            },
            latitude: {
                type: Sequelize.STRING
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        }, {
        tableName: "tblpincodes"
    });
    return Pincodes
}