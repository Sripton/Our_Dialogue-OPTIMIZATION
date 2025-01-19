"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Directions",
      [
        {
          img: "biology.jpg",
          title: "Биология",
        },
        {
          img: "chess.jpg",
          title: "Шахматы",
        },
        {
          img: "history.jpg",
          title: "История",
        },
        {
          img: "math.jpg",
          title: "Математика",
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
