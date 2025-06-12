import world from '@/assets/Home/Home-world.png'
import waste from '@/assets/Home/Home-waste.png'
import refer from '@/assets/Home/Home-refer.png'



export const TOP_CARD_LIST = [
   {
      subTitle: 'Global Impact | One Platform',
      title: '100+ Countries',
      titleIcon:'mdi:world',
      description: '15,000+ Users',
      descriptionIcon: 'fluent:people-24-filled',
      description2: '500+ Teams Built',
      descriptionIcon2: 'mdi:pickaxe',
      image: world,
   },
   {
      subTitle: 'Goals | Vision',
      title: 'Life From Waste',
      titleIcon:'tabler:world-heart',
      description: 'Earn from enabling us create safer Living from the toxic wastes everywhere',
      descriptionIcon: 'ant-design:dollar-circle-filled',
      description2: '',
      descriptionIcon2: '',
      image: waste,
   },
   {
      subTitle: 'Invite | Become a crew leader',
      title: 'Refer & Multiply',
      titleIcon:'solar:share-bold',
      description: 'With each person you bring in, you earn, they grow, and your collective potential expands.',
      descriptionIcon: 'fluent:people-24-filled',
      description2: '',
      descriptionIcon2: '',
      image: refer,
   },
]

export const STE = [
   {
      title: 'Choose Your Pack',
      description: 'Start small or strong — from PolyCycle to Nova Tiers.',
   },
   {
      title: 'Activate & Earn Daily',
      description: 'Each pack delivers steady, automated daily yields.',
   },
   {
      title: 'Withdraw or Reinvest',
      description: 'Flex your funds: cash out anytime or grow your gains.',
   },
]

export const HOME_NAV_LIST = [
   {
      title: 'Withdraw',
      icon: 'fa6-solid:sack-dollar',
      path: '/tiering/withdraw',
   },
   {
      title: 'Deposit',
      icon: 'ph:hand-deposit-fill',
      path: '/tiering/deposit',
   },
   {
      title: 'Updates',
      icon: 'fluent:dual-screen-update-20-filled',
      path: '/updates',
   },
   {
      title: 'FAQ',
      icon: 'mdi:chat-question',
      path: '/faq',
   },
   {
      title: 'Help',
      icon: 'ix:about-filled',
      path: '/help',
   },
   {
      title: 'My ECP',
      icon: 'fa:recycle',
      path: '/tiering/my-ecp',
   },
   {
      title: 'Recycler',
      icon: 'material-symbols:factory',
      path: '/tiering/mining',
   },
   {
      title: 'Crew',
      icon: 'fluent:people-24-filled',
      path: '/crew',
   },
]

export const HELP_STEPS = [
  "Create Your Account",
  "Sign up using your email and phone number. Choose your country code — we’re global 🌍.",
  "Fund with USDT",
  "Deposit USDT (TRC20) to your personal wallet address on the platform. Minimum deposit applies based on the pack.",
  "Choose a Pack",
  "Pick from our tiered investment packs — like Pulse, Spark, Titan, Nova. Each one comes with daily returns over a set period.",
  "Watch Your Daily Earnings",
  "Earnings start counting within 24 hours. You’ll see your daily profit reflected in your dashboard.",
  "Withdraw Anytime",
  "Withdraw to your external wallet. Withdrawals process in 24 hours. No hidden fees.",
  "Invite & Earn More",
  "Refer friends and earn team bonuses. Grow your team, grow your rewards."
];

export const FAQ_LIST = [
  {
    question: "Is my money safe?", answer:"Yes. Your funds are secured in your wallet. We use email authentication and optional 2FA for added safety." },
  { question: "How fast can I withdraw my money?", answer: "Withdrawals are processed within 24 hours to your personal USDT wallet." },
  { question: "When do I start earning after deposit?", answer: "Daily earnings begin within 24 hours after activating your pack." },
  { question: "Can I join from any country?", answer: "Yes! Our platform supports global access. Just use your country code at sign-up." },
  { question: "What’s the minimum I can invest?", answer: "The lowest pack starts at just $10 — that’s the Pulse Pack." },
  { question: "How do team bonuses work?", answer: "When someone joins using your invite link, you earn a percentage of their pack. It’s our way of rewarding network growth." },
  { question: "Is my money safe?", answer: "Yes it is." },
];