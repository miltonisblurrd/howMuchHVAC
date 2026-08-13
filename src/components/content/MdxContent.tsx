import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { getTextFromChildren, slugifyHeading } from "@/lib/blog";
import { cn } from "@/lib/cn";

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextFromChildren(props.children);
    const id = props.id || slugifyHeading(text);
    return (
      <h2
        id={id}
        className="mt-12 scroll-mt-28 font-display text-2xl font-bold tracking-tight text-hm-charcoal md:text-[1.75rem]"
        {...props}
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextFromChildren(props.children);
    const id = props.id || slugifyHeading(text);
    return (
      <h3
        id={id}
        className="mt-8 scroll-mt-28 font-display text-xl font-bold tracking-tight text-hm-charcoal"
        {...props}
      />
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-lg leading-relaxed text-hm-muted" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-hm-muted" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg text-hm-muted" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-hm-charcoal" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 border-hm-red bg-hm-fog/70 px-5 py-4 text-lg leading-relaxed text-hm-charcoal"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-hm-line" />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mt-6 overflow-x-auto rounded-xl border border-hm-line">
      <table className="w-full min-w-[480px] text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-hm-fog font-display text-hm-charcoal" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-bold" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-hm-line px-4 py-3 text-hm-muted" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = props.href ?? "#";
    if (href.startsWith("/")) {
      return (
        <Link href={href} className="font-semibold text-hm-red underline-offset-2 hover:underline">
          {props.children}
        </Link>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a {...props} className="font-semibold text-hm-red underline-offset-2 hover:underline" />
      );
    }
    return (
      <a
        {...props}
        className="font-semibold text-hm-red underline-offset-2 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  },
};

export function MdxContent({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("blog-prose", className)}>
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
