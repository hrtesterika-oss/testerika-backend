'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tbl_quiz_notifications', 'quiz_id', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    // Revert the addition (optional)
    return queryInterface.removeColumn('tbl_quiz_notifications', 'quiz_id');
  },
};

