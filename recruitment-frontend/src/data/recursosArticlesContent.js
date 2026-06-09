/** Contenido editorial completo por slug — enlazado desde /recursos/:slug */

export const RECURSOS_ARTICLES_CONTENT = {
  'entrevista-senior': {
    title: 'Dominando la Entrevista de Ingeniería Senior',
    category: 'Guías',
    readMin: 8,
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    intro:
      'En El Salvador, el salto de ingeniero mid a senior no se mide solo por años de experiencia, sino por cómo comunicas decisiones técnicas, liderazgo informal y criterio bajo presión. Esta guía resume lo que los equipos de hiring realmente evalúan en entrevistas de alto nivel.',
    sections: [
      {
        heading: 'Qué esperan los reclutadores técnicos',
        paragraphs: [
          'Un perfil senior debe demostrar que puede tomar decisiones con información incompleta. No basta con listar frameworks: necesitas explicar trade-offs, costos de mantenimiento y cómo priorizaste cuando el tiempo era limitado.',
          'En empresas locales y nearshore, muchos procesos combinan entrevista en español con ejercicio técnico en inglés. Prepara ejemplos concretos de arquitectura, incidentes resueltos y mentoría a perfiles junior.',
        ],
      },
      {
        heading: 'Preguntas técnicas frecuentes',
        paragraphs: [
          'Diseño de sistemas a escala moderada: APIs, colas, caché, observabilidad. No se busca perfección de FAANG, sino claridad en límites, puntos de falla y monitoreo.',
          'Calidad y deuda técnica: cómo introduces pruebas, revisiones de código y estándares sin frenar la entrega. Menciona métricas reales (tiempo de deploy, bugs en producción, cobertura útil).',
          'Seguridad básica en aplicaciones web: manejo de sesiones, validación de inputs, secretos y permisos por rol — especialmente relevante en fintech y BPO tecnológico en SV.',
        ],
      },
      {
        heading: 'La parte comportamental importa igual',
        paragraphs: [
          'Usa el método STAR con situaciones del mercado salvadoreño: equipos reducidos, presión de cliente, cambios de alcance. Ejemplo: “Coordiné con producto y QA para reducir reprocesos en un sprint crítico”.',
          'Evita hablar mal de empleadores anteriores. Enfócate en aprendizajes, no en culpas. Los hiring managers valoran madurez emocional en roles que interactúan con stakeholders.',
        ],
      },
      {
        heading: 'Plan de preparación en 5 días',
        paragraphs: [
          'Día 1–2: documenta 3 proyectos con contexto, tu rol, decisión clave y resultado medible.',
          'Día 3: practica un system design de 45 minutos en voz alta.',
          'Día 4: simula entrevista comportamental con un colega.',
          'Día 5: revisa tu CV y LinkedIn para que coincidan con las historias que contarás.',
        ],
      },
    ],
  },

  'trabajo-remoto': {
    title: 'El Futuro del Trabajo Remoto en El Salvador',
    category: 'Tendencias',
    readMin: 6,
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    intro:
      'El trabajo remoto dejó de ser excepción y pasó a ser un estándar negociable. En El Salvador, empresas de software, contact centers tecnológicos y startups están definiendo políticas híbridas que combinan talento local con clientes internacionales.',
    sections: [
      {
        heading: 'Del home office obligatorio al híbrido intencional',
        paragraphs: [
          'Tras la adopción masiva del remoto, muchas organizaciones regresaron a modelos híbridos 2–3 días en oficina. La tendencia no es volver atrás, sino elegir qué tareas requieren presencia: onboarding, lluvia de ideas, cultura.',
          'Para el profesional, esto abre negociación: horario flexible, días remotos fijos y equipamiento. Documenta tu productividad remota con entregables, no solo con horas conectado.',
        ],
      },
      {
        heading: 'Ventajas competitivas para talento salvadoreño',
        paragraphs: [
          'Zona horaria alineada con Estados Unidos, costo competitivo y creciente ecosistema de developers forman una propuesta sólida para empresas nearshore.',
          'Dominar inglés técnico y comunicación asíncrona (documentación clara, updates en Slack/Teams) multiplica oportunidades con equipos distribuidos.',
        ],
      },
      {
        heading: 'Desafíos que aún persisten',
        paragraphs: [
          'Conectividad y respaldo eléctrico siguen siendo variables en algunas zonas. Ten plan B: datos móviles, UPS o espacios de coworking.',
          'Aislamiento y límites trabajo–vida: agenda bloques de foco, pausas y reuniones con propósito. El burnout remoto es real y las empresas empiezan a medirlo.',
        ],
      },
      {
        heading: 'Qué pedir en tu próxima oferta',
        paragraphs: [
          'Política remota por escrito, presupuesto de internet o equipo, expectativas de disponibilidad y claridad sobre pagos en USD o colones.',
          'Pregunta cómo miden resultados: OKRs, entregas por sprint o KPIs de servicio. El remoto maduro se gestiona por outcomes, no por vigilancia.',
        ],
      },
    ],
  },

  'negociacion-salarial': {
    title: 'Estrategias de Negociación Salarial',
    category: 'Salarios',
    readMin: 10,
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Negociar compensación en El Salvador puede sentirse incómodo, pero es una habilidad profesional. La clave es llegar con datos del mercado, claridad sobre tu valor y alternativas reales — sin quemar la relación con el reclutador.',
    sections: [
      {
        heading: 'Investiga antes de la conversación',
        paragraphs: [
          'Reúne rangos por rol, años de experiencia y stack. Fuentes: ofertas publicadas, conversaciones con pares, consultoras locales y plataformas como Talentify SV.',
          'Distingue salario base, bonos, prestaciones, vacaciones y capacitación. A veces un paquete total compensa un base aparentemente bajo.',
        ],
      },
      {
        heading: 'El momento correcto',
        paragraphs: [
          'La mayor ventana de negociación es después de una oferta verbal o escrita, cuando ya demostraste fit. Evita fijar un número demasiado pronto en la primera llamada sin contexto.',
          'Si te presionan por expectativa salarial, responde con un rango basado en investigación: “Según mi experiencia y el mercado para este rol, estoy entre X y Y, abierto según el paquete completo”.',
        ],
      },
      {
        heading: 'Cómo argumentar sin sonar agresivo',
        paragraphs: [
          'Usa frases colaborativas: “Estoy muy entusiasmado con el rol. Con base en el alcance y mi experiencia liderando X, ¿hay flexibilidad para acercarnos a Y?”.',
          'Presenta evidencia: certificaciones, impacto medible, responsabilidades extra del puesto (on-call, inglés con cliente, liderazgo de equipo).',
        ],
      },
      {
        heading: 'Más allá del salario fijo',
        paragraphs: [
          'Negocia trabajo remoto, horario flexible, días de formación pagados, bono por desempeño, equipo (laptop/monitor) o revisión salarial a los 6 meses.',
          'Si no hay movimiento en efectivo, pide un plan de crecimiento por escrito: metas, fecha de revisión y rango objetivo.',
        ],
      },
    ],
  },

  'habilidades-2025': {
    title: 'Habilidades más Demandadas en 2025',
    category: 'IT',
    readMin: 5,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    intro:
      'El mercado laboral tecnológico en El Salvador sigue la misma ola global: IA aplicada, seguridad, cloud y datos. Pero la demanda local tiene matices — integración con sistemas legados, bilingüismo y versatilidad en equipos pequeños.',
    sections: [
      {
        heading: 'Inteligencia artificial aplicada',
        paragraphs: [
          'No se busca solo “saber de ChatGPT”. Las empresas valoran integración de LLMs en productos, automatización de flujos y evaluación de calidad/riesgo de respuestas.',
          'Habilidades útiles: prompting estructurado, RAG básico, APIs de OpenAI/Azure, y ética de datos al entrenar o consumir modelos.',
        ],
      },
      {
        heading: 'Ciberseguridad y cumplimiento',
        paragraphs: [
          'Con más servicios financieros y datos personales en la nube, roles de security analyst, pentesting junior y DevSecOps ganan terreno.',
          'Fundamentos que marcan diferencia: OWASP Top 10, gestión de identidades, backups y respuesta a incidentes.',
        ],
      },
      {
        heading: 'Cloud y automatización',
        paragraphs: [
          'AWS y Azure dominan ofertas nearshore. Terraform, CI/CD, contenedores y observabilidad (logs, métricas, alertas) son repetidos en vacantes mid/senior.',
          'En SV muchas empresas están en migración gradual: quien entienda legacy + cloud tiene ventaja.',
        ],
      },
      {
        heading: 'Soft skills que filtran candidatos',
        paragraphs: [
          'Comunicación clara con cliente, documentación en inglés y autonomía en trabajo remoto aparecen en casi todos los job descriptions senior.',
          'La curva de aprendizaje continua pesa más que un stack perfecto: demuestra cómo aprendiste una tecnología nueva en los últimos 12 meses.',
        ],
      },
    ],
  },

  'ctos-sv': {
    title: 'Entrevista con CTOs de El Salvador',
    category: 'Entrevistas',
    readMin: 12,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Conversamos con líderes tecnológicos de empresas de servicios, fintech y producto en San Salvador y Santa Ana. Comparten cómo arman equipos, qué miran en seniority y qué errores eliminan candidatos en la primera ronda.',
    sections: [
      {
        heading: '“Buscamos criterio, no memoria”',
        paragraphs: [
          'Carlos M., CTO en firma nearshore: “Un senior puede no conocer nuestra stack exacta, pero debe preguntar por el negocio antes de proponer arquitectura. Los rechazamos cuando solo recitan patrones sin contexto”.',
          'Recomendación: en entrevistas, pregunta por usuarios, volumen, SLA y presupuesto. Muestra que piensas como dueño del problema.',
        ],
      },
      {
        heading: 'Equipos pequeños, impacto amplio',
        paragraphs: [
          'Ana R., líder de ingeniería en startup local: “En SV muchos equipos son de 5–12 personas. Un mid con actitud de ownership vale más que un senior que solo quiere diseñar y no ejecutar”.',
          'Valoran historias de extremo a extremo: feature desde requisito hasta producción y monitoreo.',
        ],
      },
      {
        heading: 'Cultura y comunicación',
        paragraphs: [
          'Miguel T., CTO en BPO tecnológico: “El inglés no tiene que ser perfecto, pero la claridad sí. Necesitamos gente que escriba updates comprensibles para cliente en otra zona horaria”.',
          'La cultura se evalúa en cómo das feedback a pares y cómo admites errores. La arrogancia técnica es señal roja.',
        ],
      },
      {
        heading: 'Consejo final de los CTOs',
        paragraphs: [
          'Invierte en un portafolio o GitHub ordenado, aunque sea con 2–3 proyectos bien documentados.',
          'La referencia interna sigue siendo poderosa en El Salvador: participa en meetups, comunidades dev y mantén red activa en LinkedIn.',
        ],
      },
    ],
  },

  'marca-personal': {
    title: 'Tu Marca Personal en el Mercado Digital',
    category: 'Carrera',
    readMin: 7,
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Tu marca personal no es volverse influencer: es la historia coherente que cuentas sobre qué problemas resuelves, para quién y con qué resultados. En un mercado cada vez más conectado con clientes extranjeros, esa narrativa abre puertas.',
    sections: [
      {
        heading: 'Define tu propuesta en una frase',
        paragraphs: [
          'Ejemplo: “Desarrollador backend que ayuda a fintechs a integrar pagos y APIs seguras”. Evita títulos vacíos como “apasionado por la tecnología”.',
          'Alinea CV, LinkedIn y portafolio con esa frase. Los reclutadores escanean en segundos.',
        ],
      },
      {
        heading: 'LinkedIn que trabaja por ti',
        paragraphs: [
          'Foto profesional, titular específico, sección “Acerca de” con logros medibles y recomendaciones de colegas.',
          'Publica o comparte contenido con criterio: aprendizajes de proyectos, no solo memes tech. Una publicación al mes consistente supera diez virales sin contexto.',
        ],
      },
      {
        heading: 'Portafolio mínimo viable',
        paragraphs: [
          'Dos o tres casos con: problema, stack, tu rol, resultado (tiempo ahorrado, ingresos, usuarios, reducción de errores).',
          'Si no puedes mostrar código por NDA, describe arquitectura y decisiones sin revelar datos sensibles.',
        ],
      },
      {
        heading: 'Red local + visibilidad global',
        paragraphs: [
          'Participa en comunidades salvadoreñas de desarrollo, hackathons y charlas. La confianza local acelera referencias.',
          'Para clientes internacionales, mantén inglés en materiales clave y disponibilidad horaria explícita en tu perfil.',
        ],
      },
    ],
  },
};

/** Slug del artículo destacado en móvil → mismo contenido que trabajo remoto */
RECURSOS_ARTICLES_CONTENT['featured-ia'] = RECURSOS_ARTICLES_CONTENT['trabajo-remoto'];

export function getArticleBySlug(slug) {
  return RECURSOS_ARTICLES_CONTENT[slug] ?? null;
}
