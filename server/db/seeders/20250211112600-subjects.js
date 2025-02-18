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
      "Subjects",
      [
        {
          subjectName: "Ботаника",
          direction_id: 1,
          img: "biobotanica.jpg",
        },
        {
          subjectName: "Анатомия",
          direction_id: 1,
          img: "bioanatomy.jpg",
        },
        {
          subjectName: "Зоология",
          direction_id: 1,
          img: "boizoology.jpg",
        },
        {
          subjectName: "Гистология",
          direction_id: 1,
          img: "biologyGistologiya.jpg",
        },
        {
          subjectName: "Иммунология",
          direction_id: 1,
          img: "biologyImmunology.jpg",
        },
        {
          subjectName: "Армагедон",
          direction_id: 2,
          img: "chessArmagedon.jpg",
        },
        {
          subjectName: "Буллет",
          direction_id: 2,
          img: "chessBullet.jpg",
        },
        {
          subjectName: "Классическая партия",
          direction_id: 2,
          img: "chessClassic.jpg",
        },
        {
          subjectName: "Эндшпиль",
          direction_id: 2,
          img: "chessEndShpil.jpg",
        },
        {
          subjectName: "Гамбит",
          direction_id: 2,
          img: "chessGambit.jpg",
        },
        {
          subjectName: "Рапид",
          direction_id: 2,
          img: "chessRapid.jpg",
        },
        {
          subjectName: "История России",
          direction_id: 3,
          img: "historyRussia.jpg",
        },
        {
          subjectName: "История Запада",
          direction_id: 3,
          img: "historyWest.jpg",
        },
        {
          subjectName: "История Азии",
          direction_id: 3,
          img: "historyAzia.jpg",
        },
        {
          subjectName: "История древней Персии",
          direction_id: 3,
          img: "historyPersia.jpg",
        },
        {
          subjectName: "История Европы",
          direction_id: 3,
          img: "historyEurope.jpg",
        },
        {
          subjectName: "История древнего Египта",
          direction_id: 3,
          img: "historyEgypt.jpg",
        },
        {
          subjectName: "Мат. Анализ",
          direction_id: 4,
          img: "mathAnalize.jpg",
        },
        {
          subjectName: "Алгебра",
          direction_id: 4,
          img: "mathAlgebra.jpg",
        },
        {
          subjectName: "Геометрия",
          direction_id: 4,
          img: "mathGeometry.jpg",
        },
        {
          subjectName: "Мат. логика",
          direction_id: 4,
          img: "mathLogic.jpg",
        },
        {
          subjectName: "Теория вероятности",
          direction_id: 4,
          img: "mathProbably.jpg",
        },
        {
          subjectName: "Мат. статистика",
          direction_id: 4,
          img: "mathStatistic.jpg",
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
