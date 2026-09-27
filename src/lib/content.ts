// Homepage copy and imagery. Edit freely — nothing else depends on the wording.

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const content = {
  hero: {
    eyebrow: "New festive collection",
    title: "Bangles for every wrist, every occasion.",
    body: "Gold-plated sets, bridal kadas, glass and silk-thread bangles — handpicked, available in every size, and ordered in one tap on WhatsApp.",
    image: unsplash("1724720790533-160d6280fd81"),
    imageAlt: "Woman wearing a stack of colourful bangles",
  },

  highlights: [
    { title: "All sizes", body: "2.2 to 2.10 — or tell us your size on chat" },
    { title: "Handpicked designs", body: "Every piece checked before it ships" },
    { title: "Order on WhatsApp", body: "No sign-up, no card — just chat" },
    { title: "Real humans", body: "Ask us anything before you buy" },
  ],

  steps: [
    { title: "Pick your design", body: "Browse the collection and open any bangle to see details and price." },
    { title: "Choose size & quantity", body: "Select your bangle size and how many you need. Not sure? See the size guide." },
    { title: "Order on WhatsApp", body: "Tap Buy — your order is typed out for you. We confirm payment and delivery on chat." },
  ],

  story: {
    title: "Tradition you can wear every day",
    body: "From the jingle of glass bangles at a mehndi to a single gold kada at the office, bangles carry stories. We source from trusted artisans and wholesalers so you get beautiful pieces at honest prices.",
    image: unsplash("1634957975483-17a583180cbf"),
    imageAlt: "Rows of gold bangles on display at a market stall",
  },

  // Standard Indian/Pakistani bangle sizing — inner diameter.
  sizeGuide: {
    intro: "Bangle sizes are written like 2.4 — that means 2 and 4/16 inches across the inside. Measure a bangle that fits you well, edge to edge on the inside.",
    rows: [
      { size: "2.2", inches: "2⅛ in", mm: "54.0 mm" },
      { size: "2.4", inches: "2¼ in", mm: "57.2 mm" },
      { size: "2.6", inches: "2⅜ in", mm: "60.3 mm" },
      { size: "2.8", inches: "2½ in", mm: "63.5 mm" },
      { size: "2.10", inches: "2⅝ in", mm: "66.7 mm" },
    ],
  },

  faq: [
    {
      q: "How do I pay?",
      a: "After you tap Buy on WhatsApp we confirm availability, delivery charges and payment options with you directly on chat.",
    },
    {
      q: "What if the size doesn't fit?",
      a: "Message us on WhatsApp — we'll help you with an exchange for a different size where possible.",
    },
    {
      q: "Can I order more than one design?",
      a: "Yes. Send one order per design, or just list everything in the same WhatsApp chat.",
    },
    {
      q: "Do you take bulk or wedding orders?",
      a: "Absolutely. Chat with us on WhatsApp with the designs, sizes and quantities you need.",
    },
  ],
}
