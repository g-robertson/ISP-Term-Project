CREATE TABLE Users
(
    User_ID SERIAL PRIMARY KEY,
    Username VARCHAR(30) UNIQUE NOT NULL,
    Hash CHAR(60) NOT NULL,
    Session_Token BYTEA
);

CREATE TABLE Articles
(
    Article_ID SMALLSERIAL PRIMARY KEY,
    Placement SMALLINT NOT NULL,
    Publish_Date TIMESTAMP NOT NULL,
    Title_HTML VARCHAR(400) NOT NULL,
    Title_Text VARCHAR(400) NOT NULL,
    Content_HTML VARCHAR(3000) NOT NULL,
    Content_Text VARCHAR(3000) NOT NULL,
    Content_Path VARCHAR(200) UNIQUE NOT NULL,

    UNIQUE(Publish_Date, Placement)
);

CREATE TABLE ReadArticles
(
    User_ID INT REFERENCES Users(User_ID),
    Article_ID SMALLINT REFERENCES Articles(Article_ID),
    Read_Date TIMESTAMP NOT NULL,

    PRIMARY KEY (User_ID, Article_ID)
);

CREATE TABLE ArticleKeywords
(
    Article_ID SMALLINT REFERENCES Articles(Article_ID),
    Keyword VARCHAR(20),
    First_Occurrence_In_Article SMALLINT,
    Keyword_Count SMALLINT,

    PRIMARY KEY (Article_ID, Keyword)
);
-- Common action
CREATE INDEX ON ArticleKeywords (Keyword);

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

CREATE OR REPLACE FUNCTION Article_Kanji_Stats (id INT) 
    RETURNS TABLE (
        kanji TEXT,
        amount INT
    ) 
    AS $$
    BEGIN
        RETURN QUERY SELECT 
            unnest(i.kanji) AS kanji, 
            regexp_count(content, unnest(i.kanji)) AS amount 
            FROM (
                SELECT 
                regexp_matches(content, '([一-龯])', 'g') AS kanji 
                FROM Articles WHERE article_id=id
            ) AS i, Articles WHERE article_id=id;
    END; $$ 

    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION User_Kanji_Stats (id INT) 
    RETURNS TABLE (
        kanji TEXT,
        amount INT,
        first_seen TIMESTAMP,
        last_seen TIMESTAMP
    ) 
    AS $$
    BEGIN
        RETURN QUERY SELECT 
            (article_kanji_stats).kanji, 
            COUNT((article_kanji_stats).amount)::INT, 
            MIN(Read_Date) AS first_seen, 
            MAX(Read_Date) AS last_seen 
            FROM (
                SELECT 
                article_kanji_stats(article_id) ,
                Read_Date 
                FROM ReadArticles WHERE User_ID = $1
            ) AS result GROUP BY (article_kanji_stats).kanji;
    END; $$ 

    LANGUAGE 'plpgsql';