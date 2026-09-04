export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { background: #ffffff !important; }`}</style>
      {children}
    </>
  );
}
