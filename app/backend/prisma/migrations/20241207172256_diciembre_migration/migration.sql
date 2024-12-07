-- CreateTable
CREATE TABLE `aplicacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NOT NULL,
    `version` VARCHAR(10) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NULL,
    `nro_serie` VARCHAR(20) NOT NULL DEFAULT 'No S/N',
    `id_oficina` INTEGER NULL,
    `id_inventario` CHAR(15) NULL,
    `tipo` VARCHAR(10) NOT NULL,
    `observaciones` TEXT NULL,
    `dominio` BOOLEAN NOT NULL DEFAULT true,

    INDEX `id_oficina`(`id_oficina`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipo_app` (
    `id_equipo` INTEGER NOT NULL,
    `id_app` INTEGER NOT NULL,

    INDEX `id_app`(`id_app`),
    PRIMARY KEY (`id_equipo`, `id_app`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipo_usuario` (
    `id_equipo` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_equipo`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modificado` (
    `id_equipo` INTEGER NOT NULL,
    `id_tecnico` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,

    INDEX `id_tecnico`(`id_tecnico`),
    PRIMARY KEY (`id_equipo`, `id_tecnico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oficina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ue` INTEGER NOT NULL,
    `nombre` VARCHAR(60) NOT NULL,
    `piso` INTEGER NOT NULL,
    `nom` VARCHAR(8) NOT NULL,

    INDEX `id_ue`(`id_ue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NOT NULL,
    `apellido` VARCHAR(20) NOT NULL,
    `usuario` VARCHAR(20) NOT NULL,
    `pass` CHAR(60) NOT NULL,
    `es_admin` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `nom` VARCHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `apellido` VARCHAR(30) NOT NULL,
    `usr` VARCHAR(30) NOT NULL,
    `interno` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vista` (
    `id_equipo` INTEGER NOT NULL,
    `nombre_pc` VARCHAR(191) NOT NULL,
    `nro_serie` VARCHAR(191) NOT NULL,
    `id_inventario` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `oficina` VARCHAR(191) NOT NULL,
    `piso` INTEGER NOT NULL,
    `UE` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `dominio` BOOLEAN NOT NULL,
    `last_update` DATETIME(3) NULL,
    `Tecnico` VARCHAR(191) NULL,
    `Usuario` VARCHAR(191) NULL,

    PRIMARY KEY (`id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipo` ADD CONSTRAINT `equipo_ibfk_1` FOREIGN KEY (`id_oficina`) REFERENCES `oficina`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `equipo_app` ADD CONSTRAINT `equipo_app_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipo`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `equipo_app` ADD CONSTRAINT `equipo_app_ibfk_2` FOREIGN KEY (`id_app`) REFERENCES `aplicacion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `equipo_usuario` ADD CONSTRAINT `equipo_usuario_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipo`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `equipo_usuario` ADD CONSTRAINT `equipo_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `modificado` ADD CONSTRAINT `modificado_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipo`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `modificado` ADD CONSTRAINT `modificado_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnico`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oficina` ADD CONSTRAINT `oficina_ibfk_1` FOREIGN KEY (`id_ue`) REFERENCES `ue`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
