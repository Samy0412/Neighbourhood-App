Begin;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- this allows us to encrypt passwords in psql using 
-- crypt('password', gen_salt('bf'))

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS neighbourhoods CASCADE;

CREATE TABLE neighbourhoods (
 id SERIAL PRIMARY KEY NOT NULL,
 name VARCHAR(55) NOT NULL,
 time_created TIMESTAMPTZ NOT NULL DEFAULT now(),
 coordinates POINT NOT NULL,
 SW POINT NOT NULL,
 SE POINT NOT NULL,
 NE POINT NOT NULL,
 NW POINT NOT NULL,
 neighbourhood_photo VARCHAR(255) DEFAULT 'https://i.imgur.com/j6IJGS2.png'
 
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  neighbourhood_id INTEGER REFERENCES neighbourhoods(id) ON DELETE CASCADE,
  email VARCHAR(55) NOT NULL,
  password TEXT NOT NULL,
  time_created TIMESTAMPTZ DEFAULT now(),
  coordinates POINT,
  first_name VARCHAR(55) NOT NULL,
  last_name VARCHAR(55) NOT NULL,
  phone_number VARCHAR(11),
  profile_photo VARCHAR(255) DEFAULT 'https://i.imgur.com/H9g7VHP.png',
  last_logout TIMESTAMPTZ,
  bio TEXT DEFAULT 'I have yet to write a bio :)'
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(55) NOT NULL,
  category_type TEXT NOT NULL
);

-- do all events require coordinates?? NOT NULL ???
CREATE TABLE events (
 id SERIAL PRIMARY KEY NOT NULL,
 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
 category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
 neighbourhood_id INTEGER REFERENCES neighbourhoods(id) ON DELETE CASCADE NOT NULL,
 title VARCHAR(55) NOT NULL,
 coordinates POINT,
 time_created TIMESTAMPTZ NOT NULL DEFAULT now(),
 description TEXT NOT NULL,
 event_start DATE,
 event_time TIME,
 event_photo TEXT DEFAULT 'https://i.imgur.com/j6IJGS2.png'
);

-- do all alerts have locations/coordinates?
CREATE TABLE alerts (
 id SERIAL PRIMARY KEY NOT NULL,
 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
 category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
 neighbourhood_id INTEGER REFERENCES neighbourhoods(id) ON DELETE CASCADE NOT NULL,
 title VARCHAR(55) NOT NULL,
 coordinates POINT,
 time_created TIMESTAMPTZ NOT NULL DEFAULT now(),
 description TEXT NOT NULL,
 alert_photo VARCHAR(255) DEFAULT 'https://i.imgur.com/j6IJGS2.png'
);

-- location??? all of them??
CREATE TABLE services (
 id SERIAL PRIMARY KEY NOT NULL,
 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
 category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
 neighbourhood_id INTEGER REFERENCES neighbourhoods(id) ON DELETE CASCADE NOT NULL,
 service_offer BOOLEAN NOT NULL,
 title VARCHAR(55) NOT NULL,
 coordinates POINT,
 time_created TIMESTAMPTZ NOT NULL DEFAULT now(),
 description TEXT NOT NULL,
 service_photo VARCHAR(255) DEFAULT 'https://i.imgur.com/j6IJGS2.png'
  
);

CREATE TABLE subscriptions (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, category_id)
);

-- when creating conversations, we can determine who is user_one and who is user_two by assignning the user with the LOWER ID number to user_one.
-- This should prevent accidentally creating two separate conversations for the same two users.
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY NOT NULL,
  user_one INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_two INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT,
  time_sent TIMESTAMPTZ DEFAULT now()
);

Commit;

