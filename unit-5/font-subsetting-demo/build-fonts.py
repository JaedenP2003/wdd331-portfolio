"""Build the font files used by the font subsetting demo.

Run from this folder:   python build-fonts.py

Needs fonttools and brotli:   python -m pip install fonttools brotli

What it does
  1. Compresses the full Inter variable font to WOFF2 (the "before" file).
  2. Subsets it into one WOFF2 file per script, using pyftsubset (fonttools).
  3. Scans after.html for the characters it really uses and builds a
     page-only subset (what glyphhanger automates).
  4. Writes sizes.json with the real byte sizes, which index.html reads.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
SOURCE = HERE / "fonts" / "source" / "Inter-Variable.ttf"
OUT = HERE / "fonts"

# unicode-range values. The same strings go in the @font-face rules.
RANGES = {
    "latin": "U+0000-00FF,U+0131,U+0152-0153,U+2000-206F",
    "latin-ext": "U+0100-02AF,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF",
    "greek": "U+0370-03FF",
    "cyrillic": "U+0400-045F,U+0490-0491",
}


def run(args):
    subprocess.run([sys.executable, "-m", *args], check=True)


def main():
    sizes = {"source-ttf": SOURCE.stat().st_size}

    # 1. Full font as WOFF2: the fair "before" file (same compression as the subsets)
    full = OUT / "Inter-full.woff2"
    run(["fontTools.ttLib.woff2", "compress", str(SOURCE), "-o", str(full)])
    sizes["full"] = full.stat().st_size

    # 2. One subset per script
    for name, unicodes in RANGES.items():
        out = OUT / f"Inter-{name}.woff2"
        run([
            "fontTools.subset", str(SOURCE),
            f"--unicodes={unicodes}",
            "--flavor=woff2",
            "--layout-features=*",
            f"--output-file={out}",
        ])
        sizes[name] = out.stat().st_size

    # 3. Page-only subset: only the characters after.html actually uses
    html = (HERE / "after.html").read_text(encoding="utf-8")
    text = re.sub(r"<(script|style)[\s\S]*?</\1>", "", html)
    text = re.sub(r"<[^>]+>", "", text)
    chars = "".join(sorted(set(text + "".join(chr(c) for c in range(0x20, 0x7F)))))
    used = HERE / "fonts" / "used-characters.txt"
    used.write_text(chars, encoding="utf-8")
    page_only = OUT / "Inter-page-only.woff2"
    run([
        "fontTools.subset", str(SOURCE),
        f"--text-file={used}",
        "--flavor=woff2",
        "--layout-features=*",
        f"--output-file={page_only}",
    ])
    sizes["page-only"] = page_only.stat().st_size
    sizes["characters-used"] = len(chars)

    (HERE / "sizes.json").write_text(json.dumps(sizes, indent=2), encoding="utf-8")
    for key, value in sizes.items():
        print(f"{key:16} {value:>9,}")


if __name__ == "__main__":
    main()
