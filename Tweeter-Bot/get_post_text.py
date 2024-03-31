from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def get_post_text(tweet_id):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1420,1080')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--disable-extensions')

    # Using ChromeDriverManager to automatically manage the driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    tweet_url = f"https://twitter.com/i/web/status/{tweet_id}"
    driver.get(tweet_url)

    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//div[@data-testid="tweetText"]'))
        )
        tweet_content = element.text
    except Exception as e:
        print("An error occurred:", e)
        tweet_content = ""  # Return empty string or handle error as needed

    driver.quit()
    return tweet_content
