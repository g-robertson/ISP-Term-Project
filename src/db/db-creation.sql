CREATE TABLE Users
(
    User_ID SERIAL PRIMARY KEY,
    Username VARCHAR(30) UNIQUE NOT NULL,
    Hash CHAR(60) NOT NULL,
    Session_Token CHAR(128)
);

CREATE TABLE Articles
(
    Article_ID SMALLSERIAL PRIMARY KEY,
    Publish_Date TIMESTAMP NOT NULL,
    Placement SMALLINT NOT NULL,
    Title VARCHAR(400) NOT NULL,
    Content_Path VARCHAR(200) UNIQUE NOT NULL,
    Content_Length INT NOT NULL,
    
    UNIQUE(Publish_Date, Placement)
);

CREATE TABLE ReadArticles
(
    User_ID INT REFERENCES Users(User_ID),
    Article_ID SMALLINT REFERENCES Articles(Article_ID),

    PRIMARY KEY (User_ID, Article_ID)
);

CREATE TABLE ArticleKeywords
(
    Article_ID SMALLINT REFERENCES Articles(Article_ID),
    Keyword VARCHAR(20),
    Keyword_Count SMALLINT,

    PRIMARY KEY (Article_ID, Keyword)
);

CREATE TABLE ArticleKeywordsOfLength
(
    Article_ID SMALLINT REFERENCES Articles(Article_ID),
    Keyword_Length INT,
    Keywords_Count INT,

    PRIMARY KEY (Article_ID, Keyword_Length)
);

CREATE FUNCTION Sum_Keywords() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO ArticleKeywordsOfLength(Article_ID, Keyword_Length, Keywords_Count)
            VALUES(NEW.Article_ID, LENGTH(NEW.Keyword), 0) ON CONFLICT DO NOTHING;

        UPDATE ArticleKeywordsOfLength
            SET Keywords_Count = NEW.Keyword_Count + Keywords_Count
            WHERE Article_ID = NEW.Article_ID AND Keyword_Length = LENGTH(NEW.Keyword);
        
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER ArticleKeywordInsertion
    AFTER INSERT ON ArticleKeywords
    FOR EACH ROW
    EXECUTE FUNCTION Sum_Keywords();

CREATE FUNCTION Unsum_Keywords() RETURNS TRIGGER AS $$
    BEGIN
        UPDATE ArticleKeywordsOfLength
            SET Keywords_Count = Keywords_Count - OLD.Keyword_Count
            WHERE Article_ID = OLD.Article_ID AND Keyword_Length = LENGTH(OLD.Keyword);

        RETURN OLD;
    END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER ArticleKeywordDeletion
    AFTER DELETE ON ArticleKeywords
    FOR EACH ROW
    EXECUTE FUNCTION Unsum_Keywords();