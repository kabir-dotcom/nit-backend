const diseases = [
  {
    id: 1,
    name: 'Autoimmune Thyroiditis',
    summary:
      'Tailored immunotherapy protocols that rebalance hormone production and reduce flare frequency.',
  },
  {
    id: 2,
    name: 'Chronic Lyme',
    summary:
      'Integrative detox and immune modulation plans to restore vitality and cognitive clarity.',
  },
  {
    id: 3,
    name: 'Allergic Asthma',
    summary:
      'Sub-lingual boosters and respiratory support to calm overactive responses to environmental triggers.',
  },
];

const boosters = [
  {
    id: 1,
    name: 'Immune Reset',
    focus: 'Adaptive immune system rewiring with botanicals and micronutrients.',
  },
  {
    id: 2,
    name: 'Detox Momentum',
    focus: 'Supports liver pathways while maintaining healthy inflammatory response.',
  },
  {
    id: 3,
    name: 'Barrier Shield',
    focus: 'Strengthens gut mucosa and skin integrity to reduce allergen load.',
  },
];

const blogPosts = [
  
 {
  id: 1,
  title: "Natural Immunotherapy: The Breakthrough Approach Everyone’s Talking About",
  excerpt: "I just discovered something recently that completely blew my mind, and I had to share it because I genuinely think more people need to know about this. It's called Natural Immunotherapy — and honestly, when I first heard the name, I thought it was just another wellness buzzword. But after digging deeper, I realized this is something entirely different from what we've been told about treating serious illnesses.\n\nMy First Reaction: “Wait, This Can Actually Work?”\nI'll be honest — I was skeptical at first. When someone mentioned that Natural Immunotherapy could help with cancer healing and recovery, my immediate thought was, 'Sure, like that’s realistic.' But then I started reading the science behind it — and I was genuinely shocked.\n\nNatural Immunotherapy isn’t about drinking green juice and hoping for the best. It’s grounded in real biology. It works through specific nutrients and enzymes your body already knows how to use: Vitamin C, Vitamin D, Selenium, Zinc, Coenzyme Q10, Protease, and Pepsin. These aren’t mystical herbs; these are actual molecules that your cells need to function properly. And the clinical results people have shared are nothing short of remarkable.\n\nHow Does It Work?\nWe’ve been taught that diseases are something you fight with drugs. But Natural Immunotherapy works differently. It addresses root causes — nutrient deficiencies, toxin overload, and immune imbalance. When your body lacks key vitamins and minerals, your immune system can’t function properly. So this approach gives your body what it’s missing, strengthens immunity, helps detoxify, and supports DNA repair.\n\nIt can actually reduce tumor size while improving quality of life — often with far fewer side effects than conventional treatments. Patients with lymphoma, leukemia, lung cancer, tongue cancer, and more have shown real improvements using these protocols.\n\nWhy It Feels Like a Game Changer\nNatural Immunotherapy focuses on root causes instead of masking symptoms. There are barely any side effects since it uses molecules your healthy cells already recognize. It works with your body, not against it, and can be combined with other treatments to improve outcomes. And yes, there’s real evidence — not just anecdotes.\n\nThe Part That Hit Me Hardest\nThis approach could help so many people: cancer patients seeking hope, those with chronic conditions, and even communities struggling with malnutrition. It’s accessible, affordable, and powerful. I couldn’t help but wonder how many lives could have been different if this knowledge were more widespread.\n\nSo Here’s My Question for You\nHave you heard about Natural Immunotherapy? Have you or someone you know tried it? I’d love to hear real experiences because this deserves to be mainstream. There are now many resources available — including eBooks and formulations from companies like Dantura, which offer Immune Booster, Bone Marrow Booster, and Tumor Breaker based on these principles.\n\nThe Bottom Line\nI started this research thinking it was another supplement trend. But it might just be the beginning of a new era in medicine. Your body has an incredible ability to heal itself when you give it what it needs — and that’s worth exploring.\n\nEdit: Since people have been asking, you can learn more at Dantura.com, where they share eBooks and products based on Natural Immunotherapy principles. But I’d recommend doing your own research first and seeing if it resonates with you the way it did with me."
}

];

const heroContent = {
  headline: 'Personalized Natural Immunotherapy',
  subheadline: 'Evidence-led care plans recalibrating immunity for chronic disease recovery.',
  cta: 'Book a Discovery Call',
};

const getDiseases = (_req, res) => {
  res.status(200).json(diseases);
};

const getBoosters = (_req, res) => {
  res.status(200).json(boosters);
};

const getBlogPosts = (_req, res) => {
  res.status(200).json(blogPosts);
};

const getHeroContent = (_req, res) => {
  res.status(200).json(heroContent);
};

module.exports = {
  getDiseases,
  getBoosters,
  getBlogPosts,
  getHeroContent,
};
