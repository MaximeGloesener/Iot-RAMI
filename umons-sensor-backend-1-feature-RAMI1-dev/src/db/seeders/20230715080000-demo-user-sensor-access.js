"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserSensorAccesses",
      [
        {
          id: "d4dc4dd0-c3ee-4032-a89e-c8cd28207a4b",
          userId: "4b14739b-db02-40d0-a0cd-f28e073a0814",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T08:50:00.937Z"),
        },
        {
          id: "847ace20-2d6b-44e1-addb-218c34edc170",
          userId: "4b14739b-db02-40d0-a0cd-f28e073a0815",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T09:00:00.937Z"),
        },
        {
          id: "6c307107-e421-4c9e-a427-106fecd0023f",
          userId: "ced447da-d99e-4600-8027-cfc5f514d424",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T09:20:00.937Z"),
        },
        {
          id: "fd9272ab-3745-422f-96ac-33566211a156",
          userId: "ced447da-d99e-4600-8027-cfc5f514d424",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T09:30:00.937Z"),
        },
        {
          id: "b08af2b0-63b4-4ae7-b231-04c3da1342e2",
          userId: "fcb85da0-df54-47cd-8507-68e44546b411",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T09:40:00.937Z"),
        },
        {
          id: "a398b1e7-9258-4a56-a3b2-db273c185f3a",
          userId: "fcb85da0-df54-47cd-8507-68e44546b411",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T09:50:00.937Z"),
        },
        {
          id: "35114d9c-17e3-43f1-85e5-701517aadb8b",
          userId: "71b4f518-fabd-4ad9-8695-2a3ed5b25ef8",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T10:00:00.937Z"),
        },
        {
          id: "8bd72bce-f9c2-41c6-b84e-f0e54044b212",
          userId: "9571b671-3dd0-4270-8c11-b67ad376f687",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T10:30:00.937Z"),
        },
        {
          id: "668b0a85-9f82-456e-90f6-eb7bdb047725",
          userId: "71b4f518-fabd-4ad9-8695-2a3ed5b26ef8",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T10:40:00.937Z"),
        },
        {
          id: "ace5b8aa-85b6-459d-848d-7710596e416c",
          userId: "71b4f518-fabd-4ad9-8695-2b3ed5b25ef8",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T11:10:00.937Z"),
        },
        {
          id: "f95048e7-cb33-47fa-bacc-970962bcf183",
          userId: "71b4f518-fabd-4ae9-8695-2a3ed5b25ef8",
          sensorId: "b978833e-97e1-4e6f-886e-2704d856349a",
          status: "accepted",
          createdAt: new Date("2024-06-30T11:30:00.937Z"),
        },
        {
          id: "f9f136a0-37d2-4950-8e66-9dc15c989bf0",
          userId: "71b4f518-fabd-4ae9-8695-2a3ed5b25ef8",
          sensorId: "2b8aa6f7-ece8-43cf-a09e-0a41547029fa",
          status: "accepted",
          createdAt: new Date("2024-06-30T11:40:00.937Z"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserSensorAccesses", null, {});
  },
};
