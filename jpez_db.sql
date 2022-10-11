CREATE TABLE Users
(
  User_ID SERIAL PRIMARY KEY,
  Username VARCHAR(30) UNIQUE NOT NULL,
  Hash CHAR(60) NOT NULL,
  Session_Token BYTEA
);

CREATE TABLE Articles
(
  Article_ID SERIAL PRIMARY KEY,
  Publish_Date TIMESTAMP NOT NULL,
  Placement INT NOT NULL,
  Title VARCHAR(400) NOT NULL,
  Content_Path VARCHAR(200) NOT NULL
);

CREATE TABLE ReadArticles
(
  User_ID INT REFERENCES Users(UserID),
  Article_ID INT REFERENCES Articles(ArticleID)
);

CREATE TABLE ArticleStats
(
  Article_ID INT REFERENCES Articles(ArticleID),
  Kanji_Count INT,
  Kanji VARCHAR(1000)
);