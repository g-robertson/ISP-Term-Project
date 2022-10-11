CREATE TABLE Users
(
    User_ID SERIAL PRIMARY KEY,
    Username VARCHAR(30) UNIQUE NOT NULL,
    Hash CHAR(60) NOT NULL,
    Session_Token CHAR(128)
);

CREATE TABLE Articles
(
    Article_ID SMALLINT PRIMARY KEY,
    Publish_Date TIMESTAMP NOT NULL,
    Placement INT NOT NULL,
    Title VARCHAR(400) NOT NULL,
    Content_Path VARCHAR(200) NOT NULL
);

CREATE TABLE ReadArticles
(
    User_ID INT REFERENCES Users(User_ID),
    Article_ID SMALLINT REFERENCES Articles(Article_ID)
);

CREATE TABLE ArticleKeywords
(
    Article_ID SMALLINT REFERENCES Articles(Article_ID),
    Keyword VARCHAR(20),
    Keyword_Count SMALLINT
);