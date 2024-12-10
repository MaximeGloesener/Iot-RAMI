"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserSensorRequests",
      [
        {
          id: "1a5e7b6f-43ce-4b5a-8ae3-1f9a1d0c9a5a",
          userId: "72b4f518-fabd-4ad9-8695-2a3ed5b25ef8",
          sensorName: "pysimulator-esp32-ecg",
          status: "accepted",
          createdAt: "2024-06-30T08:00:00.937Z",
        },
        {
          id: "3c9e7d4a-1f3d-4f69-9b57-1e8b0d4d6a5b",
          userId: "72b4f518-fabd-4ad9-8695-2a3ed5b25ef8",
          sensorName: "pysimulator-lora-bpm",
          status: "accepted",
          createdAt: "2024-06-30T08:10:00.937Z",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserSensorRequests", null, {});
  },
};
