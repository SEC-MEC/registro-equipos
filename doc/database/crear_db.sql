drop  DATABASE inventario;
create DATABASE inventario;

use inventario;create DATABASE inventario;

CREATE TABLE usuario (
	id INTEGER AUTO_INCREMENT,
    nombre VARCHAR (30) NOT NULL,
    apellido VARCHAR (30) NOT NULL,
    usr VARCHAR (30) NOT NULL,
    interno INTEGER,
    PRIMARY KEY (id)
);


CREATE TABLE ue (
	id INTEGER AUTO_INCREMENT,
    nombre VARCHAR (60) NOT NULL,
    nom VARCHAR (8) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE oficina (
	id INTEGER AUTO_INCREMENT,
    id_ue INTEGER NOT NULL,
    nombre VARCHAR (60) NOT NULL,
    piso INTEGER NOT NULL,
    nom VARCHAR (8) NOT NULL,
    FOREIGN KEY (id_ue) REFERENCES ue (id),
    PRIMARY KEY (id)
);



CREATE TABLE equipo (
	id INTEGER AUTO_INCREMENT,
    nombre VARCHAR (20),
    nro_serie VARCHAR (20) NOT NULL,
    id_oficina INTEGER,
    id_inventario CHAR (15),
    tipo VARCHAR (10) NOT NULL,
    observaciones TEXT,
    dominio BOOLEAN NOT NULL,
    FOREIGN KEY (id_oficina) REFERENCES oficina (id),
    PRIMARY KEY (id)
);


CREATE TABLE aplicacion (
	id INTEGER AUTO_INCREMENT,
    nombre VARCHAR (20) NOT NULL,
    version VARCHAR (10),
    PRIMARY KEY (id)
);


CREATE TABLE tecnico (
	id INTEGER AUTO_INCREMENT,
    nombre VARCHAR (20) NOT NULL,
    apellido VARCHAR (20) NOT NULL,
    usuario VARCHAR (20) NOT NULL,
    pass CHAR (60) NOT NULL,
    es_admin BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE equipo_usuario (
	id_equipo INTEGER,
    id_usuario INTEGER,
    FOREIGN KEY (id_equipo) REFERENCES equipo (id),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id),
    PRIMARY KEY (id_equipo, id_usuario)
);

CREATE TABLE equipo_app (
	id_equipo INTEGER,
    id_app INTEGER,
    FOREIGN KEY (id_equipo) REFERENCES equipo (id),
    FOREIGN KEY (id_app) REFERENCES aplicacion (id),
    PRIMARY KEY (id_equipo, id_app)
);


CREATE TABLE modificado (
	id_equipo INTEGER,
    id_tecnico INTEGER,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_equipo) REFERENCES equipo (id),
    FOREIGN KEY (id_tecnico) REFERENCES tecnico (id),
    PRIMARY KEY (id_equipo, id_tecnico)
);
