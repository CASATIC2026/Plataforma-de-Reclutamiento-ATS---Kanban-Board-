export const BILLING_DISCOUNT = 0.2;

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para equipos pequeños',
    monthlyPrice: 20,
    features: [
      'Hasta 3 vacantes activas',
      'Kanban básico',
      'Screening automático',
      '1 usuario reclutador',
    ],
    cta: 'Comenzar',
    ctaVariant: 'secondary',
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para empresas en crecimiento',
    monthlyPrice: 100,
    features: [
      'Vacantes ilimitadas',
      'Kanban + bandeja de rechazados',
      'Preguntas de screening personalizadas',
      'Hasta 5 usuarios',
      'Analíticas básicas',
    ],
    cta: 'Comenzar ahora',
    ctaVariant: 'primary',
    highlighted: true,
    badge: 'Más popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Multi-sede y compliance',
    priceLabel: 'Personalizado',
    features: [
      'Todo en Growth',
      'SSO / roles avanzados',
      'Soporte prioritario',
      'SLA dedicado',
    ],
    cta: 'Contactar ventas',
    ctaVariant: 'secondary',
    highlighted: false,
    isCustom: true,
  },
];

export const PRICING_FAQ = [
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer:
      'Sí. Puedes subir o bajar de plan cuando lo necesites. Los cambios se aplican en el siguiente ciclo de facturación.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjeta de crédito y débito, transferencia bancaria local y facturación corporativa para planes Enterprise.',
  },
  {
    question: '¿Hay prueba gratuita?',
    answer:
      'El plan Starter ($20/mes) te permite publicar y gestionar vacantes con funciones esenciales. Puedes escalar a Growth cuando necesites más capacidad.',
  },
  {
    question: '¿Los candidatos pagan por aplicar?',
    answer:
      'No. Talentify SV es gratuito para candidatos. Solo las empresas contratan un plan para publicar vacantes y gestionar postulaciones.',
  },
];

export const MOBILE_FAQ = [
  {
    question: '¿Puedo cambiar de plan después?',
    answer:
      'Sí, puedes cambiar de plan en cualquier momento desde la configuración de tu cuenta.',
  },
  {
    question: '¿Hay algún compromiso anual?',
    answer:
      'No hay compromiso obligatorio. El plan anual es opcional y te ahorra un 20% respecto al precio mensual.',
  },
  {
    question: '¿Qué incluye el soporte prioritario?',
    answer:
      'Incluye respuesta en menos de 4 horas hábiles, canal dedicado y acompañamiento en la configuración inicial.',
  },
];

export function formatPlanPrice(plan, billing) {
  if (plan.isCustom) return plan.priceLabel;
  const amount =
    billing === 'annual'
      ? Math.round(plan.monthlyPrice * (1 - BILLING_DISCOUNT))
      : plan.monthlyPrice;
  return `$${amount}`;
}
