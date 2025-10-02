import json
import logging
from pathlib import Path
from threading import Event

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def parse_json_task(input_path: Path, ready_event: Event, shared: dict):
    """Thread task: parse input JSON and populate shared dict."""
    logging.info("Parsing JSON (task module)...")
    data = json.loads(input_path.read_text(encoding="utf-8"))
    shared["raw_json"] = data
    shared["frontend_spec"] = data.get("frontend", {})
    shared["backend_spec"] = data.get("backend", {})
    ready_event.set()
    logging.info("Parsing done (task module).")
