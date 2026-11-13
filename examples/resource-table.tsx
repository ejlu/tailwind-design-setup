import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, MoreHorizontal, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  IconButton,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "../src";

const initial = [
  {
    id: "1",
    name: "Brand foundations",
    type: "Guidelines",
    owner: "Alex Morgan",
    status: "Published",
    updated: "Oct 24, 2026",
  },
  {
    id: "2",
    name: "Member onboarding",
    type: "Playbook",
    owner: "Jamie Park",
    status: "In review",
    updated: "Oct 22, 2026",
  },
  {
    id: "3",
    name: "Product direction",
    type: "Brief",
    owner: "Taylor Reed",
    status: "Draft",
    updated: "Oct 21, 2026",
  },
  {
    id: "4",
    name: "Research library",
    type: "Collection",
    owner: "Alex Morgan",
    status: "Published",
    updated: "Oct 18, 2026",
  },
  {
    id: "5",
    name: "A remarkably long project title that still needs to remain readable",
    type: "Brief",
    owner: "Morgan Lee",
    status: "Draft",
    updated: "Oct 15, 2026",
  },
];
export function ResourcesExample() {
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [items, setItems] = useState(initial);
  const visible = useMemo(
    () =>
      items
        .filter((item) =>
          `${item.name} ${item.type} ${item.owner} ${item.status}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))),
    [items, query, ascending],
  );
  const allSelected = visible.length > 0 && visible.every((item) => selected.includes(item.id));
  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          />
          <Input
            aria-label="Search resources"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="ps-10"
          />
        </div>
        <p className="type-caption text-muted" role="status">
          {visible.length} resources · {selected.length} selected
        </p>
      </div>
      <Card className="overflow-hidden p-0">
        <Table>
          <caption className="sr-only">Workspace resources</caption>
          <thead>
            <tr>
              <TableHead className="w-12">
                <Checkbox
                  aria-label="Select all visible resources"
                  checked={allSelected}
                  ref={(node) => {
                    if (node)
                      node.indeterminate =
                        !allSelected && visible.some((item) => selected.includes(item.id));
                  }}
                  onChange={() =>
                    setSelected((current) =>
                      allSelected
                        ? current.filter((id) => !visible.some((item) => item.id === id))
                        : [...new Set([...current, ...visible.map((item) => item.id)])],
                    )
                  }
                />
              </TableHead>
              <TableHead aria-sort={ascending ? "ascending" : "descending"}>
                <button
                  className="focus-ring inline-flex min-h-6 items-center gap-2 rounded-control"
                  onClick={() => setAscending((v) => !v)}
                >
                  Name
                  {ascending ? (
                    <ArrowUp aria-hidden="true" className="size-3" />
                  ) : (
                    <ArrowDown aria-hidden="true" className="size-3" />
                  )}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <TableRow key={item.id} data-selected={selected.includes(item.id)}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${item.name}`}
                    checked={selected.includes(item.id)}
                    onChange={() => toggle(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="type-label min-w-48 max-w-72 break-words">{item.name}</div>
                  <div className="type-caption text-muted">{item.type}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    tone={
                      item.status === "Published"
                        ? "success"
                        : item.status === "In review"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{item.owner}</TableCell>
                <TableCell className="whitespace-nowrap tabular-nums text-muted">
                  {item.updated}
                </TableCell>
                <TableCell>
                  <Menu>
                    <MenuTrigger asChild>
                      <IconButton label={`Actions for ${item.name}`}>
                        <MoreHorizontal aria-hidden="true" />
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent align="end">
                      <MenuItem
                        onSelect={() =>
                          setItems((current) =>
                            current.map((value) =>
                              value.id === item.id
                                ? {
                                    ...value,
                                    status: value.status === "Published" ? "Draft" : "Published",
                                  }
                                : value,
                            ),
                          )
                        }
                      >
                        {item.status === "Published" ? "Move to draft" : "Publish"}
                      </MenuItem>
                    </MenuContent>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {visible.length === 0 && (
          <EmptyState
            title="No resources found"
            description="Try a different name, owner, or status."
            action={
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        )}
      </Card>
      <p className="type-caption text-muted">
        A semantic table with search, sorting, selection, and row actions. All data is local.
      </p>
    </div>
  );
}
