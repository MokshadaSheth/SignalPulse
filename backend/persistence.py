"""Atomic JSON file persistence — one file per employee."""

import json
import os
import tempfile
from pathlib import Path
from typing import Optional

from models import EmployeeData

DATA_DIR = Path(__file__).parent / "data"


def ensure_data_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_employee_path(employee_id: str) -> Path:
    return DATA_DIR / f"{employee_id}.json"


def load_employee(employee_id: str) -> EmployeeData:
    """Load employee data from JSON file, or create new if not found."""
    ensure_data_dir()
    path = get_employee_path(employee_id)
    if path.exists():
        try:
            with open(path, "r") as f:
                data = json.load(f)
            # parse_obj handles both alias (snake_case) and field names (camelCase)
            return EmployeeData(**data)
        except (json.JSONDecodeError, Exception):
            pass
    return EmployeeData(employeeId=employee_id)


def save_employee(data: EmployeeData):
    """Atomically save employee data — write to temp then rename to prevent corruption."""
    ensure_data_dir()
    path = get_employee_path(data.employeeId)
    # Write to temp file first, then atomic rename
    fd, tmp_path = tempfile.mkstemp(dir=DATA_DIR, suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            # Serialize with aliases (snake_case) for ML data fields
            json.dump(data.model_dump(by_alias=True), f, indent=2)
        os.replace(tmp_path, path)  # Atomic on POSIX and Windows
    except Exception:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise


def list_all_employees() -> list[EmployeeData]:
    """Load all employee JSON files for manager aggregation."""
    ensure_data_dir()
    employees = []
    for path in DATA_DIR.glob("*.json"):
        try:
            with open(path, "r") as f:
                data = json.load(f)
            employees.append(EmployeeData(**data))
        except Exception:
            continue
    return employees
