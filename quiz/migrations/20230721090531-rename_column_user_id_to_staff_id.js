'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('tbl_quiz_notifications', 'user_id', 'staff_id');
  },

  down: (queryInterface, Sequelize) => {
    // Revert the renaming (optional)
    return queryInterface.renameColumn('your_table', 'staff_id', 'user_id');
  },
};