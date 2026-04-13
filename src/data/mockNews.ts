export type NewsCategory = "local" | "regional" | "global";
export type NewsTopic = "science" | "animals" | "sports" | "space" | "environment" | "technology" | "culture";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  category: NewsCategory;
  topic: NewsTopic;
  readTime: number;
  imageUrl?: string;
  source: string;
  date: string;
}

export const topicEmojis: Record<NewsTopic, string> = {
  science: "🔬",
  animals: "🐾",
  sports: "⚽",
  space: "🚀",
  environment: "🌍",
  technology: "💻",
  culture: "🎨",
};

export const topicColors: Record<NewsTopic, string> = {
  science: "bg-fun-purple",
  animals: "bg-fun-green",
  sports: "bg-fun-orange",
  space: "bg-primary",
  environment: "bg-success",
  technology: "bg-fun-pink",
  culture: "bg-secondary",
};

export const categoryLabels: Record<NewsCategory, { label: string; emoji: string }> = {
  local: { label: "My Neighborhood", emoji: "🏘️" },
  regional: { label: "My Country", emoji: "🗺️" },
  global: { label: "Around the World", emoji: "🌎" },
};

export const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "New Playground Opens With a Giant Treehouse!",
    summary: "A brand-new playground just opened in the city center! It has a three-story treehouse, a splash pad, and even a reading corner where you can borrow books for free. The mayor said it was designed by kids, for kids!",
    emoji: "🏡",
    category: "local",
    topic: "culture",
    readTime: 2,
    source: "Kids City News",
    date: "2026-04-13",
  },
  {
    id: "2",
    title: "School Robot Wins National Science Fair",
    summary: "A team of 4th graders built a robot that can sort recycling! Their robot, named 'Eco-Bot', uses cameras to tell the difference between plastic, paper, and glass. They won first place at the National Science Fair!",
    emoji: "🤖",
    category: "regional",
    topic: "science",
    readTime: 3,
    source: "Young Scientists Daily",
    date: "2026-04-12",
  },
  {
    id: "3",
    title: "Baby Panda Born at the National Zoo!",
    summary: "Great news from the National Zoo — a baby giant panda was born last night! The tiny cub weighs only about 100 grams, which is lighter than a cup of water. Zookeepers say both mom and baby are healthy and happy.",
    emoji: "🐼",
    category: "regional",
    topic: "animals",
    readTime: 2,
    source: "Animal Friends Gazette",
    date: "2026-04-12",
  },
  {
    id: "4",
    title: "NASA Discovers Water on a New Planet!",
    summary: "Scientists at NASA found signs of water on a planet far, far away! The planet is called 'Aqua-7' and it's 100 light-years from Earth. This is exciting because water could mean life might exist there someday!",
    emoji: "🪐",
    category: "global",
    topic: "space",
    readTime: 3,
    source: "Space Kids Explorer",
    date: "2026-04-11",
  },
  {
    id: "5",
    title: "Kids Plant 10,000 Trees in One Day!",
    summary: "Children from 50 different countries joined together online to plant 10,000 trees in a single day! Each kid planted a tree in their own backyard or local park. Together, they're helping fight climate change one tree at a time.",
    emoji: "🌳",
    category: "global",
    topic: "environment",
    readTime: 2,
    source: "Green Kids World",
    date: "2026-04-11",
  },
  {
    id: "6",
    title: "Local Library Gets a Gaming Corner!",
    summary: "The city library now has a special area with video games and board games! You can play educational games after finishing your homework. The librarian says it's a great way to make learning fun.",
    emoji: "🎮",
    category: "local",
    topic: "technology",
    readTime: 2,
    source: "Kids City News",
    date: "2026-04-10",
  },
  {
    id: "7",
    title: "Young Soccer Star Scores Hat Trick!",
    summary: "12-year-old Maya scored three goals in the national youth soccer championship! Her team, the Lightning Bolts, won the trophy for the first time ever. Maya says she practices every day after school.",
    emoji: "⚡",
    category: "regional",
    topic: "sports",
    readTime: 2,
    source: "Junior Sports Weekly",
    date: "2026-04-10",
  },
  {
    id: "8",
    title: "Japan's Coolest Train Can Float on Magnets!",
    summary: "Japan just tested a train that floats above the tracks using magnets! It's called a maglev train and it can go over 600 km per hour — that's faster than an airplane taking off! Maybe one day we'll all ride floating trains.",
    emoji: "🚄",
    category: "global",
    topic: "technology",
    readTime: 3,
    source: "Tech Kids Today",
    date: "2026-04-09",
  },
  {
    id: "9",
    title: "Community Garden Grows Giant Pumpkin!",
    summary: "The neighborhood community garden grew a pumpkin that weighs over 200 pounds! Kids helped water and take care of it all summer. They're planning to make it into pumpkin pie for the whole street!",
    emoji: "🎃",
    category: "local",
    topic: "environment",
    readTime: 2,
    source: "Kids City News",
    date: "2026-04-09",
  },
];
