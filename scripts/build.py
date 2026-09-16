#!/usr/bin/env python3
"""Validate and package the dependency-free portfolio for static hosting."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import shutil
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.local = set()
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('href', 'src') or not value:
                continue
            url = urlsplit(value)
            if not url.scheme and not url.netloc and url.path:
                self.local.add(unquote(url.path).lstrip('/'))

parser = argparse.ArgumentParser()
parser.add_argument('--out', required=True, type=Path)
args = parser.parse_args()
output = args.out.resolve()
if output == ROOT or ROOT in output.parents:
    parser.error('Use a new output directory outside the source checkout.')
if output.exists():
    parser.error('Output directory must not already exist.')
html = (ROOT / 'index.html').read_text()
assets = Assets()
assets.feed(html)
missing = [name for name in assets.local if not (ROOT / name).is_file()]
if missing:
    raise SystemExit(f'Missing local assets: {missing}')
for folder in ('js', 'css'):
    for source in (ROOT / folder).glob('*'):
        if source.suffix in ('.js', '.css') and '\u2014' in source.read_text():
            raise SystemExit(f'Em dash in {source}')
if '\u2014' in html:
    raise SystemExit('Em dash in index.html')
output.mkdir(parents=True)
for name in ('index.html', 'ManishResume.pdf'):
    shutil.copy2(ROOT / name, output / name)
for name in ('css', 'js', 'images', 'skillsImages'):
    shutil.copytree(ROOT / name, output / name, ignore=shutil.ignore_patterns('.DS_Store'))
print(f'Validated {len(assets.local)} local targets. Static production package: {output}')
