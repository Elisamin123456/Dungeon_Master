from pathlib import Path

path = Path("main.js")
text = path.read_text(encoding="latin-1")
trailer = "window.addEventListener(\"load\", () => {\n  new Phaser.Game(config); // eslint-disable-line no-new\n});\n"
if not text.rstrip().endswith(trailer.rstrip()):
    raise SystemExit("unexpected trailer")
text = text[:text.rfind(trailer)] + trailer
path.write_text(text, encoding="latin-1")
