/** Dados fixos compartilhados pelos três conceitos visuais (comparação justa). */

export const conceptVenue = {
  name: "Pérola Gastrobar",
  address: "Rua das Pedras, 120 — Centro",
  instagram: "@perolagastrobar",
  whatsapp: "(11) 98888-1010",
  hours: "Qui–Sáb 20h–04h",
  story:
    "Uma casa onde a cozinha encontra o palco. Noites curadas, camarotes reserváveis e o ritual de celebrar bem.",
};

export const conceptFeatured = {
  slug: "pagode-do-piska",
  title: "Pagode do Piska",
  dateLabel: "Sábado, 15 de agosto",
  shortDate: "15 AGO",
  weekday: "SÁB",
  timeLabel: "Abertura às 20h",
  attraction: "Piska e convidados",
  genre: "Pagode ao vivo",
  venue: "Pérola Gastrobar",
  availableCabins: 2,
  availabilityLabel: "2 camarotes disponíveis",
  heroImage:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
  heroImageMobile:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
  reserveHref: "/demo/reservar/pagode-do-piska",
  eventHref: "/demo/eventos/pagode-do-piska",
};

/** Somente eventos públicos (nunca rascunho). */
export const conceptUpcoming = [
  {
    id: "pub-1",
    title: "Pagode do Piska",
    dateLabel: "15 Ago",
    genre: "Pagode",
    availability: "2 camarotes",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    href: "/demo/eventos/pagode-do-piska",
  },
  {
    id: "pub-2",
    title: "Noite Pérola Soul",
    dateLabel: "22 Ago",
    genre: "Soul / R&B",
    availability: "Mesas abertas",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    href: "/demo/reservar/pagode-do-piska",
  },
  {
    id: "pub-3",
    title: "Samba na Casa",
    dateLabel: "29 Ago",
    genre: "Samba",
    availability: "Últimos espaços",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    href: "/demo/reservar/pagode-do-piska",
  },
];

export const conceptExperiences = [
  {
    id: "camarote",
    title: "Camarote",
    benefit: "Vista privilegiada e exclusivo para o seu grupo",
    capacity: "Até 10 pessoas",
    availability: "2 disponíveis nesta noite",
    image:
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=900&q=80",
    href: "/demo/reservar/pagode-do-piska",
  },
  {
    id: "mesa",
    title: "Mesa",
    benefit: "Perto da pista, ritmo e conversa",
    capacity: "Até 6 pessoas",
    availability: "Vagas nesta noite",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
    href: "/demo/reservar/pagode-do-piska",
  },
  {
    id: "aniversario",
    title: "Aniversário",
    benefit: "Pacote com destaque na casa e lista de convidados",
    capacity: "Sob medida",
    availability: "Reserve com antecedência",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    href: "/demo/reservar/pagode-do-piska",
  },
];

export const conceptCombos = [
  {
    id: "balde",
    name: "Balde Premium",
    composition: "6 cervejas geladas",
    price: "R$ 89,90",
    group: "Ideal para 2–3",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "neon",
    name: "Combo Neon",
    composition: "1 garrafa + 4 energéticos",
    price: "R$ 349,90",
    group: "Ideal para camarote",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "niver",
    name: "Pacote Aniversário",
    composition: "Decoração, mensagem no painel e espumante",
    price: "R$ 199,90",
    group: "Para celebrar",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
  },
];

export type ConceptMeta = {
  id: "a" | "b" | "c";
  name: string;
  intention: string;
  audience: string;
  strengths: string[];
  risks: string[];
};

export const conceptMetas: Record<"a" | "b" | "c", ConceptMeta> = {
  a: {
    id: "a",
    name: "Cinematic Night",
    intention: "Vender a noite como show — desejo e exclusividade",
    audience: "Quem busca camarote e clima de evento",
    strengths: [
      "Hero dominante",
      "Alta conversão percebida",
      "Clareza de disponibilidade",
    ],
    risks: ["Pode parecer ‘club app’ se a arte for genérica"],
  },
  b: {
    id: "b",
    name: "Editorial Premium",
    intention: "Gastronomia + música com sofisticação cultural",
    audience: "Público adulto premium / gastrobar",
    strengths: ["Diferenciação de marca", "Legibilidade", "Personalizável"],
    risks: ["Menos ‘energia de festa’ se mal calibrado"],
  },
  c: {
    id: "c",
    name: "Urban Live",
    intention: "Impacto de pôster urbano e cultura de eventos",
    audience: "Público jovem e redes sociais",
    strengths: ["Memorabilidade", "Mobile-first", "Compartilhável"],
    risks: ["Risco de ruído visual se exagerar tipografia"],
  },
};
