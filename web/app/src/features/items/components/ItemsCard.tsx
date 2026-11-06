// import { Badge } from "../../../../@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../../@/components/ui/card";
// import type { ItemResponse } from "../types";

// interface ItemCardProps {
//   item: ItemResponse;
// }

// export function ItemsCard({ item }: ItemCardProps) {
//   return (
//     <Card
//       key={item.id}
//       className="w-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 px-2"
//     >
//       <CardHeader className="flex items-center justify-between gap-5">
//         <CardTitle className="text-2xl">{item.name}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Badge variant={"secondary"}>{item.category}</Badge>
//       </CardContent>
//     </Card>
//   );
// }

import { Box, Calendar, Archive } from "lucide-react";
import { Badge } from "../../../../@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import type { ItemResponse } from "../types";
import { Link } from "react-router-dom";

interface ItemCardProps {
  item: ItemResponse;
}

export function ItemsCard({ item }: ItemCardProps) {
  // Check if a valid photo URL exists (ignoring empty strings or placeholders)
  const hasPhoto = Boolean(
    item.photo && item.photo.trim() !== "" && item.photo !== "string",
  );

  return (
    <Link to={`/items/${item.id}`}>
      <Card className="w-full flex flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          {/* ADDED: min-w-0 flex-1 to allow proper clipping */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Thumbnail / Image Box */}
            {hasPhoto ? (
              <img
                src={item.photo}
                alt={item.name}
                className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                <Box className="h-6 w-6" />
              </div>
            )}

            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <CardTitle
                className="text-lg font-bold line-clamp-2 leading-tight"
                title={item.name}
              >
                {item.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Archival Status Badge */}
          {item.isArchived && (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-amber-500/30 text-amber-500 bg-amber-500/10 shrink-0"
            >
              <Archive className="h-3 w-3" />
              Archived
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex items-center justify-between pt-4 mt-auto border-t border-border/40">
          <Badge variant="secondary" className="text-xs font-medium">
            {item.category}
          </Badge>

          {/* Date Added */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
