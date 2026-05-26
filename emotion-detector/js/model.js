
let mobileNetModel = null;

const TRADUCCIONES = {
  // Personas y ropa
  "suit": "traje",
  "lab coat, laboratory coat": "bata de laboratorio",
  "necktie": "corbata",
  "bow tie": "corbatín",
  "sunglasses": "lentes de sol",
  "glasses": "lentes",
  "mask": "mascarilla",
  "wig": "peluca",
  "jersey": "camiseta deportiva",
  "sweatshirt": "sudadera",
  "cardigan": "cardigan",
  "academic gown": "toga académica",
  "mortarboard": "birrete",

  // Objetos de oficina / electrónica
  "cellular telephone, cellular phone, cellphone, cell, mobile phone": "teléfono celular",
  "laptop, laptop computer": "laptop",
  "desktop computer": "computadora de escritorio",
  "monitor": "monitor",
  "keyboard, computer keyboard": "teclado",
  "mouse, computer mouse": "mouse",
  "screen, CRT screen": "pantalla",
  "television, television system": "televisión",
  "remote control, remote": "control remoto",
  "printer": "impresora",
  "projector": "proyector",
  "microphone, mike": "micrófono",
  "headphone, earphone": "audífonos",
  "speaker": "parlante",
  "radio, wireless": "radio",
  "clock": "reloj de pared",
  "digital clock": "reloj digital",
  "wall clock": "reloj de pared",
  "wristwatch": "reloj de pulsera",
  "camera": "cámara",
  "tripod": "trípode",
  "web site, website, internet site, site": "sitio web",

  // Médico / salud
  "stethoscope": "estetoscopio",
  "syringe": "jeringa",
  "bandage": "vendaje",
  "stretcher": "camilla",
  "oxygen mask": "máscara de oxígeno",

  // Animales
  "cat": "gato",
  "dog": "perro",
  "bird": "pájaro",
  "fish": "pez",
  "horse": "caballo",
  "cow": "vaca",
  "sheep": "oveja",
  "pig": "cerdo",
  "chicken": "pollo",
  "duck": "pato",
  "rabbit": "conejo",
  "hamster": "hámster",
  "lion": "león",
  "tiger": "tigre",
  "elephant": "elefante",
  "giraffe": "jirafa",
  "zebra": "cebra",
  "bear": "oso",
  "wolf": "lobo",
  "fox": "zorro",
  "deer": "ciervo",
  "monkey": "mono",
  "snake": "serpiente",
  "frog": "rana",
  "turtle": "tortuga",

  // Vehículos
  "car": "auto",
  "bus": "bus",
  "truck": "camión",
  "bicycle": "bicicleta",
  "motorcycle": "motocicleta",
  "airplane": "avión",
  "helicopter": "helicóptero",
  "boat": "bote",
  "ship": "barco",
  "train": "tren",
  "ambulance": "ambulancia",
  "police van": "patrullero",
  "fire engine": "carro de bomberos",

  // Comida
  "pizza": "pizza",
  "hamburger": "hamburguesa",
  "hotdog": "hot dog",
  "sandwich": "sándwich",
  "bread": "pan",
  "cake": "torta",
  "ice cream": "helado",
  "banana": "plátano",
  "apple": "manzana",
  "orange": "naranja",
  "strawberry": "fresa",
  "broccoli": "brócoli",
  "carrot": "zanahoria",
  "coffee mug": "taza de café",
  "cup": "taza",
  "bottle": "botella",
  "wine bottle": "botella de vino",
  "beer bottle": "botella de cerveza",
  "wine glass": "copa de vino",

  // Muebles / hogar
  "chair": "silla",
  "table": "mesa",
  "desk": "escritorio",
  "sofa": "sofá",
  "bed": "cama",
  "lamp": "lámpara",
  "bookcase": "estantería",
  "shelf": "repisa",
  "mirror": "espejo",
  "window shade": "persiana",
  "curtain": "cortina",
  "pillow": "almohada",
  "blanket": "frazada",
  "toilet": "inodoro",
  "bathtub": "bañera",
  "sink": "lavabo",

  // Lugares / estructuras
  "barbershop": "peluquería",
  "library": "biblioteca",
  "classroom": "aula",
  "gymnasium": "gimnasio",
  "hospital": "hospital",
  "restaurant": "restaurante",
  "bakery": "panadería",
  "grocery store": "tienda de abarrotes",

  // Herramientas
  "hammer": "martillo",
  "screwdriver": "destornillador",
  "wrench": "llave inglesa",
  "scissors": "tijeras",
  "knife": "cuchillo",
  "paintbrush": "pincel",
  "pencil": "lápiz",
  "pen": "bolígrafo",
  "notebook": "cuaderno",
  "book": "libro",
  "envelope": "sobre",
  "backpack": "mochila",
  "handbag": "cartera",
  "suitcase": "maleta",
  "umbrella": "paraguas",

  // Juguetes / entretenimiento
  "teddy bear": "oso de peluche",
  "doll": "muñeca",
  "toy": "juguete",
  "ball": "pelota",
  "balloon": "globo",
  "kite": "cometa",

  // Naturaleza
  "tree": "árbol",
  "flower": "flor",
  "grass": "pasto",
  "mountain": "montaña",
  "beach": "playa",
  "ocean": "océano",
  "river": "río",
  "cloud": "nube",
  "sun": "sol",
  "moon": "luna",
  "star": "estrella",
  "rock": "roca",
  "sand": "arena",
};


function traducir(label) {
  const lower = label.toLowerCase();

  if (TRADUCCIONES[lower]) return TRADUCCIONES[lower];

  for (const [en, es] of Object.entries(TRADUCCIONES)) {
    if (lower.includes(en.toLowerCase())) return es;
  }

  return label.split(",")[0].trim();
}

export async function loadModel() {
  if (mobileNetModel) return;
  mobileNetModel = await mobilenet.load({ version: 1, alpha: 0.25 });
}


export async function predict(input) {
  if (!mobileNetModel) throw new Error("Modelo no cargado.");
  const results = await mobileNetModel.classify(input, 5);
  return results.map(r => ({
    label: traducir(r.className),
    probability: r.probability
  }));
}

export function isModelLoaded() {
  return mobileNetModel !== null;
}