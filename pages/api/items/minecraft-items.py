import requests
from bs4 import BeautifulSoup
import json

data = []

raw = requests.get('https://minecraftitemids.com').content
soup = BeautifulSoup(raw, 'lxml')
pages_link = soup.select('.rd-pagination__button')
page = int(pages_link[-2].text) if pages_link else 1

data = []

for i in range(1, page+1):
	raw = requests.get('https://minecraftitemids.com/'+str(i)).content
	soup = BeautifulSoup(raw, 'lxml')
	items = [i.select('td') for i in soup.select("table.rd-table tr") if i.select('td')]

	for image, item_name, item_id, legacy_item_id, numeral_id in items:
		image = image.select_one('img')['src'] if image.select_one('img') else None
		item_name = item_name.text.strip()
		item_id = item_id.text.strip()
		legacy_item_id = legacy_item_id.text.strip() or None
		numeral_id = numeral_id.text.strip() or None

		data.append({
			"image": image,
			"name": item_name,
			"item_id": item_id,
			"legacy_item_id": legacy_item_id,
			"numeral_id": numeral_id
		})
	print(i)

open('minecraft-items.json', 'w').write(json.dumps(data, indent=4))