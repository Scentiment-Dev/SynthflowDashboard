#!/usr/bin/env python3
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
required = [
    'HANDOFF_README.md',
    'REHYDRATION_PROMPT.md',
    'project-management/wave_status.md',
    'project-management/wave_schedule.md',
    'project-management/wave_schedule.json',
    'project-management/wave_10_completion_report.md',
    'docs/01_project_control/WAVE_10_FINAL_PACK_VALIDATION.md',
    'docs/00_read_me_first/FINAL_IMPLEMENTATION_HANDOFF.md',
    'README.md',
]
missing = [p for p in required if not (ROOT / p).exists()]
if missing:
    raise SystemExit('Missing Wave 10 files: ' + ', '.join(missing))
status = (ROOT / 'project-management/wave_status.md').read_text(encoding='utf-8')
if '| 10 | Complete / locked | AI PM |' not in status:
    raise SystemExit('Wave 10 is not marked complete/locked in wave_status.md')
schedule = json.loads((ROOT / 'project-management/wave_schedule.json').read_text(encoding='utf-8'))
w10 = [w for w in schedule if w.get('wave') == 10]
if not w10 or w10[0].get('status') != 'complete_locked':
    raise SystemExit('Wave 10 is not marked complete_locked in wave_schedule.json')
print('Wave 10 final pack validation passed.')
