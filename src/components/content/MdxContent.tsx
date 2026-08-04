import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 font-display text-2xl font-bold tracking-tight" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 font-display text-xl font-bold tracking-tight" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-lg leading-relaxed text-hm-muted" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-hm-muted" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-hm-muted" {...props} />
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

export function MdxContent({ source }: { source: string }) {
  return (
    <article className="max-w-3xl">
      <MDXRemote source={source} components={components} />
    </article>
  );
}
