import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Droplets,
  Fan,
  Flame,
  Gauge,
  Layers,
  Snowflake,
  SunMedium,
  Thermometer,
  Waves,
  Wind,
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  "ac-repair-installation": Snowflake,
  heating: Thermometer,
  "gas-furnace": Flame,
  "heat-pump": SunMedium,
  "ductless-mini-split": AirVent,
  "package-unit": Gauge,
  ventilation: Wind,
  ductwork: Waves,
  insulation: Layers,
  "indoor-air-quality": Droplets,
  "pool-heat-pump": Fan,
};
