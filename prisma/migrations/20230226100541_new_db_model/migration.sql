/*
  Warnings:

  - You are about to drop the column `name` on the `medic` table. All the data in the column will be lost.
  - Added the required column `herb_name` to the `medic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medic` DROP COLUMN `name`,
    ADD COLUMN `disease` VARCHAR(255) NULL,
    ADD COLUMN `herb_name` MEDIUMTEXT NOT NULL,
    ADD COLUMN `origin_loc` VARCHAR(255) NULL,
    ADD COLUMN `parts_used` VARCHAR(255) NULL,
    ADD COLUMN `recipe` MEDIUMTEXT NULL,
    ADD COLUMN `scientific_name` VARCHAR(255) NULL;
