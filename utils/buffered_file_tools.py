from __future__ import annotations

from dataclasses import dataclass, replace
from pathlib import Path
from typing import List, Literal, Optional

from agno.tools.file import FileTools

OperationType = Literal["write", "append", "delete", "mkdir"]


@dataclass
class BufferedOperation:
    """Representa uma ação pendente a ser aplicada em disco."""

    action: OperationType
    path: Path
    content: Optional[str] = None
    encoding: str = "utf-8"
    parents: bool = True


class BufferedFileTools(FileTools):
    """Versão com buffer do FileTools para reduzir chamadas ao modelo."""

    def __init__(self, base_dir: Path | str, flush_threshold: int = 8) -> None:
        super().__init__(base_dir=base_dir)
        self._base_dir = Path(base_dir).resolve()
        self._project_dir = self._base_dir.parent.name
        self._strip_prefixes = {self._base_dir.name, self._project_dir, "projects"}
        self.flush_threshold = max(flush_threshold, 1)
        self._buffer: List[BufferedOperation] = []

    def _normalize_path(self, path: str | Path) -> Path:
        raw = Path(path)
        if raw.is_absolute():
            candidate = raw.resolve()
        else:
            candidate = (self._base_dir / raw).resolve()
        try:
            relative = candidate.relative_to(self._base_dir)
        except ValueError as exc:
            raise ValueError(f"Caminho fora da base permitida: {path}") from exc

        parts = list(relative.parts)
        while parts and parts[0] in self._strip_prefixes:
            parts.pop(0)

        normalized = Path(*parts) if parts else Path(".")
        if normalized == Path("."):
            raise ValueError(f"Caminho invalido apos normalizacao: {path}")
        return normalized

    def _resolve(self, path: Path) -> Path:
        candidate = (self._base_dir / path).resolve()
        try:
            candidate.relative_to(self._base_dir)
        except ValueError as exc:
            raise ValueError(f"Caminho fora da base permitida: {path}") from exc
        return candidate

    def _schedule(self, op: BufferedOperation) -> str:
        normalized_path = self._normalize_path(op.path)
        normalized_op = replace(op, path=normalized_path)
        self._buffer.append(normalized_op)
        if len(self._buffer) >= self.flush_threshold:
            self.flush()
        return f"Agendado {op.action} para {normalized_op.path.as_posix()}"

    def pending(self) -> int:
        return len(self._buffer)

    def write_file(self, path: str, content: str, encoding: str = "utf-8") -> str:  # type: ignore[override]
        op = BufferedOperation("write", Path(path), content=content, encoding=encoding)
        return self._schedule(op)

    def append_file(self, path: str, content: str, encoding: str = "utf-8") -> str:  # type: ignore[override]
        op = BufferedOperation("append", Path(path), content=content, encoding=encoding)
        return self._schedule(op)

    def delete_file(self, path: str) -> str:  # type: ignore[override]
        op = BufferedOperation("delete", Path(path))
        return self._schedule(op)

    def create_directory(self, path: str, parents: bool = True) -> str:  # type: ignore[override]
        op = BufferedOperation("mkdir", Path(path), parents=parents)
        return self._schedule(op)

    def flush(self) -> str:
        if not self._buffer:
            return "Nenhuma acao pendente."

        for op in self._buffer:
            resolved = self._resolve(op.path)
            if op.action == "write":
                resolved.parent.mkdir(parents=True, exist_ok=True)
                resolved.write_text(op.content or "", encoding=op.encoding)
            elif op.action == "append":
                resolved.parent.mkdir(parents=True, exist_ok=True)
                if resolved.exists():
                    previous = resolved.read_text(encoding=op.encoding)
                else:
                    previous = ""
                resolved.write_text(previous + (op.content or ""), encoding=op.encoding)
            elif op.action == "delete":
                if resolved.exists():
                    resolved.unlink()
            elif op.action == "mkdir":
                resolved.mkdir(parents=op.parents, exist_ok=True)

        applied = len(self._buffer)
        self._buffer.clear()
        return f"Aplicadas {applied} alterações pendentes."


__all__ = ["BufferedFileTools", "BufferedOperation"]
