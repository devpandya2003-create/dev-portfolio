#!/usr/bin/env python3
"""Dependency-free static release checks for devpandya.com."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import json,re,sys,zipfile
ROOT=Path(__file__).resolve().parents[1]
PRIMARY=[ROOT/'index.html',ROOT/'research/index.html',ROOT/'research/vistra/index.html',ROOT/'research/take-two/index.html',ROOT/'research/first-solar/index.html',ROOT/'research/global-portfolio/index.html',ROOT/'404.html']
errors=[]
class Parser(HTMLParser):
 def __init__(self):
  super().__init__();self.base=None;self.refs=[];self.ids=[];self.images=[];self.scripts=[];self._jsonld=False;self._jsonbuf=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='base':self.base=a.get('href')
  if 'id' in a:self.ids.append(a['id'])
  if tag in ('a','link') and a.get('href'):self.refs.append((tag,a['href']))
  if tag in ('img','script') and a.get('src'):self.refs.append((tag,a['src']))
  if tag=='img':self.images.append(a)
  if tag=='script' and a.get('type')=='application/ld+json':self._jsonld=True;self._jsonbuf=[]
 def handle_data(self,data):
  if self._jsonld:self._jsonbuf.append(data)
 def handle_endtag(self,tag):
  if tag=='script' and self._jsonld:
   self.scripts.append(''.join(self._jsonbuf));self._jsonld=False

def local_target(page,base,ref):
 if ref.startswith(('#','mailto:','tel:','javascript:','data:')):return None
 if urlparse(ref).scheme or ref.startswith('//'):return None
 page_url='https://local/'+page.relative_to(ROOT).as_posix()
 root_url=urljoin(page_url,base) if base else page_url
 resolved=urljoin(root_url,ref)
 path=urlparse(resolved).path.lstrip('/')
 target=ROOT/path
 if path.endswith('/'):target=target/'index.html'
 return target

for page in PRIMARY:
 if not page.exists():errors.append(f'missing primary page: {page.relative_to(ROOT)}');continue
 text=page.read_text(errors='ignore');p=Parser();p.feed(text)
 for value in set(p.ids):
  if p.ids.count(value)>1:errors.append(f'{page.relative_to(ROOT)} duplicate id: {value}')
 for img in p.images:
  if not img.get('alt','').strip():errors.append(f'{page.relative_to(ROOT)} image missing alt: {img.get("src")}')
 for tag,ref in p.refs:
  target=local_target(page,p.base,ref)
  if target and not target.exists():errors.append(f'{page.relative_to(ROOT)} missing {tag} target: {ref} -> {target.relative_to(ROOT)}')
 for block in p.scripts:
  try:json.loads(block)
  except Exception as exc:errors.append(f'{page.relative_to(ROOT)} invalid JSON-LD: {exc}')
 if page.name=='index.html' and page.parent.name in {'vistra','take-two','first-solar','global-portfolio'}:
  for phrase in ('Evidence status','Thesis invalidation','Sources and limitations','NOT INVESTMENT ADVICE'):
   if phrase.lower() not in text.lower():errors.append(f'{page.relative_to(ROOT)} missing case field: {phrase}')

home=(ROOT/'index.html').read_text();archive=(ROOT/'research/index.html').read_text();app=(ROOT/'assets/app.js').read_text();site_text='\n'.join(p.read_text(errors='ignore') for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.js','.css'})
selected_tokens=home.count('class="selected-card')
if selected_tokens!=8: # card + card-head occurrence per item
 errors.append(f'homepage selected-card token count unexpected: {selected_tokens}; expected 8 tokens for 4 cards')
if len(re.findall(r'<article class="research-row',archive))!=18:errors.append('archive must contain exactly 18 research rows')
if home.count('class="pathway-grid')!=1 or home.count('<article><span>0')<3:errors.append('role pathways missing')
for control in ('research-search','research-sort','research-type'):
 if f'id="{control}"' not in archive:errors.append(f'archive control missing: {control}')
for stale in ('₹70 crore','50+ line items','Finance internships','CFA Level I Candidate','LinkedIn_Outreach_Log','OwnerCommandGate','BEGIN PRIVATE KEY'):
 if stale.lower() in site_text.lower():errors.append(f'stale/private pattern present: {stale}')
for phrase in ('500+ line items','more than 50 distressed accounts'):
 if phrase not in app:errors.append(f'expected synchronized experience phrase missing: {phrase}')
critical=['assets/Dev-Pandya-Recruiter-Portfolio-Brief.pdf','assets/research/Dev-Pandya-Take-Two-Equity-Research.pdf','assets/research/Dev-Pandya-First-Solar-Research-Brief.pdf','assets/models/Dev-Pandya-Vistra-Valuation-Bridge.xlsx','assets/models/Dev-Pandya-Take-Two-Scenario-Analysis.xlsx','assets/models/Dev-Pandya-First-Solar-Research-Audit.xlsx','assets/research/vistra-valuation-bridge.png','assets/research/take-two-scenario-ranges.png','assets/research/first-solar-dupont-audit.png']
for rel in critical:
 p=ROOT/rel
 if not p.exists() or p.stat().st_size<1000:errors.append(f'missing/empty critical artifact: {rel}')
 elif p.suffix=='.pdf' and not p.read_bytes().startswith(b'%PDF'):errors.append(f'invalid PDF header: {rel}')
 elif p.suffix=='.xlsx':
  try:
   with zipfile.ZipFile(p) as z:
    if '[Content_Types].xml' not in z.namelist():errors.append(f'invalid XLSX package: {rel}')
  except Exception as exc:errors.append(f'invalid XLSX: {rel}: {exc}')
if not (ROOT/'projects/global-portfolio/index.html').exists():errors.append('legacy global-portfolio redirect missing')
if errors:
 print('PORTFOLIO QUALITY GATE: FAIL')
 for e in errors:print('-',e)
 sys.exit(1)
print('PORTFOLIO QUALITY GATE: PASS')
print(json.dumps({'primary_pages':len(PRIMARY),'archive_rows':18,'selected_cases':4,'critical_artifacts':len(critical)},indent=2))
