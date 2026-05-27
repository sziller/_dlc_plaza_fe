export const blogArticles = [
  {
    id: 1,
    title: 'Cadena Bitcoin – Non-Custodial Peer-to-Peer Bitcoin Finance',
    description: 'Understand what sets Cadena Bitcoin apart from other platforms.',
    imageBase: 'article1',
    link: '/article/cadena-bitcoin-finance',
    internal: true,
  },
  {
    id: 2,
    title: 'Cadena Bitcoin - Empowering Individual Financial Freedom',
    description: 'Learn how Cadena Bitcoin lets you use Bitcoin flexibly.',
    imageBase: 'article2',
    link: '/article/cadena-empowering-financial-freedom',
    internal: true,
  },
  {
    id: 3,
    title: 'Cadena Bitcoin: Security',
    description: "Cadena Bitcoin prioritizes self-sovereignty, peer-to-peer operations, and Bitcoin's core security principles.",
    imageBase: 'article3',
    link: '/article/cadena-bitcoin-security',
    internal: true,
  },
  {
    id: 4,
    title: 'How Does it Work?',
    description: "Cadena Bitcoin is a non-custodial lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown of the key actions.",
    imageBase: 'article4',
    link: '/article/cadena-loan-lifecycle',
    internal: true,
  },
{
    id: 6,
    title: 'How Cadena Bitcoin is Improving Bitcoin Borrowing and Lending',
    description: 'Cadena Bitcoin is redefining BTC lending by eliminating third parties and publishing all loans directly on the blockchain.',
    imageBase: 'article5',
    link: '/article/cadena-improving-btc',
    internal: true,
  },
] as const

export const exploreUseCases = [
  {
    id: 'mini-saylor',
    title: '“Mini Saylor” — Corporate Bitcoin Strategy',
    teaser: 'Amplify BTC exposure without selling or draining cash.',
    content: `
      <p class="text-white/80">You're a Bitcoin maximalist who believes BTC will outperform long-term, but you want to add exposure without selling your stack or depleting cash.</p>

      <p class="mt-4 font-semibold text-white">Meet Alex: The Bitcoin Entrepreneur</p>
      <p class="text-white/80">“I run a tech company and hold 5 BTC personally. I’m convinced Bitcoin will hit $500K, but I don’t want to sell or use all my business capital to buy more.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Leverage Your Conviction, Keep Your Keys</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Decide how much additional exposure you want.</li>
        <li>Borrow additional Bitcoin based on risk tolerance and objectives.</li>
        <li>Use borrowed Bitcoin to increase your total position.</li>
        <li>Loan is settled in Bitcoin at term end (30, 90, 180 days, or 1 year).</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Register on Cadena and download the signer app.</li>
        <li>Borrow additional Bitcoin at market rates (execute online, sign in app).</li>
        <li>Amplify your Bitcoin exposure without selling.</li>
        <li>Settle the loan in Bitcoin at maturity.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Increase your exposure from 0.05 BTC up to 5× stack leverage.</li>
        <li>✅ No taxable event — you never sold your original stack.</li>
        <li>✅ True self-custody throughout.</li>
        <li>✅ No banks — pure peer-to-peer Bitcoin finance.</li>
      </ul>

      <p class=”mt-4 italic text-white/75”>”Just like MicroStrategy’s strategy, but truly non-custodial.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Get Started">Get Started →</a>
    `,
  },
  {
    id: 'dividend-debbie',
    title: '“Dividend Debbie” — Stable Bitcoin Yield',
    teaser: 'Predictable BTC-denominated yield with custody intact.',
    content: `
      <p class="text-white/80">You want steady returns above traditional savings, without bank counterparty risk—while staying aligned with Bitcoin’s long-term upside.</p>

      <p class="mt-4 font-semibold text-white">Meet Debbie: The Yield Seeker</p>
      <p class="text-white/80">“I have 10 BTC sitting idle. Banks offer 0.5% while taking huge risks with my money. I want steady Bitcoin-denominated returns with real security.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Earn Yield, Keep Control</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Lend your Bitcoin on Cadena’s marketplace to earn fixed returns.</li>
        <li>Your Bitcoin is secured by math and Bitcoin collateral on-chain.</li>
        <li>No counterparty risk — borrower collateral protects your principal.</li>
        <li>You understand the risk of BTC moving below the loan-to-value over the term.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Register and download Cadena’s signer app.</li>
        <li>Choose lending terms (30, 90, 180 days, or 1 year).</li>
        <li>Set your desired yield rate; use a market or limit order.</li>
        <li>Match with borrowers.</li>
        <li>Earn Bitcoin-denominated returns.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Predictable yield — fiat-style yield, denominated in Bitcoin.</li>
        <li>✅ Your keys, your coins — maintain custody.</li>
        <li>✅ No bank risk — peer-to-peer with mathematical security.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“Like being a preferred shareholder in MicroStrategy, but with better security.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Start Lending">Start Lending →</a>
    `,
  },
  {
    id: 'boat-liquidity',
    title: '“Borrowing for the Boat” — Liquidity Without Selling',
    teaser: 'Access $50K without selling BTC or triggering tax.',
    content: `
      <p class="text-white/80">You need $50,000 for a purchase but don’t want to sell BTC, miss potential upside, or trigger a taxable event.</p>

      <p class="mt-4 font-semibold text-white">Meet Captain Mike: The Bitcoin HODLer</p>
      <p class="text-white/80">“I need $50K for my dream boat, but selling Bitcoin feels like selling Amazon in 1999. There has to be a better way.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Access Liquidity, Keep Your Bitcoin</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Use your Bitcoin as collateral for a Bitcoin loan.</li>
        <li>Borrow Bitcoin to maintain your desired exposure.</li>
        <li>Convert borrowed Bitcoin to USD for your purchase.</li>
        <li>Repay the loan by buying back Bitcoin at maturity.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process (example)</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Borrow 0.5 BTC for 1 year (assuming BTCUSD = $100,000).</li>
        <li>Convert borrowed BTC to USD on your exchange of choice.</li>
        <li>Buy your boat with the proceeds.</li>
        <li>At term end, buy back $50,000 worth of Bitcoin and repay the loan.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Get your boat without selling your stack.</li>
        <li>✅ Maintain upside — you still own your original BTC.</li>
        <li>✅ True self-custody — your keys, your control.</li>
        <li>• Conservative risk management: 50% LTV gives a wide buffer.</li>
        <li>• No margin calls: collateral only matters at final settlement.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“Enjoy life today while staying positioned for Bitcoin’s future.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Borrow Now">Borrow Now →</a>
    `,
  },
  {
    id: 'yield-arber',
    title: '“Yield Arber” — Advanced Bitcoin Strategies',
    teaser: 'Capture spreads while keeping BTC exposure.',
    content: `
      <p class="text-white/80">You’re sophisticated with capital and want to maximize returns by arbitraging between BTC lending rates and other opportunities—without sacrificing exposure.</p>

      <p class="mt-4 font-semibold text-white">Meet Sarah: The Yield Arbitrageur</p>
      <p class="text-white/80">“I see Cadena lenders earning ~10% while I can borrow fiat at ~5%, or have savings sitting idle. I want to increase the dollar value of my BTC position by earning yield on my stack.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — The Spread Play</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Lend Bitcoin on Cadena while borrowing fiat elsewhere at lower rates.</li>
        <li>✅ Maximize capital efficiency.</li>
        <li>✅ Maintain Bitcoin exposure.</li>
        <li>✅ Keep full custody — minimize counterparty risk.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">Risk Considerations</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Leverage involves risk.</li>
        <li>Understand settlement mechanics.</li>
        <li>Plan for multiple BTC price scenarios.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“For those who understand Bitcoin deeply and want to maximize every satoshi.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Explore Opportunities">Explore Opportunities →</a>
    `,
  },
] as const

export const exploreVideos = [
  {
    id: 'GSwoA__CH5I',
    title: 'What is Cadena Bitcoin?',
    description: 'A concise walkthrough of how Cadena keeps lending and borrowing fully Bitcoin-native.',
  },
  {
    id: 'WfBMCMVsD1Q',
    title: 'Borrower Experience Demo',
    description: 'Step-by-step borrower experience from creating an order to settling a DLC.',
  },
  {
    id: 'yNbE83BF8Mk',
    title: 'Lender Workflow Overview',
    description: 'See how lenders price risk, deploy Bitcoin, and monitor performance inside Cadena.',
  },
  {
    id: 'Gr0H0MpUbhU',
    title: 'Signer App & Security Tour',
    description: 'How the Cadena Signer app keeps keys local and transactions transparent.',
  },
] as const
