module.exports = (sequelize, Sequelize) => {
    const RolePermissions = sequelize.define(
        "tblrole_permissions",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            role_id: {
                type: Sequelize.INTEGER
            },
            permission_id: {
                type: Sequelize.INTEGER
            },
            can_view: {
                type: Sequelize.BOOLEAN
            },
            can_view_own: {
                type: Sequelize.BOOLEAN
            },
            can_edit: {
                type: Sequelize.BOOLEAN
            },
            can_create: {
                type: Sequelize.BOOLEAN
            },
            can_delete: {
                type: Sequelize.BOOLEAN
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
        tableName: "tblrole_permissions"
    });
    return RolePermissions
}