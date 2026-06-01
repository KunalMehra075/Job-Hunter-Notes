import { useState } from "react";
import { useSelector } from "react-redux";
import { Copy, Edit, Check, Trash2 } from "lucide-react";
import highlightText from "../utils/textHighlighter";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ParagraphCard = ({ title, paragraph, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const variables = useSelector((state) => state.variables.variables);

  const handleCopy = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      toast.error("Clipboard API not supported");
      return;
    }

    let textToCopy = `${paragraph}`;
    variables.forEach((v) => {
      textToCopy = textToCopy.split(`{{${v.key}}}`).join(v.value || "");
    });

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete();
  };

  const displayTitle = highlightText(title, variables);
  const displayParagraph = highlightText(paragraph, variables);

  return (
    <Card className="h-full w-full flex flex-col transition-all duration-300 hover:shadow-lg group relative">
      <div className="h-full w-full flex flex-col">
        {/* Action Buttons - Top Right (visible on hover) */}
        <div className="no-drag absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            title="Edit"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            title="Copy"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Card Content */}
        <CardHeader className="drag-handle pb-2 px-4 pt-4 pr-12 cursor-grab">
          <CardTitle
            className="text-base font-semibold break-words line-clamp-2"
            dangerouslySetInnerHTML={{ __html: displayTitle }}
          />
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            <div className="h-full overflow-y-auto">
              <p
                className="text-muted-foreground break-words whitespace-pre-wrap text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayParagraph }}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ParagraphCard;
