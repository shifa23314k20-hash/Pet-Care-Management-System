import { v4 as uuidv4 } from "uuid";

const blogs = [
  {
    id: uuidv4(),
    title: "Keeping Your Pet Safe During Summer",
    category: "Summer Care",
    description:
      "During hot weather, make sure your pet always has access to fresh drinking water. Avoid taking pets outside during peak afternoon heat and provide a cool, shaded place where they can rest. Watch for excessive panting, weakness, or unusual tiredness.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "How to Prevent Heat Stress in Pets",
    category: "Summer Care",
    description:
      "Pets can become overheated quickly during hot weather. Keep outdoor activities short, provide plenty of water, and never leave a pet inside a parked vehicle. If your pet appears weak, confused, or is having difficulty breathing, seek veterinary help immediately.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Winter Care Tips for Dogs and Cats",
    category: "Winter Care",
    description:
      "Cold weather can affect pets just like humans. Provide a warm and comfortable sleeping area, limit prolonged exposure to very cold conditions, and keep your pet's bedding dry. Older pets and pets with health problems may need additional protection during winter.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Protecting Your Pet's Paws in Winter",
    category: "Winter Care",
    description:
      "Cold surfaces and harsh outdoor conditions can irritate your pet's paws. Check their paws after outdoor walks and clean them when necessary. Keeping nails trimmed and paws clean can also help prevent discomfort and injuries.",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Why Vaccinations Are Important",
    category: "Vaccination",
    description:
      "Vaccinations help protect pets from several serious and preventable diseases. Follow the vaccination schedule recommended by your veterinarian and keep a record of every vaccine your pet receives, including the date and next due date.",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Understanding Your Pet's Vaccination Schedule",
    category: "Vaccination",
    description:
      "Pets require different vaccinations depending on their age, lifestyle, location, and health needs. Regular veterinary visits can help determine which vaccines are appropriate and when booster doses are due.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Simple Grooming Routine for Your Pet",
    category: "Grooming",
    description:
      "Regular grooming helps keep your pet's coat, skin, nails, ears, and teeth healthy. Brush your pet according to their coat type, check their ears regularly, keep nails at a safe length, and introduce grooming gradually to reduce stress.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Dental Care for Dogs and Cats",
    category: "Grooming",
    description:
      "Good dental hygiene is an important part of overall pet health. Regular brushing with pet-safe toothpaste can help reduce plaque buildup. Your veterinarian can also recommend professional dental cleaning when necessary.",
    image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "How Much Exercise Does Your Pet Need?",
    category: "General",
    description:
      "Exercise requirements vary depending on your pet's age, breed, health, and energy level. Regular walks, play sessions, and mentally stimulating activities can help support a healthy lifestyle. Always adjust activity levels according to your pet's individual needs.",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Healthy Eating Habits for Pets",
    category: "General",
    description:
      "A balanced diet is important for maintaining your pet's health and energy. Feed an appropriate amount based on your pet's size, age, and activity level. Avoid giving pets foods that are unsafe for them and consult your veterinarian when changing their diet.",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Signs That Your Pet May Need a Vet",
    category: "General",
    description:
      "Changes in appetite, unusual tiredness, repeated vomiting, difficulty breathing, sudden behavior changes, or other unusual symptoms can indicate that your pet needs professional attention. When you notice concerning or persistent changes, contact a veterinarian.",
    image: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e",
    author: "PetCare",
  },

  {
    id: uuidv4(),
    title: "Creating a Safe Home for Your Pet",
    category: "General",
    description:
      "Keep harmful chemicals, medications, electrical cables, and unsafe foods away from pets. Make sure windows, balconies, and doors are secure. Providing a safe environment can prevent many common household accidents.",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8",
    author: "PetCare",
  },
];

export default blogs;