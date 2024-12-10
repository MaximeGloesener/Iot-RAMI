"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        // ---------------------- ADMIN
        {
          id: "92dce105-f962-4ab7-9581-b693064f1778",
          email: "adriano@ig.umons.ac.be",
          password: "$2b$10$E8gcWD.v0dmNVT1Lgg5o.Oijop1yp9YPImkUU0ggP9iHMWmJzdPLG",
          role: "admin",
          firstName: "Adriano",
          lastName: "Doe",
          dateOfBirth: new Date("1980-01-01"),
          sex: "male",
        },
        {
          id: "72b4f518-fabd-4ad9-8695-2a3ed5b25ef8",
          email: "cyril@ig.umons.ac.be",
          password: "$2b$10$RTQPoiGl.h3IHxvmY7FJTOwVsYHFeLK07oDCDGvlzaAqfgfsCpHYW",
          role: "admin",
          firstName: "cyril",
          lastName: "clovis",
          dateOfBirth: new Date("2002-11-06"),
          sex: "male",
        },
        // ---------------------- PRIVILEGED
        {
          id: "4b14739b-db02-40d0-a0cd-f28e073a0814",
          email: "said@ig.umons.ac.be",
          password: "$2b$10$3mTU/DlN.SkXh0ylysEoDO7lzgDOHP/38lzk1lvB.tamgNWiNwoeW",
          role: "privileged",
          firstName: "Said",
          lastName: "Smith",
          dateOfBirth: new Date("1990-02-02"),
          sex: "male",
        },
        {
          id: "4b14739b-db02-40d0-a0cd-f28e073a0815",
          email: "sidi@ig.umons.ac.be",
          password: "$2b$10$iOMBevu2Cwn6tYau/TJMn.cdy4rAO7kfZHzl6m2hDuXHuaOiK8QJ2",
          role: "privileged",
          firstName: "Sidi",
          lastName: "Johnson",
          dateOfBirth: new Date("1992-03-03"),
          sex: "male",
        },
        {
          id: "ced447da-d99e-4600-8027-cfc5f514d424",
          email: "lilian@ig.umons.ac.be",
          password: "$2b$10$vpTylK6QGpqCyoGUE2tReuvvrnJ/TIHQNJyAd8r1SE8gzw1vS4zJa",
          role: "privileged",
          firstName: "Lilian",
          lastName: "Brown",
          dateOfBirth: new Date("1993-04-04"),
          sex: "female",
        },
        // ---------------------- REGULAR
        {
          id: "fcb85da0-df54-47cd-8507-68e44546b411",
          email: "thomas@ig.umons.ac.be",
          password: "$2b$10$.7Biv8YU.ya5Ktdw8ZeIBO7aRzKRlZ1bXQbXl1GoiPlAnqXslY2J.",
          role: "regular",
          firstName: "Thomas",
          lastName: "Taylor",
          dateOfBirth: new Date("1994-05-05"),
          sex: "male",
        },
        {
          id: "71b4f518-fabd-4ad9-8695-2a3ed5b25ef8",
          email: "mathis@ig.umons.ac.be",
          password: "$2b$10$g7srTmBHgDrnpzHwyB/aHeyzkmKWOgGoLsDtogtv0TijlsHFtn1SC",
          role: "regular",
          firstName: "Mathis",
          lastName: "Davis",
          dateOfBirth: new Date("1995-06-06"),
          sex: "male",
        },
        {
          id: "9571b671-3dd0-4270-8c11-b67ad376f687",
          email: "amine@ig.umons.ac.be",
          password: "$2b$10$AT5KR1goNDh8YGb0uHt3AO2BtPq1eh2GRkw8z9kxrXBOso0iAvQvW",
          role: "regular",
          firstName: "Amine",
          lastName: "Miller",
          dateOfBirth: new Date("1996-07-07"),
          sex: "male",
        },
        {
          id: "71b4f518-fabd-4ad9-8695-2a3ed5b26ef8",
          email: "aurelie@ig.umons.ac.be",
          password: "$2b$10$6AvXpoUN3ail7TcVWIi7..SxDjyrDKuGKgAy/2KHl2Vhtmo7RSB8q",
          role: "regular",
          firstName: "Aurelie",
          lastName: "Wilson",
          dateOfBirth: new Date("1997-08-08"),
          sex: "female",
        },
        {
          id: "71b4f518-fabd-4ad9-8695-2b3ed5b25ef8",
          email: "rabie@ig.umons.ac.be",
          password: "$2b$10$mAvPADvxC0h7J9B/9nWzDudHLG4fuwm1p2Nadip6FhxLfUD6Bz9JK",
          role: "regular",
          firstName: "Rabie",
          lastName: "Moore",
          dateOfBirth: new Date("1998-09-09"),
          sex: "male",
        },
        {
          id: "71b4f518-fabd-4ae9-8695-2a3ed5b25ef8",
          email: "nourredine@ig.umons.ac.be",
          password: "$2b$10$0ccNxkLP.mted6Wnns9t8ehfTubH9eKYW2hyK5yFvPPbj4rLDreBi",
          role: "regular",
          firstName: "Nourredine",
          lastName: "Thomas",
          dateOfBirth: new Date("1999-10-10"),
          sex: "male",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
