import requests
from bs4 import BeautifulSoup
import json

raw = requests.get("https://minecraftitemids.com/types").content
soup = BeautifulSoup(raw, 'lxml')

categories = soup.select('.card')[1:]

data = {}

for i in categories:
	name = i.select_one('.card-title').text
	description = i.select_one('p').text
	link = i.select_one('a')['href']

	data[name] = {
		"description": description,
		"items": []
	}
	
	raw = requests.get('https://minecraftitemids.com'+link).content
	soup = BeautifulSoup(raw, 'lxml')
	pages_link = soup.select('.rd-pagination__button')
	page = int(pages_link[-2].text) if pages_link else 1

	for i in range(1, page+1):
		raw = requests.get('https://minecraftitemids.com'+link+'/'+str(i)).content
		soup = BeautifulSoup(raw, 'lxml')
		items = [i.select('td') for i in soup.select("table.rd-table tr") if i.select('td')][1:]

		for image, item_name, item_id, legacy_item_id, numeral_id in items:
			image = image.select_one('img')['src'] if image.select_one('img') else None
			item_name = item_name.text.strip()
			item_id = item_id.text.strip()
			legacy_item_id = legacy_item_id.text.strip() or None
			numeral_id = numeral_id.text.strip() or None

			data[name]['items'].append({
				"image": image,
				"name": item_name,
				"item_id": item_id,
				"legacy_item_id": legacy_item_id,
				"numeral_id": numeral_id
			})

	print(name)

json.dump(data, open('results.json', 'w'), indent=4)