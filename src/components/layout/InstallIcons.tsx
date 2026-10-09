import type { ComponentType, SVGProps } from "react";

function InstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    />
  );
}

function AcInstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <InstallIcon {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9.2v5.6M9.2 12h5.6" />
    </InstallIcon>
  );
}

function HeatingInstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <InstallIcon {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="1.5" />
      <path d="M9 7.5h6M9 12h6M9 16.5h6" />
    </InstallIcon>
  );
}

function FurnaceInstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <InstallIcon {...props}>
      <rect x="3.5" y="4" width="11" height="16" rx="1.5" />
      <path d="M6.5 8h5M6.5 11.5h5" />
      <path d="M18.2 19.5c1.7-1 2.6-2.4 2.6-4.1 0-2.2-1.5-3.2-1.5-5.1 0 1.3-.7 2-1.3 2.4.3-2.2-.2-3.6-1.1-4.7.2 2.4-1.2 3.6-1.2 5.6 0 2 1.1 3.4 2.5 4.2" />
    </InstallIcon>
  );
}

function HeatPumpInstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <InstallIcon {...props}>
      <rect x="2.5" y="6.5" width="12" height="11" rx="1.5" />
      <circle cx="8.5" cy="12" r="2.4" />
      <path d="M17.5 7.5v4.2M17.5 7.5l-1.6 1.6M17.5 7.5l1.6 1.6" />
      <path d="M21.2 16.5v-4.2M21.2 16.5l-1.6-1.6M21.2 16.5l1.6-1.6" />
    </InstallIcon>
  );
}

function DuctlessInstallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <InstallIcon {...props}>
      <rect x="2.5" y="4" width="13" height="5.5" rx="1.5" />
      <path d="M5 12.2c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0" />
      <rect x="14.5" y="13" width="7" height="7" rx="1.2" />
      <circle cx="18" cy="16.5" r="1.6" />
    </InstallIcon>
  );
}

export const installationIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "ac-installation": AcInstallIcon,
  "heating-installation": HeatingInstallIcon,
  "gas-furnace-installation": FurnaceInstallIcon,
  "heat-pump-installation": HeatPumpInstallIcon,
  "ductless-package-installation": DuctlessInstallIcon,
};
