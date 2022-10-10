CREATE TABLE Users
(
  UserID SERIAL PRIMARY KEY,
  Username VARCHAR(30) UNIQUE NOT NULL,
  Hash CHAR(60) NOT NULL,
  SessionToken BYTEA
);

CREATE TABLE Articles
(
  ArticleID SERIAL PRIMARY KEY,
  Stamp TIMESTAMP NOT NULL,
  Placement INT NOT NULL,
  Title VARCHAR(400) NOT NULL,
  ContentPath VARCHAR(200) NOT NULL
);

CREATE TABLE ReadArticles
(
  UserID INT REFERENCES Users(UserID),
  ArticleID INT REFERENCES Articles(ArticleID)
);

CREATE TABLE ArticleStats
(
  ArticleID INT REFERENCES Articles(ArticleID),
  KanjiCount INT,
  Kanji VARCHAR(1000)
);