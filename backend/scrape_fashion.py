from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Set up Selenium WebDriver with the Service class
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Define the URL
url = "https://www.vogue.com/fashion"

# Open the page
driver.get(url)

# Wait until a specific element (like the body of the page) is loaded
try:
    element_present = EC.presence_of_element_located((By.TAG_NAME, 'body'))  # Wait for body tag
    WebDriverWait(driver, 10).until(element_present)
    print("Page is fully loaded")
except TimeoutException:
    print("Timed out waiting for page to load")

# Get the page source after JavaScript has rendered the content
page_source = driver.page_source

# Now, parse the page with BeautifulSoup
soup = BeautifulSoup(page_source, "html.parser")

# Find all the articles or posts related to fashion trends
articles = soup.find_all("article")

# Loop through the articles and print their titles and links
for article in articles:
    # Find the title of the article
    title = article.find("h2")
    if title:
        print(title.get_text())  # Print the title of the article

    # Find the link to the article
    link = article.find("a", href=True)
    if link:
        print(f"Link: {link['href']}")  # Print the link to the full article

    print()  # Empty line between articles

# Close the browser
driver.quit()
