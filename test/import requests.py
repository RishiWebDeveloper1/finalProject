import requests
from bs4 import BeautifulSoup
import csv

# URL of the eBay page
url = "https://www.ebay.com/sch/i.html?_dkr=1&iconV2Request=true&_blrs=recall_filtering&_ssn=jpm8282&store_cat=0&store_name=jpm8282&_oac=1&_ipg=240"

# Send a GET request to fetch the HTML content
response = requests.get(url)
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all items in the search result
    items = soup.find_all('li', {'class': 's-item'})  # Adjust the class name based on the HTML structure

    # Prepare the data to be saved in CSV
    data = []
    for item in items:
        # Extract the name (title) of the item
        name = item.find('h3', {'class': 's-item__title'})
        if name:
            name = name.text.strip()

        # Extract the URL of the item
        item_url = item.find('a', {'class': 's-item__link'})
        if item_url:
            item_url = item_url.get('href')

        # Extract the price of the item
        price = item.find('span', {'class': 's-item__price'})
        if price:
            price = price.text.strip()

        # Append the extracted details to the data list
        data.append([name, item_url, price])

    # Save the extracted data into a CSV file
    with open('ebay_items.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # Write the header row
        writer.writerow(['Name', 'URL', 'Price'])
        # Write the data rows
        writer.writerows(data)

    print("Data has been saved to ebay_items.csv")
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
