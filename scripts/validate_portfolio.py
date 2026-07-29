#!/usr/bin/env python3
"""Dependency-free static release checks for devpandya.com."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import json,re,struct,sys,zipfile
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
PRIMARY=[ROOT/'index.html',ROOT/'research/index.html',ROOT/'research/vistra/index.html',ROOT/'research/take-two/index.html',ROOT/'research/first-solar/index.html',ROOT/'research/global-portfolio/index.html',ROOT/'research/capital-one-discover/index.html',ROOT/'research/work-brain-vs-study-brain/index.html',ROOT/'research/protect-the-study-habit/index.html',ROOT/'404.html']
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
 if page.name=='index.html' and page.parent.name in {'vistra','take-two','first-solar','global-portfolio','capital-one-discover'}:
  for phrase in ('Evidence status','Thesis invalidation','Sources and limitations','NOT INVESTMENT ADVICE'):
   if phrase.lower() not in text.lower():errors.append(f'{page.relative_to(ROOT)} missing case field: {phrase}')

home=(ROOT/'index.html').read_text();archive=(ROOT/'research/index.html').read_text();app=(ROOT/'assets/app.js').read_text();post=(ROOT/'research/work-brain-vs-study-brain/index.html').read_text();latest_post=(ROOT/'research/protect-the-study-habit/index.html').read_text();site_text='\n'.join(p.read_text(errors='ignore') for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.js','.css'})
selected_tokens=home.count('class="selected-card')
if selected_tokens!=8: # card + card-head occurrence per item
 errors.append(f'homepage selected-card token count unexpected: {selected_tokens}; expected 8 tokens for 4 cards')
if len(re.findall(r'<article class="research-row',archive))!=21:errors.append('archive must contain exactly 21 research rows')
if archive.count('data-date=""')!=10:errors.append('archive provenance audit must retain exactly 10 explicitly undated rows')
if 'Source file created Jul 27, 2026' in home+'\n'+archive+'\n'+app:errors.append('unsupported Jul 27 Vistra source-file date must not be published')
for marker in ('<strong>04</strong><span>Formula workbooks</span>','<strong>21</strong><span>Research entries</span>','<strong>08</strong><span>CFA learning visuals</span>','<strong>05</strong><span>Shareable case studies</span>'):
 if marker not in home:errors.append(f'homepage evidence count not synchronized: {marker}')
if home.count('class="pathway-grid')!=1 or home.count('<article><span>0')<3:errors.append('role pathways missing')
for control in ('research-search','research-sort','research-type'):
 if f'id="{control}"' not in archive:errors.append(f'archive control missing: {control}')
for stale in ('₹70 crore','50+ line items','Finance internships','CFA Level I Candidate','LinkedIn_Outreach_Log','OwnerCommandGate','BEGIN PRIVATE KEY'):
 if stale.lower() in site_text.lower():errors.append(f'stale/private pattern present: {stale}')
if 'boiii' in app.lower():errors.append('public research notes must use Finance Research Process, not internal boiii name')
for unsupported in ('89.5%','Zero of 22','one in ten odds'):
 if unsupported.lower() in (archive+'\n'+app).lower():errors.append(f'unsupported active-fund claim remains public: {unsupported}')
required_citations=(
 '10.1111/0022-1082.00367','10.1111/0022-1082.00184',
 '10.1016/S0304-405X(02)00223-4','10.1111/j.1540-6261.2004.00629.x',
 '10.1016/j.intfin.2024.102077','10.2139/ssrn.603481','978-0-374-27563-1',
 '0001193125-24-039233','0001193125-25-122059')
for citation in required_citations:
 if citation not in site_text:errors.append(f'required external citation missing: {citation}')
if app.count('Authorship &amp; source boundary')<4:errors.append('external-source notes need visible authorship boundaries')
active_audit='data-title="why active-fund statistics need dated sources" data-date="" data-kind="note" data-artifact="false"'
if active_audit not in archive:errors.append('active-fund attribution audit row must remain a non-artifact note')
for page in (home,archive):
 if 'Authorship &amp; attribution' not in page:errors.append('global research authorship disclosure missing')
case_sources={
 'research/take-two/index.html':('0001628280-26-037434','0001628280-26-005119','Original uncited coursework DOCX'),
 'research/first-solar/index.html':('0001274494-26-000021','0001274494-26-000109','Original uncited coursework DOCX'),
 'research/vistra/index.html':('0001692819-26-000006','0001692819-26-000014','licensed source material'),
 'research/capital-one-discover/index.html':('0001193125-24-039233','0001193125-25-122059','fixed exchange ratio actually transfers')}
for rel,markers in case_sources.items():
 text=(ROOT/rel).read_text()
 if 'authorship-source-boundary' not in text:errors.append(f'authorship boundary missing: {rel}')
 for marker in markers:
  if marker not in text:errors.append(f'case source marker missing in {rel}: {marker}')
for phrase in ('500+ line items','more than 50 distressed accounts'):
 if phrase not in app:errors.append(f'expected synchronized experience phrase missing: {phrase}')
for marker in (
 'Dev-Pandya-Bloomberg-Market-Concepts-Certificate.pdf',
 'Bloomberg Market Concepts completed November 30, 2025',
 'Dev-Pandya-Negative-Yield-Debt-Presentation.pdf',
 'Dev-Pandya-Negative-Yield-Debt-Presentation.pptx',
 'Historical source synthesis',
 'Dev-Pandya-Apple-Value-vs-Growth-Academic-Analysis.docx',
 'Original DOCX · incomplete citations',
 'Dev-Pandya-CFA-Work-Brain-vs-Study-Brain.png',
 'Dev-Pandya-CFA-Protect-the-Study-Habit.png',
 'EIGHT VISUAL NOTES / UPDATED JUL 29, 2026',
 'Dev-Pandya-Capital-One-Discover-Transaction-Mechanics.pdf',
 'Dev-Pandya-Capital-One-Discover-Transaction-Mechanics.xlsx',
 '5 official SEC citations'):
 if marker not in home+'\n'+archive+'\n'+app:errors.append(f'new public artifact or disclosure missing: {marker}')
for marker in (
 'https://devpandya.com/research/work-brain-vs-study-brain/',
 '<meta property="article:published_time" content="2026-07-28">',
 'Accessible transcript',
 'CFA Level I · The honest part',
 'No exam-result or productivity claim',
 'NO CFA INSTITUTE ENDORSEMENT'):
 if marker not in post:errors.append(f'standalone study reflection missing marker: {marker}')
if home.count('class="latest-update reveal"')!=1:errors.append('homepage must contain exactly one latest-update feature')
if 'href="research/protect-the-study-habit/"' not in home:errors.append('homepage latest update must link to the July 29 standalone post')
if len(re.findall(r'<article class="research-row',home))!=6:errors.append('homepage research preview must remain exactly six rows')
for marker in (
 'https://devpandya.com/research/protect-the-study-habit/',
 '<meta property="article:published_time" content="2026-07-29">',
 'I lowered the bar. That’s why I’m still going.',
 'The reflection shared on LinkedIn',
 'Self-reported habit; no exam-result claim',
 'NO CFA INSTITUTE ENDORSEMENT'):
 if marker not in latest_post:errors.append(f'July 29 study reflection missing marker: {marker}')
for marker in (
 'Observation date not stated',
 'Source file created Jul 20, 2026',
 'PDF created Jul 14, 2026',
 'Document modified Mar 19, 2026',
 'Publication date not stated'):
 if marker not in home+'\n'+archive+'\n'+app+'\n'+(ROOT/'research/first-solar/index.html').read_text():errors.append(f'provenance label missing: {marker}')
if 'CFA LEVEL 1' in site_text.upper():errors.append('Arabic CFA Level 1 wording remains in public text; use CFA Level I')
for study_name in ('Dev-Pandya-CFA-Work-Brain-vs-Study-Brain.png','Dev-Pandya-CFA-Protect-the-Study-Habit.png'):
 study_png=ROOT/'assets/research'/study_name
 if study_png.exists():
  with study_png.open('rb') as f:header=f.read(24)
  if len(header)<24 or header[:8]!=b'\x89PNG\r\n\x1a\n':errors.append(f'study reflection PNG header invalid: {study_name}')
  else:
   width,height=struct.unpack('>II',header[16:24])
   if (width,height)!=(1080,1080):errors.append(f'study reflection dimensions changed for {study_name}: {(width,height)}')
critical=['assets/Dev-Pandya-Recruiter-Portfolio-Brief.pdf','assets/research/Dev-Pandya-Take-Two-Equity-Research.pdf','assets/research/Dev-Pandya-First-Solar-Research-Brief.pdf','assets/models/Dev-Pandya-Vistra-Valuation-Bridge.xlsx','assets/models/Dev-Pandya-Take-Two-Scenario-Analysis.xlsx','assets/models/Dev-Pandya-First-Solar-Research-Audit.xlsx','assets/research/vistra-valuation-bridge.png','assets/research/take-two-scenario-ranges.png','assets/research/first-solar-dupont-audit.png','assets/credentials/Dev-Pandya-Bloomberg-Market-Concepts-Certificate.pdf','assets/research/Dev-Pandya-Negative-Yield-Debt-Presentation.pptx','assets/research/Dev-Pandya-Negative-Yield-Debt-Presentation.pdf','assets/research/Dev-Pandya-Apple-Value-vs-Growth-Academic-Analysis.docx','assets/research/Dev-Pandya-CFA-Work-Brain-vs-Study-Brain.png','assets/research/Dev-Pandya-CFA-Protect-the-Study-Habit.png','assets/research/Dev-Pandya-Capital-One-Discover-Transaction-Mechanics.pdf','assets/models/Dev-Pandya-Capital-One-Discover-Transaction-Mechanics.xlsx']
for rel in critical:
 p=ROOT/rel
 if not p.exists() or p.stat().st_size<1000:errors.append(f'missing/empty critical artifact: {rel}')
 elif p.suffix=='.pdf' and not p.read_bytes().startswith(b'%PDF'):errors.append(f'invalid PDF header: {rel}')
 elif p.suffix=='.png' and not p.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'):errors.append(f'invalid PNG signature: {rel}')
 elif p.suffix in {'.xlsx','.pptx','.docx'}:
  try:
   with zipfile.ZipFile(p) as z:
    if '[Content_Types].xml' not in z.namelist():errors.append(f'invalid Office package: {rel}')
  except Exception as exc:errors.append(f'invalid Office package {rel}: {exc}')
if not (ROOT/'projects/global-portfolio/index.html').exists():errors.append('legacy global-portfolio redirect missing')
sitemap=ROOT/'sitemap.xml';robots=ROOT/'robots.txt'
expected_sitemap={
 'https://devpandya.com/',
 'https://devpandya.com/research/',
 'https://devpandya.com/research/vistra/',
 'https://devpandya.com/research/take-two/',
 'https://devpandya.com/research/first-solar/',
 'https://devpandya.com/research/global-portfolio/',
 'https://devpandya.com/research/capital-one-discover/',
 'https://devpandya.com/research/protect-the-study-habit/',
 'https://devpandya.com/research/work-brain-vs-study-brain/'}
if not sitemap.exists():errors.append('sitemap.xml missing')
else:
 try:
  root=ET.parse(sitemap).getroot();ns={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9'}
  urls=[node.text.strip() for node in root.findall('sm:url/sm:loc',ns) if node.text]
  if len(urls)!=len(set(urls)):errors.append('sitemap.xml contains duplicate URLs')
  if set(urls)!=expected_sitemap:errors.append(f'sitemap.xml canonical route mismatch: {sorted(set(urls)^expected_sitemap)}')
  for node in root.findall('sm:url/sm:lastmod',ns):
   if not node.text or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',node.text.strip()):errors.append(f'invalid sitemap lastmod: {node.text!r}')
 except Exception as exc:errors.append(f'invalid sitemap.xml: {exc}')
if not robots.exists():errors.append('robots.txt missing')
elif 'Sitemap: https://devpandya.com/sitemap.xml' not in robots.read_text():errors.append('robots.txt missing canonical sitemap declaration')
if errors:
 print('PORTFOLIO QUALITY GATE: FAIL')
 for e in errors:print('-',e)
 sys.exit(1)
print('PORTFOLIO QUALITY GATE: PASS')
print(json.dumps({'primary_pages':len(PRIMARY),'archive_rows':21,'selected_cases':4,'critical_artifacts':len(critical)},indent=2))
