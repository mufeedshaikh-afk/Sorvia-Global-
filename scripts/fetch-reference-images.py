"""Download attributed reference photographs; never represents confirmed inventory."""
import html
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'images' / 'reference'
FILES = {
    'brass-vessels': 'File:Durian-Shaped Tausug Brass Vase.jpg',
    'wood-accents': 'File:Carved Wooden Bowl With Lid (30646940752).jpg',
    'copper-vessel': 'File:Copper vessel.jpg',
    'wood-chess': 'File:Ancient Wooden Chess.jpg',
    'brass-vase': "File:Vase, made by Yahiya b. Yusuf as-Sa'igh, Arab Spain, 15th century AD, brass - Aga Khan Museum - Toronto, Canada - DSC06582.jpg",
    'wood-vase': 'File:Decorative wooden vase (26450223658).jpg',
    'copper-bowl': 'File:Copper bowl - 19c - State Historical Museum of the Southern Urals.jpg',
    'metal-chess': 'File:Chess set MET LC-48 174 32-001.jpg',
    'ceramic-vase': 'File:Flower Vase.jpg',
    'glass-vase': 'File:Glass Vase (49320596312).jpg',
    'stone-vase': 'File:Marble vase with high foot and four lug handles MET DP256408.jpg',
    'brass-bowl': 'File:Brass bowl.jpg',
    'brass-traditional-bowl': 'File:A traditional Indian brass bowl, likely a "Baan Bati".jpg',
    'wood-bowl': 'File:Late 1800s wooden bowl Solberga parish Kungaelv municipality Sweden.jpg',
    'wood-box': 'File:Ornamented wooden box from students of Madras Christian College and Law College - Rabindra Bhavana Museum 01.jpg',
    'copper-jug': 'File:Bangladeshi Copper Jug.jpg',
    'copper-bamboo-vase': 'File:Hanging flower vase in the form of a bamboo shoot, Japan, Edo period, 1700s-1800s AD, copper alloy with silver - Peabody Essex Museum - DSC07561.jpg',
    'copper-enamel-vase': 'File:WLA vanda Vase enamel decoration on copper.jpg',
    'ceramic-jaguar-vase': 'File:Jaguar Vase, Chorotega, precolonial era ceramic, Anchorage Museum.jpg',
    'ceramic-painted-vase': 'File:Maya Late Classic Polychrome Ceramic Vase, 13cm.jpg',
    'ceramic-footed-vase': 'File:Mixtec Polychrome Ceramic Animal Foot Vase.jpg',
    'ceramic-bowl': 'File:Ceramic Bowl MET DP353098.jpg',
    'glass-floriform-vase': 'File:Calyx Floriform Vase, Louis Comfort Tiffany, 1893-1929, iridescent blue favrile glass - Currier Museum of Art - Manchester, NH - DSC07241.jpg',
    'glass-overlay-vase': 'File:Glass vase with red overlay on snowflake ground, Qianlong era.JPG',
    'glass-cobalt-vase': 'File:Heisey glass (4220 Janice vase; Cobalt) (1932-1939).jpg',
    'glass-art-vase': 'File:Vase, by Émile Gallé, 1896; glass, height, 17.5 cm, Metropolitan Museum of Art (New York City).jpg',
    'stone-bowl': 'File:Marble bowl MET DP322099.jpg',
    'stone-spouted-bowl': 'File:Marble spouted bowl MET DP256406.jpg',
    'stone-amphora': 'File:Miniature alabaster amphora (jar) MET DP149718.jpg',
    'stone-rounded-bowl': 'File:Marble bowl MET 268483.jpg',
}

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'SorviaGlobalDesignPreview/0.1 (reference photo attribution)'})
    return urllib.request.urlopen(req, timeout=45)

def plain(value):
    return html.unescape(re.sub('<[^>]*>', '', value)).strip()

OUT.mkdir(parents=True, exist_ok=True)
records = []
if '--only-new' in sys.argv:
    records = json.loads((OUT / 'credits.json').read_text(encoding='utf-8'))
    existing = {Path(record['file']).stem for record in records}
    FILES = {slug: title for slug, title in FILES.items() if slug not in existing}
if '--credits-only' in sys.argv:
    records = json.loads((OUT / 'credits.json').read_text(encoding='utf-8'))
    FILES = {}
for slug, title in FILES.items():
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({
        'action': 'query', 'format': 'json', 'titles': title, 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata', 'iiurlwidth': 1000,
    })
    with fetch(url) as response:
        page = next(iter(json.load(response)['query']['pages'].values()))
    info = page['imageinfo'][0]
    meta = info['extmetadata']
    license_name = meta['LicenseShortName']['value']
    if not (license_name.startswith('CC BY') or license_name in ['CC0', 'Public domain']):
        raise ValueError(f'Unexpected license: {license_name}')
    photo_url = info.get('thumburl', info['url']).split('?')[0]
    with fetch(photo_url) as response:
        image = response.read()
        if not response.headers.get('Content-Type', '').startswith('image/'):
            raise ValueError('Expected image response')
    (OUT / f'{slug}.jpg').write_bytes(image)
    records.append({
        'file': f'/images/reference/{slug}.jpg', 'title': page['title'],
        'source': info['descriptionurl'], 'original': info['url'],
        'author': plain(meta.get('Artist', {}).get('value', 'See source page')),
        'license': license_name, 'licenseUrl': meta.get('LicenseUrl', {}).get('value', ''),
        'changes': 'Wikimedia thumbnail; displayed in a responsive image frame. No retouching.',
    })
    print(slug, len(image), records[-1]['author'], license_name)
    (OUT / 'credits.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')

lines = ['# Reference photo credits', '', 'These photographs illustrate sample concepts. They are not SorviaGlobal inventory photographs or evidence of product specifications.', '', 'Downloaded 16 November 2026 from Wikimedia Commons. Images retain their individual licenses; application code licensing does not replace them.', '']
for record in records:
    lines.extend([f"## {record['file']}", '', f"- Title: {record['title']}", f"- Author: {record['author']}", f"- Source: {record['source']}", f"- License: {record['license']} {record['licenseUrl']}", f"- Changes: {record['changes']}", ''])
(ROOT / 'IMAGE_CREDITS.md').write_text('\n'.join(lines), encoding='utf-8')

entries = []
for record in records:
    slug = Path(record['file']).stem
    escape = html.escape
    license_link = f'<a href="{escape(record["licenseUrl"])}">{escape(record["license"])}</a>' if record['licenseUrl'] else escape(record['license'])
    entries.append(f'<article id="{slug}"><img src="{escape(record["file"])}" alt="Reference photograph: {escape(slug)}" loading="lazy"><div><h2>{escape(record["title"].removeprefix("File:"))}</h2><p>Photo: {escape(record["author"])}<br>License: {license_link}</p><p><a href="{escape(record["source"])}">Original source and full attribution</a></p><p>{escape(record["changes"])}</p></div></article>')
page = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reference photo credits | SorviaGlobal</title><style>body{font:16px/1.7 system-ui,sans-serif;color:#30382e;background:#faf9f5;margin:40px auto;padding:0 24px;max-width:960px}a{color:#354b39;text-underline-offset:4px}h1{font:48px Georgia,serif}h2{font:24px/1.4 Georgia,serif;overflow-wrap:anywhere}article{border-top:1px solid #cfd5c7;padding:30px 0;display:flex;gap:30px;scroll-margin-top:20px}article img{width:180px;height:180px;object-fit:contain;background:#eeeee5}article p{font-size:13px}article:target{background:#eeeee5}a:focus-visible{outline:3px solid #9b702b;outline-offset:4px}@media(max-width:600px){article{display:block}h1{font-size:36px}}</style></head><body><a href="/shop">Back to Shop</a><h1>Reference photo credits</h1><p>These photographs show examples for our design preview. They are not SorviaGlobal inventory photographs or confirmation of product materials, condition or specifications. Some depict historic museum objects.</p><p>Photographs are sourced from Wikimedia Commons and retain their individual licenses. Application code licensing does not replace these image licenses. No endorsement by the photographers or institutions is implied.</p>'''
(OUT / 'credits.html').write_text(page + ''.join(entries) + '</body></html>', encoding='utf-8')
