import Image from "next/image";
import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/Button";
import { getUserMessages, getUserProjects } from "@/lib/portal-data";
import { requirePortalUser } from "@/lib/portal-session";

const statusColor: Record<string, string> = {
  Scheduled: "bg-sky-100 text-sky-800",
  "In Progress": "bg-amber-100 text-amber-900",
  Completed: "bg-emerald-100 text-emerald-800",
  "Estimate Ready": "bg-red-100 text-red-800",
};

export default async function PortalDashboardPage() {
  const user = await requirePortalUser();
  const projects = getUserProjects(user.id);
  const messages = getUserMessages(user.id);
  const docs = projects.flatMap((p) => p.documents).length;

  return (
    <PortalShell userName={user.name}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
            Client portal ? demo
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-hm-charcoal">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-hm-muted">{user.address}</p>
        </div>
        <Button href="/portal/request">Request service</Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Active projects",
            value: String(projects.filter((p) => p.status !== "Completed").length),
          },
          {
            label: "Messages",
            value: String(messages.length),
          },
          { label: "Documents", value: String(docs) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-hm-line bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-sm text-hm-muted">{stat.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-hm-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-hm-charcoal">Your projects</h2>
        </div>
        <div className="mt-4 grid gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portal/projects/${project.id}`}
              className="group overflow-hidden rounded-2xl border border-hm-line bg-white shadow-sm transition hover:border-hm-red/35 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                {project.photos[0] && (
                  <div className="relative h-40 w-full shrink-0 md:h-auto md:w-52">
                    <Image
                      src={project.photos[0].url}
                      alt={project.photos[0].label}
                      fill
                      sizes="208px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-hm-charcoal group-hover:text-hm-red">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-hm-muted">
                        {project.service} ? {project.city}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-hm-muted">{project.summary}</p>
                  {project.nextAppointment && (
                    <p className="mt-3 text-sm font-semibold text-hm-charcoal">
                      Next: {project.nextAppointment}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PortalShell>
  );
}
