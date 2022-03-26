import json
from numpy import block
import requests
from bs4 import BeautifulSoup as bs

data = json.load(open('minecraft-items.json'))
details = {}

for index, i in enumerate([i['name'].lower().replace(' ', '-') for i in data]):
  raw = requests.get('https://minecraftitemids.com/item/' + i).text
  soup = bs(raw, 'lxml')
  
  try: description = soup.select_one('.text-center p, p.text-center').text
  except: description = ''
  if soup.select('.item-infobox ~ table'):
    properties = dict([[i.text for i in i.select('th, td')] for i in soup.select('.item-infobox ~ table tr')])
  else: properties = {}

  if 'Item ID' in properties: del properties['Item ID']
  if 'Legacy Item ID (1.12.2 and Below)' in properties: del properties['Legacy Item ID (1.12.2 and Below)']
  if 'Numerical ID' in properties: del properties['Numerical ID']
  
  c = [i for i in soup.select('.card__header') if i.text.strip() == 'Mining Tools']
  if c:
    mining = dict([[i.text for i in i.select('td') if i.text] for i in c[0].findNextSibling('div').select('table tr')[1:]])
  else:
    mining = {}

  crafting = soup.select_one('.crafting-table-table')
  recipies = []

  if crafting:
    crafting = [i.select('td') for i in crafting.select('tr')[1:]]
    for incridient, pattern, result in crafting:
      ingridient = [i.text.split('x ', 1) for i in incridient.select('li')]
      ingridient = {i[1]: int(i[0]) for i in ingridient}

      pattern = [i.select_one('img')['src'].split('.')[0].split('/')[-1] if i.select_one('img') else '' for i in pattern.select('.crafting-table > div')]
      
      result = result.text.split('x ', 1)
      result = {result[1]: int(result[0])}

      recipies.append({'ingridient': ingridient, 'pattern': pattern, 'result': result})

  s = [i for i in soup.select('.card__header') if 'Block States' in i.text.strip()]
  blockstates = {}
  if s:
    blockstates_raw = [i.select('td') for i in s[0].findNextSibling('div').select('table tr')[1:]]
    for name, _type, values in blockstates_raw:
      values = [i.text for i in values.select('li')]
      blockstates[name.text.strip()] = {'type': _type.text.rsplit('?')[0].strip(), 'values': values}

  details[i] = {
    'description': description,
    'properties': properties,
    'mining': mining,
    'recipies': recipies,
    'blockstates': blockstates
  }

  print(f'{index+1}/{len(data)}: {i}')
  json.dump(details, open('minecraft-items-details.json', 'w'), indent=2)