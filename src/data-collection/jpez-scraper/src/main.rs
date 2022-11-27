use std::thread;
use std::fs;
use std::env;
use std::path::Path;
use chrono::{Datelike, Duration, TimeZone, Utc};
use reqwest::blocking::Client;

// Remove tags from given string
fn scrub(content: String) -> String {
    use regex::Regex;
    let soundings = Regex::new(r"<rt>.*?</rt>").unwrap();
    let tags = Regex::new(r"<.*?>").unwrap();

    let soundless = soundings.replace_all(&content, "").to_string();
    return tags.replace_all(&soundless, "").to_string();
}

fn main() {
    println!("Enter number of desired threads: ");
    let mut thread_input = String::new();
    std::io::stdin()
        .read_line(&mut thread_input)
        .expect("failed to read from stdin");

    let mut thread_count = 1;

    let trimmed = thread_input.trim();
    match trimmed.parse::<u32>() {
        Ok(i) => thread_count = i as i64,
        Err(..) => println!("Invalid input: {}. Continuing with 1 thread.", trimmed),
    };

    println!("Enter the number of days to scrape (0 for maximum days): ");
    let mut day_input = String::new();
    std::io::stdin()
        .read_line(&mut day_input)
        .expect("failed to read from stdin");

    let mut day_limit: i64 = 0;

    let day_trimmed = day_input.trim();
    match day_trimmed.parse::<i64>() {
        Ok(i) => day_limit = i as i64,
        Err(..) => println!("Invalid input: {}. Continuing with maximum days.", day_trimmed),
    };

    println!("Enter path to store article files: ");
    let mut path_input = String::new();
    std::io::stdin()
        .read_line(&mut path_input)
        .expect("failed to read from stdin");

    let path_input_trimmed = path_input.trim();
    let path = Path::new(&path_input_trimmed);
    if !path.exists() {
        println!("Path does not exist. Writing to articles folder in this directory.");
        let result = fs::create_dir_all("./articles");
        match result {
            Ok(()) => println!("Default file path created. Continuing..."),
            Err(..) => println!("Unexpected file error."),
        };
        assert!(env::set_current_dir("./articles").is_ok());
    } else {
        assert!(env::set_current_dir(&path).is_ok());
    }

    println!("Check for already scraped articles? (y/n): ");
    let mut check_input = String::new();
    std::io::stdin()
        .read_line(&mut check_input)
        .expect("failed to read from stdin");

    let check_input_trimmed = check_input.trim();

    let check = check_input_trimmed == "y";

    let mut threads = Vec::new();

    for i in 0..thread_count {
        let date_start = Utc.ymd(2017, 1, 4);
        let mut days = Utc::now().date()
            .signed_duration_since(date_start)
            .num_days();

        if day_limit != 0 && day_limit < days {
            days = day_limit;
        }

        let thread = thread::spawn(move || {
            let start_day = ((days + (thread_count - 1)) / thread_count) * i;
            let mut end_day = ((days + (thread_count - 1)) / thread_count) * (i + 1);
            if end_day > days {
                end_day = days;
            }
            let client = Client::new();
            for day in start_day..end_day {
                let current_day = date_start + Duration::days(day);
                if ["Sun", "Sat"].contains(&current_day.weekday().to_string().as_str()) {
                    println!("No articles on weekends! Thread {} skipping {}...", i, current_day);
                    continue;
                }
                let article_url = format!("{:0>4}/{:0>2}/{:0>2}", current_day.year(), current_day.month(), current_day.day());

                if check {
                    let mut is_obtained = false;
                    let obtained_articles = fs::read_dir(".").unwrap();

                    for obtained in obtained_articles {
                        if format!("{}{}", current_day, 1) == obtained.unwrap().path().to_string_lossy().replace("./", "") {
                            is_obtained = true;
                            break;
                        }
                    }

                    if is_obtained {
                        println!("Articles for {} already gathered. Thread {} continuing!", current_day, i);
                        continue;
                    }
                }

                let mut response_result = String::from("");

                // Collect webpage data
                println!("Thread {} collecting date {}...", i, article_url);
                let mut timed_out = true;
                let mut timed_out_count = 0;
                while timed_out && timed_out_count < 5{
                    timed_out = false;
                    let response = client.get(format!("https://nhkeasier.com/{}", article_url)).send();
                    if let Err(e) = response {
                        if e.is_timeout() {
                            timed_out = true;
                            timed_out_count += 1;
                        }
                    } else {
                        response_result = response
                        .unwrap()
                        .text()
                        .unwrap();
                    }
                }
                println!("Thread {} successfully collected date {}!", i, article_url);

                thread::sleep(std::time::Duration::from_millis(2000));

                // Parse webpage into HTML
                let document = scraper::Html::parse_document(&response_result);

                // Grab each article on the page
                let article_selector = scraper::Selector::parse("article").unwrap();
                let articles = document.select(&article_selector).map(|x| x.inner_html()).zip(1..10);

                // Collect information from article
                for (article, number) in articles {
                    // let mut article_entry: String = number.to_string();
                    // article_entry.push_str("!!DELIMITER!!");
                    // // Parse article as HTML
                    // let article_html = scraper::Html::parse_document(&article);

                    // // Collect title
                    // let title_selector = scraper::Selector::parse("h3").unwrap();
                    // let title: String = article_html.select(&title_selector).map(|x| x.inner_html()).collect();
                    // article_entry.push_str(&scrub(title));
                    // article_entry.push_str("!!DELIMITER!!");

                    // // Collect time
                    // let time_selector = scraper::Selector::parse("time").unwrap();
                    // let time: String = article_html.select(&time_selector).map(|x| x.inner_html()).collect();
                    // article_entry.push_str(&scrub(time.replace(" +0900 (JST)", "")));
                    // article_entry.push_str("!!DELIMITER!!");

                    // // Collect contents
                    // let paragraph_selector = scraper::Selector::parse("p, img").unwrap();
                    // let paragraphs = article_html.select(&paragraph_selector);
                    // paragraphs
                    // .zip(1..10)
                    // .for_each(|(item, _number)|
                    //     if item.inner_html() == "" {
                    //         let src = item.value().attr("src").unwrap();
                    //         if src.starts_with("http") {
                    //             article_entry.push_str("<img src=\">");
                    //             article_entry.push_str(&scrub(src.to_string()));
                    //             article_entry.push_str("\">");
                    //         } else {
                    //             article_entry.push_str("<img src=\"https://nhkeasier.com/");
                    //             article_entry.push_str(&scrub(src.to_string()));
                    //             article_entry.push_str("\">");
                    //         }
                    //     } else {
                    //         article_entry.push_str("<p>");
                    //         article_entry.push_str(&scrub(item.inner_html()));
                    //         article_entry.push_str("</p>");
                    //     }
                    // );
                    fs::write(format!("./{}{}", current_day, number), article).expect("Unable to write file");
                }
            }
        });
        threads.push(thread);
    }

    for handle in threads {
        handle.join().unwrap();
    }
}
