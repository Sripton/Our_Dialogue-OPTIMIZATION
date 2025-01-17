"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Thumbnails",
      [
        {
          img: "chess.jpg",
          title: "chess",
        },
        {
          img: "history.jpg",
          title: "history",
        },
        {
          img: "math.jpg",
          title: "math",
        },
        {
          img: "biology.jpg",
          title: "biology",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
