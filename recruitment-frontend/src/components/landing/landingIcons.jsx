import {
  Rocket,
  Shield,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cloud,
  ShieldCheck,
  Brain,
  Code,
} from 'lucide-react';

const ICON_MAP = {
  rocket_launch: Rocket,
  rocket: Rocket,
  shield: Shield,
  brush: Palette,
  database: Database,
  smartphone: Smartphone,
  analytics: BarChart3,
  cloud: Cloud,
  verified_user: ShieldCheck,
  psychology: Brain,
  code: Code,
};

export function JobIcon({ iconKey, className = 'w-6 h-6 md:w-7 md:h-7' }) {
  const Icon = ICON_MAP[iconKey] || Code;
  return <Icon className={className} />;
}
