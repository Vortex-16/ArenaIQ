// ArenaIQ Mock Data & Local Knowledge Base

export const STADIUMS = {
  metlife: {
    id: 'metlife',
    name: 'MetLife Stadium (NY/NJ)',
    capacity: 82500,
    gates: ['Gate A (North)', 'Gate B (East)', 'Gate C (South)', 'Gate D (West)'],
    facilities: {
      concessions: [
        { id: 'c1', name: 'Libertad Tacos', location: 'Sec 104', waitTime: 8, popular: 'Chipotle Chicken Taco' },
        { id: 'c2', name: 'Gridiron Burgers & Dogs', location: 'Sec 112', waitTime: 18, popular: 'World Cup Combo' },
        { id: 'c3', name: 'MetLife Craft Brews', location: 'Sec 122', waitTime: 5, popular: 'Jersey Amber Lager' },
        { id: 'c4', name: 'FIFA Official Megastore', location: 'Sec 130', waitTime: 25, popular: 'USA/MEX/CAN Match Ball' },
        { id: 'c5', name: 'Halal Cart Classic', location: 'Sec 204', waitTime: 12, popular: 'Chicken Over Rice' },
        { id: 'c6', name: 'Maple Leaf Waffles', location: 'Sec 224', waitTime: 15, popular: 'Sweet Berries Waffle' }
      ],
      restrooms: [
        { id: 'r1', gender: 'Men', location: 'Sec 102', waitTime: 4 },
        { id: 'r2', gender: 'Women', location: 'Sec 106', waitTime: 12 },
        { id: 'r3', gender: 'Men', location: 'Sec 118', waitTime: 15 },
        { id: 'r4', gender: 'Women', location: 'Sec 120', waitTime: 5 },
        { id: 'r5', gender: 'Family/All-Gender', location: 'Sec 110', waitTime: 3 }
      ]
    }
  },
  sofi: {
    id: 'sofi',
    name: 'SoFi Stadium (Los Angeles)',
    capacity: 70240,
    gates: ['Gate 1 (North)', 'Gate 2 (East)', 'Gate 3 (South)', 'Gate 4 (West)'],
    facilities: {
      concessions: [
        { id: 'sc1', name: 'Pacific Coast Tacos', location: 'Sec 103', waitTime: 22, popular: 'Baja Fish Taco' },
        { id: 'sc2', name: 'Canyon Burgers', location: 'Sec 115', waitTime: 14, popular: 'Double Smash Burger' },
        { id: 'sc3', name: 'Golden State Hops', location: 'Sec 128', waitTime: 4, popular: 'LA IPA' },
        { id: 'sc4', name: 'FIFA Megastore', location: 'Sec 101', waitTime: 30, popular: 'Official Tournament Jersey' }
      ],
      restrooms: [
        { id: 'sr1', gender: 'Men', location: 'Sec 104', waitTime: 6 },
        { id: 'sr2', gender: 'Women', location: 'Sec 108', waitTime: 18 },
        { id: 'sr3', gender: 'Family/All-Gender', location: 'Sec 120', waitTime: 2 }
      ]
    }
  },
  mercedes: {
    id: 'mercedes',
    name: 'Mercedes-Benz Stadium (Atlanta)',
    capacity: 71000,
    gates: ['Gate 1 (Vance)', 'Gate 2 (North)', 'Gate 3 (East)', 'Gate 4 (South)'],
    facilities: {
      concessions: [
        { id: 'mc1', name: 'Atlanta Southern Fry', location: 'Sec 105', waitTime: 15, popular: 'Hot Chicken Sliders' },
        { id: 'mc2', name: 'Fan First Hotdogs ($1.50!)', location: 'Sec 118', waitTime: 20, popular: 'Classic Fan Dog' },
        { id: 'mc3', name: 'Peachtree Craft Soda & Beer', location: 'Sec 135', waitTime: 3, popular: 'Peach Sweet Tea' },
        { id: 'mc4', name: 'FIFA Store', location: 'Sec 122', waitTime: 10, popular: 'Tournament Scarf' }
      ],
      restrooms: [
        { id: 'mr1', gender: 'Men', location: 'Sec 103', waitTime: 5 },
        { id: 'mr2', gender: 'Women', location: 'Sec 109', waitTime: 14 },
        { id: 'mr3', gender: 'Family/All-Gender', location: 'Sec 130', waitTime: 4 }
      ]
    }
  }
};

export const INITIAL_INCIDENTS = [
  {
    id: 'inc-101',
    type: 'Crowd Congestion',
    location: 'Gate C (South)',
    description: 'Turnstile scanners 4 and 5 are failing, causing a backup of 400+ fans. Average entry delay is now 25 minutes.',
    status: 'Active',
    priority: 'Critical',
    timestamp: '10:45 AM',
    assignedTo: null,
    resolution: null
  },
  {
    id: 'inc-102',
    type: 'Safety Hazard',
    location: 'Concourse Sec 102',
    description: 'Large soda and beer spill near the handicap entrance. Slippery floor causing safety risk for fans.',
    status: 'Active',
    priority: 'High',
    timestamp: '10:55 AM',
    assignedTo: null,
    resolution: null
  },
  {
    id: 'inc-103',
    type: 'Accessibility',
    location: 'Gate A (North)',
    description: 'An elderly fan in a wheelchair requires an escort to Suite level. Shuttle driver is currently offline.',
    status: 'Active',
    priority: 'Medium',
    timestamp: '11:00 AM',
    assignedTo: null,
    resolution: null
  },
  {
    id: 'inc-104',
    type: 'Logistics',
    location: 'Concession Sec 112',
    description: 'Gridiron Burgers is running out of biodegradable cups. Needs immediate restocking from main warehouse.',
    status: 'Resolved',
    priority: 'Low',
    timestamp: '10:15 AM',
    assignedTo: 'Logistics Crew A',
    resolution: 'Delivered 5 boxes of eco-cups. Stock updated.'
  }
];

export const RESOURCE_CREWS = [
  { id: 'crew-sec-1', name: 'Security Response Alpha', role: 'Security', location: 'Gate B', status: 'Available' },
  { id: 'crew-sec-2', name: 'Security Response Bravo', role: 'Security', location: 'Gate D', status: 'Busy' },
  { id: 'crew-med-1', name: 'First Aid Team Red', role: 'Medical', location: 'Section 110 (First Aid Station)', status: 'Available' },
  { id: 'crew-maint-1', name: 'Janitorial Rapid Response', role: 'Janitorial', location: 'Section 120', status: 'Available' },
  { id: 'crew-vol-1', name: 'Volunteer Host Group Blue', role: 'Volunteer', location: 'Gate A Info Desk', status: 'Available' }
];

export const LOCAL_KNOWLEDGE = {
  en: {
    greetings: ["Hello! I am ArenaIQ, your GenAI matchday assistant. How can I help you experience the FIFA World Cup 2026 today?", "Welcome to the match! Ask me about seats, gates, transport, prohibited items, or sustainability."],
    prohibited: `The following items are prohibited inside FIFA World Cup 2026 stadiums:
1. Bags larger than A4 size (backpacks, large purses)
2. Professional cameras with detachable lenses & selfie sticks
3. Weapons of any kind, flares, fireworks, or lasers
4. Outside food and beverages (except for medical/infant needs)
5. Glass bottles, metal cans, and thermos containers`,
    accessibility: `We are committed to an inclusive experience for all fans:
* **Wheelchair Access**: Available at all gates with ramps and dedicated elevators. Dedicated wheelchair seating is at Sections 102, 115, 128, and Suite levels.
* **Sensory Rooms**: Quiet spaces for fans with sensory needs are located on Concourse Level 1 near Section 110.
* **Audio Descriptive Commentary**: Headsets can be borrowed for free at the Gate A Fan Information Desk.
* **Accessibility Shuttles**: Available pre/post match from Parking Lots C & F directly to Gates A & C.`,
    transport: `Transportation to and from the stadium:
* **Train / Transit**: The Stadium Express metro leaves every 5 minutes from the central transit terminal directly to the Stadium Central Station (5-minute walk to Gate B).
* **Rideshare**: Pick-up and drop-off are strictly located at Lot E (West Concourse).
* **Parking**: Pre-booking is mandatory via the FIFA App. Lots open 4 hours before kick-off.
* **Shuttles**: Free park-and-ride shuttles operate from the North Park terminal.`,
    sustainability: `Help us make this the greenest World Cup in history:
* **Recycling**: Use the Green Bins for bottles/cans and Blue Bins for compostable food trays.
* **Water Stations**: Bring empty reusable plastic bottles (under 500ml) to fill at free water hydrants throughout the concourse.
* **Transit Reward**: Log your train/bus ride in our Green Goal Tracker to unlock a 15% discount on official merchandise!`,
    notfound: "I understand you are asking about that! Here is what I can tell you: during the FIFA World Cup 2026, stadium gates open 3 hours before kick-off. Make sure to arrive early, use public transit, and have your digital ticket ready. Let me know if you need specific gate, restroom, or transit details!"
  },
  es: {
    greetings: ["¡Hola! Soy ArenaIQ, tu asistente digital para el Mundial de la FIFA 2026. ¿En qué puedo ayudarte hoy?", "¡Bienvenido al partido! Pregúntame sobre accesos, transporte, objetos prohibidos o sustentabilidad."],
    prohibited: `Los siguientes objetos están prohibidos dentro de los estadios de la Copa Mundial de la FIFA 2026:
1. Bolsos o mochilas más grandes que el tamaño A4
2. Cámaras profesionales con lentes desmontables y bastones para selfis
3. Armas de cualquier tipo, bengalas, fuegos artificiales o láseres
4. Alimentos y bebidas del exterior (excepto por necesidades médicas o infantiles)
5. Botellas de vidrio, latas de metal y termos`,
    accessibility: `Estamos comprometidos con una experiencia inclusiva:
* **Sillas de ruedas**: Rampas y elevadores en todas las puertas. Lugares reservados en Secciones 102, 115, y 128.
* **Salas Sensoriales**: Espacios tranquilos ubicados en el Nivel Concourse 1, cerca de la Sección 110.
* **Comentarios de Audio descriptivos**: Audífonos gratuitos en el Módulo de Información de la Puerta A.`,
    transport: `Transporte hacia y desde el estadio:
* **Metro / Tren**: El metro rápido sale cada 5 minutos hacia la Estación Central (5 min caminando a Puerta B).
* **Viajes compartidos (Uber/Taxi)**: Zona de abordaje exclusiva en el Lote E (Concourse Oeste).
* **Estacionamiento**: Reserva obligatoria en la App de la FIFA. Lotes abren 4 horas antes del partido.`,
    sustainability: `Ayúdanos a lograr el Mundial más sustentable:
* **Reciclaje**: Botes verdes para botellas y botes azules para platos compostables.
* **Hidratación**: Trae botellas de plástico vacías (menos de 500ml) para rellenar gratis.
* **Premios Verdes**: ¡Registra tu viaje en transporte público y obtén 15% de descuento en la tienda oficial!`,
    notfound: "¡Entiendo tu pregunta! Para el Mundial 2026, las puertas abren 3 horas antes del partido. Por favor llega con tiempo, usa transporte público y ten tu boleto digital listo. ¡Dime si necesitas más detalles!"
  },
  fr: {
    greetings: ["Bonjour! Je suis ArenaIQ, votre assistant de match pour la Coupe du Monde de la FIFA 2026. Comment puis-je vous aider?", "Bienvenue au match! Posez-moi des questions sur les places, les transports, ou le développement durable."],
    prohibited: `Les objets suivants sont interdits dans les stades de la Coupe du Monde de la FIFA 2026 :
1. Sacs plus grands que le format A4 (sacs à dos, grands sacs à main)
2. Appareils photo professionnels avec objectifs interchangeables et perches à selfie
3. Armes de toutes sortes, fumigènes, feux d'artifice ou lasers
4. Nourriture et boissons extérieures (sauf besoins médicaux/infantiles)
5. Bouteilles en verre, canettes métalliques et bouteilles isothermes`,
    accessibility: `Nous nous engageons à offrir une expérience inclusive :
* **Accès en fauteuil roulant**: Disponible à toutes les portes avec rampes et ascenseurs. Places réservées aux sections 102, 115, 128.
* **Salles sensorielles**: Espaces calmes sur le Concourse Niveau 1 près de la section 110.
* **Commentaire audio-descriptif**: Casques gratuits au guichet d'information de la Porte A.`,
    transport: `Transports vers et depuis le stade :
* **Train / Transports en commun**: Le métro Stadium Express part toutes les 5 minutes de la gare centrale vers la station Stadium Central.
* **Rideshare (Uber/Lyft)**: Dépôt et prise en charge uniquement au parking E (West Concourse).
* **Parking**: Réservation obligatoire sur l'application FIFA. Ouverture 4 heures avant le coup d'envoi.`,
    sustainability: `Aidez-nous à faire de cette Coupe du Monde la plus verte de l'histoire :
* **Recyclage**: Bacs verts pour bouteilles/canettes, bacs bleus pour barquettes compostables.
* **Points d'eau**: Apportez des bouteilles en plastique vides (moins de 500 ml) pour les remplir gratuitement.
* **Récompense Éco**: Enregistrez votre trajet en train/bus pour débloquer 15% de réduction sur la boutique officielle !`,
    notfound: "Je comprends votre question ! Pour la Coupe du Monde 2026, les portes ouvrent 3 heures avant le match. Arrivez tôt et préparez votre billet numérique. Comment puis-je vous aider d'autre ?"
  }
};
