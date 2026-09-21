import { servicesInGroup } from "@/lib/services";

/** Grouped service list: service visits and installation are separate jobs. */
export function ServiceOptions({
  blankLabel,
  blankDisabled = false,
  valueKey = "name",
}: {
  blankLabel?: string;
  blankDisabled?: boolean;
  valueKey?: "name" | "slug";
}) {
  const groups = [
    { label: "Services", items: servicesInGroup("service") },
    { label: "Installation", items: servicesInGroup("installation") },
  ];

  return (
    <>
      {blankLabel ? (
        <option value="" disabled={blankDisabled}>
          {blankLabel}
        </option>
      ) : null}
      {groups.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.items.map((service) => (
            <option key={service.slug} value={valueKey === "slug" ? service.slug : service.name}>
              {service.name}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}
