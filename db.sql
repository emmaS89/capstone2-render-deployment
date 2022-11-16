DROP DATABASE IF EXISTS  event_management;

CREATE DATABASE event_management;

\c event_management



-- CREATE DATABASE event_management;
CREATE TABLE users (
	id serial primary key,
    firstname text NULL,
    lastname text  NULL,
    email text NOT NULL,
    pswd text NOT NULL,
    createdAt timestamp NOT NULL DEFAULT NOW(),
	updatedAt timestamp NOT NULL DEFAULT NOW()
);


CREATE TABLE cities (
	id serial primary key,
    name text NULL,
    country text  NULL,
    createdAt timestamp NOT NULL DEFAULT NOW(),
	updatedAt timestamp NOT NULL DEFAULT NOW()
);


CREATE TABLE events (
	id serial primary key,
    title text NULL,
	startDate timestamp NULL,
	endDate timestamp NULL,
    description text  NULL,
	organizerName text  NULL,
	contactNo text  NULL,
	address text  NULL,
	latitude text NULL,
	longitude text NULL,
	city int null,
    createdAt timestamp NOT NULL DEFAULT NOW(),
	updatedAt timestamp NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_city
      FOREIGN KEY(city) 
	  REFERENCES cities(id)
);

ALTER TABLE events
ADD COLUMN userId int NULL;