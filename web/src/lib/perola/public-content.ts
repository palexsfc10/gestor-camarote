/**
 * Conteúdo público central do Pérola — Cinematic Urban Experience.
 * Extraído com segurança dos materiais reais; itens incertos marcados.
 */

export const perolaAssets = {
  logo: "/perola/brand/perola-logo-dark.png",
  mark: "/perola/brand/perola-mark.png",
  venueSign: "/perola/venue/perola-venue-sign.jpeg",
  birthday: "/perola/birthday/birthday-packages.png",
  gastronomy: "/perola/gastronomy/dadinhos-tapioca.jpeg",
} as const;

export const perolaVenue = {
  name: "Pérola Gastrobar",
  tagline: "Música, gastronomia e experiências em Osasco.",
  address: "Rua São Maurício, 462 — KM18, Osasco",
  whatsapp: "(11) 91504-3129",
  whatsappHref: "https://wa.me/5511915043129",
  instagram: "@perola.gastrobar",
  instagramHref: "https://instagram.com/perola.gastrobar",
};

export type PublicEventCard = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  weekday: string;
  dateLabel: string;
  timeLabel: string;
  category: string;
  posterImage: string;
  attractions: string;
  entryNote?: string;
  promoNote?: string;
  reservationsOpen: boolean;
  featured: boolean;
  /** Links to reservation demo when true */
  reserveSlug?: string;
  pendingConfirmation?: string[];
};

/**
 * Programação baseada nas artes reais.
 * Datas/horários e preços só quando legíveis com segurança.
 */
export const perolaWeekEvents: PublicEventCard[] = [
  {
    id: "pub-29jul",
    slug: "perola-90-ventao",
    title: "Pérola 90 Ventão",
    subtitle: "Pagode de mesa",
    weekday: "QUA",
    dateLabel: "29 Jul",
    timeLabel: "A partir das 15h",
    category: "Pagode",
    posterImage: "/perola/events/event-perola-90-ventao-29jul.jpeg",
    attractions: "Grupo Ki Vibe, Brunaum e convidado Tikão",
    entryNote: "Entrada a partir de R$ 19,90 (janela promocional)",
    promoNote: "Buffet de petisco à vontade",
    reservationsOpen: true,
    featured: false,
    pendingConfirmation: [
      "Validade completa dos preços de bebida no cardápio digital",
    ],
  },
  {
    id: "pub-30jul",
    slug: "sertaneja-quintaneja",
    title: "Sertaneja Quintaneja",
    subtitle: "Noite sertaneja",
    weekday: "QUI",
    dateLabel: "30 Jul",
    timeLabel: "17h",
    category: "Sertanejo",
    posterImage: "/perola/events/event-sertaneja-quintaneja-30jul.jpeg",
    attractions: "Katia Lins",
    promoNote: "Promoções de cerveja e pratos até horários indicados na arte",
    reservationsOpen: true,
    featured: false,
  },
  {
    id: "pub-31jul",
    slug: "pagode-do-piska",
    title: "Pizeiro Sertanejo",
    subtitle: "Com Rodrigo Piska",
    weekday: "SEX",
    dateLabel: "31 Jul",
    timeLabel: "16h",
    category: "Sertanejo / Piseiro",
    posterImage: "/perola/events/event-pizeiro-sertanejo-31jul.jpeg",
    attractions: "Vinicius Schaaf, John Levado e Rodrigo Piska",
    entryNote: "Mulher VIP a noite toda (conforme arte)",
    promoNote: "Noite Heineken e Corona",
    reservationsOpen: true,
    featured: true,
    reserveSlug: "pagode-do-piska",
    pendingConfirmation: [
      "Alinhar nome comercial ‘Pagode do Piska’ vs arte ‘Pizeiro Sertanejo’ para o fluxo de reserva da demo",
    ],
  },
  {
    id: "pub-01ago-day",
    slug: "pagode-feijoada-01ago",
    title: "Pagode ao Vivo",
    subtitle: "Buffet de feijoada",
    weekday: "SÁB",
    dateLabel: "01 Ago",
    timeLabel: "12h",
    category: "Pagode + Gastronomia",
    posterImage: "/perola/events/event-pagode-feijoada-01ago.jpeg",
    attractions: "Brunaum",
    entryNote: "Feijoada Mulher R$ 24,90 · Homem R$ 34,90 (12h–16h)",
    reservationsOpen: true,
    featured: false,
  },
  {
    id: "pub-01ago-night",
    slug: "sabado-sertanejo-01ago",
    title: "Sábado Sertanejo",
    subtitle: "Aniversário Juann Cateli",
    weekday: "SÁB",
    dateLabel: "01 Ago",
    timeLabel: "20h",
    category: "Sertanejo",
    posterImage: "/perola/events/event-sabado-sertanejo-01ago.jpeg",
    attractions:
      "Juann Cateli, Ketelyn Kelly, Delluka Vieira, Katia Lins, Roni Reis, Rodrigo Piska",
    entryNote: "Mulher VIP até 20h · Homem R$ 15 (conforme arte)",
    reservationsOpen: true,
    featured: false,
  },
  {
    id: "pub-02ago-day",
    slug: "domingo-pagode-samba",
    title: "Domingo Pagode × Samba",
    subtitle: "Buffet rústico + parmegiana",
    weekday: "DOM",
    dateLabel: "02 Ago",
    timeLabel: "12h",
    category: "Pagode / Samba",
    posterImage: "/perola/events/event-domingo-pagode-samba-02ago.jpeg",
    attractions: "Renato Cardoso // Ki Vibe",
    entryNote: "Entrada Mulher R$ 24,90 · Homem R$ 34,90 (conforme arte)",
    reservationsOpen: true,
    featured: false,
  },
  {
    id: "pub-02ago-night",
    slug: "noite-do-piseiro",
    title: "Noite do Piseiro",
    weekday: "DOM",
    dateLabel: "02 Ago",
    timeLabel: "20h",
    category: "Piseiro",
    posterImage: "/perola/events/event-noite-piseiro-02ago.jpeg",
    attractions: "John Levado // Paulinho Cantor",
    entryNote: "Mulher VIP até 23h · Homem R$ 15 (conforme arte)",
    reservationsOpen: true,
    featured: false,
  },
];

export const birthdayPackages = [
  {
    id: "b10",
    guests: 10,
    includes: "Bolo, convite digital, 1 gin double",
    vip: "1 VIP",
  },
  {
    id: "b15",
    guests: 15,
    includes: "Bolo, convite digital, 1 Chandon",
    vip: "2 VIPs",
  },
  {
    id: "b20",
    guests: 20,
    includes: "Bolo, convite digital, 1 Jack Daniel’s",
    vip: "3 VIPs",
  },
  {
    id: "b30",
    guests: 30,
    includes: "Bolo, convite digital, Chandon e Jack Daniel’s",
    vip: "5 VIPs",
  },
];

export const gastronomyHighlights = [
  {
    id: "g1",
    title: "Dadinhos de tapioca",
    description: "Petisco da casa — atmosfera de bar à noite",
    image: perolaAssets.gastronomy,
  },
  {
    id: "g2",
    title: "Buffet e promoções",
    description: "Feijoada, petiscos e combos divulgados nas artes da semana",
    image: "/perola/events/event-pagode-feijoada-01ago.jpeg",
  },
  {
    id: "g3",
    title: "Bebidas da noite",
    description: "Heinekens, Coronas e gin em janelas promocionais",
    image: "/perola/events/event-noite-piseiro-02ago.jpeg",
  },
];

export const contentPendingConfirmation = [
  "Endereço e WhatsApp confirmados nas artes; validar telefone fixo e horário fixo de funcionamento com a casa.",
  "Preços de entrada e promoções variam por arte — não usar OCR como fonte única no cadastro.",
  "Alinhar o evento de reserva da demo (‘Pagode do Piska’ / slug pagode-do-piska) com a arte comercial oficial escolhida pelo cliente.",
  "Detalhes finos dos pacotes de aniversário (regras VIP, validade) a confirmar comercialmente.",
];

export function getPublicEventBySlug(slug: string) {
  return perolaWeekEvents.find((e) => e.slug === slug);
}
