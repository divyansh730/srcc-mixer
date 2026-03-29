"""One-off: extract embedded JPEGs from the saved MHTML into public/pc-gallery-defaults/."""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MHTML = ROOT / "The Placement Cell · Gallery · SRCC.mhtml"
OUT = ROOT / "public" / "pc-gallery-defaults"


def main() -> None:
    if not MHTML.is_file():
        print("MHTML not found:", MHTML, file=sys.stderr)
        sys.exit(1)
    text = MHTML.read_text(encoding="utf-8", errors="ignore")
    text = re.sub(r"=\r?\n", "", text)
    text = text.replace("=3D", "=")
    pattern = re.compile(r"data:image/jpeg;base64,([A-Za-z0-9+/=]+)")
    parts = pattern.findall(text)
    if len(parts) < 10:
        print("Too few base64 segments:", len(parts), file=sys.stderr)
        sys.exit(1)
    OUT.mkdir(parents=True, exist_ok=True)
    for i, b64 in enumerate(parts[:49]):
        raw = base64.b64decode(b64)
        (OUT / f"{i:02d}.jpg").write_bytes(raw)
    print(f"Wrote {min(len(parts), 49)} files to {OUT}")


if __name__ == "__main__":
    main()
