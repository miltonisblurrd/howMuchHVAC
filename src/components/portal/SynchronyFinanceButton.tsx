import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function SynchronyFinanceButton({ className }: { className?: string }) {
  return (
    <Button
      href={site.synchrony.applyUrl}
      variant="outline"
      size="sm"
      arrow={false}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {site.synchrony.label}
    </Button>
  );
}
