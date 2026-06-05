import { Filter, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const TagFilter = ({ tags = [], selected = [], onToggle, onClear }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex shrink-0 items-center gap-2">
          <Filter className="h-4 w-4" />
          {selected.length ? `Tags (${selected.length})` : "Filter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 w-52 overflow-y-auto">
        {tags.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No tags yet
          </div>
        ) : (
          <>
            {selected.length > 0 && (
              <>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onClear();
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Clear filter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {tags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onSelect={(e) => {
                  e.preventDefault();
                  onToggle(tag);
                }}
              >
                <span className="mr-2 flex h-4 w-4 items-center justify-center">
                  {selected.includes(tag) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </span>
                #{tag}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TagFilter;
