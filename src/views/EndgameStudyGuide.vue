<template>
  <div class="sg-page">
    <!-- Reading progress bar -->
    <div class="sg-progress" ref="progressBar"></div>

    <!-- In-page sticky subnav -->
    <nav class="sg-subnav" aria-label="Study guide sections">
      <div class="sg-subnav-inner">
        <span class="sg-brand">Endgame Study Guide</span>
        <a href="#tldr">TL;DR</a>
        <a href="#spine">The Spine</a>
        <a href="#p1">I &middot; Diagnosis</a>
        <a href="#p2">II &middot; Anchor</a>
        <a href="#p3">III &middot; Allocation</a>
        <a href="#p4">IV &middot; Completion</a>
        <a href="#numbers">Numbers</a>
        <a href="#models">Models</a>
        <a href="#glossary">Glossary</a>
        <a href="#quotes">Lines</a>
        <a href="#test">Self-Test</a>
        <a href="#todo">What To Do</a>
      </div>
    </nav>

    <!-- Hero -->
    <header class="sg-hero">
      <div class="sg-container">
        <div class="sg-kicker">Book Study Guide &middot; Advance Manuscript, 2026</div>
        <h1 class="sg-title">Endgame</h1>
        <div class="sg-subtitle">Bitcoin, Sovereign Debt, and the Return of Sound Capital</div>
        <div class="sg-byline">by <strong>Kevin Bell, CFA</strong> &nbsp;&middot;&nbsp; Founder, Cadena Bitcoin &nbsp;&middot;&nbsp; 140 pages, 20 chapters, 4 parts</div>

        <div class="sg-thesis">
          <strong>The one-sentence thesis:</strong> the existing monetary system is not corrupt, it is <strong class="sg-accent">epistemically broken</strong> (a committee cannot know the right price of money), Bitcoin is the response (a unit whose supply is outside political deliberation), and a market-discovered yield curve built on Bitcoin-collateralized credit is what <strong class="sg-accent">completes</strong> that response by restoring price discovery to the most important price in the economy.
        </div>

        <div class="sg-equation">
          <span class="sg-chip">Sound money (fixed supply)</span>
          <span class="sg-op">+</span>
          <span class="sg-chip">Market-discovered credit (the BTC yield curve)</span>
          <span class="sg-op">=</span>
          <span class="sg-chip sg-chip-out">Restored intertemporal capital coordination</span>
        </div>
      </div>
    </header>

    <!-- TL;DR -->
    <section id="tldr" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Start Here</div>
        <h2 class="sg-h2">The whole book in five moves</h2>
        <div class="sg-tldr">
          <ol>
            <li><strong>The diagnosis is epistemic, not moral.</strong> Hayek proved no committee can possess the dispersed knowledge a price aggregates. We accept this for every price except the price of money. Central banking fails even if the bankers are saints.</li>
            <li><strong>Corrupting the unit corrupts every signal.</strong> Money is the substrate all prices are denominated in, so debasing it distorts the entire economy at once. The damage shows up as the Cantillon effect: asset-price inflation, captured productivity, a hollowed-out middle.</li>
            <li><strong>Bitcoin is the only exogenous unit.</strong> Its supply is outside political deliberation in a way gold's monetary role never was. That makes it a measuring stick that does not move.</li>
            <li><strong>So the portfolio changes &mdash; and so does who's willing to say so.</strong> 60/40 is dead, sovereign "risk-free" debt is a deteriorating credit instrument, and the right answer is a Kelly-sized self-custody Bitcoin position plus Bitcoin-collateralized credit replacing the bond sleeve. The book also names why most advisors aren't the ones telling clients this.</li>
            <li><strong>Credit completes the system.</strong> "Sound money without credit is hoarding." DLC-enforced lending produces the first market-discovered yield curve in 50 years, equalizes everyone's cost of capital &mdash; sovereigns included &mdash; and finishes the Hayekian project. The case rests on asymmetry, not inevitability.</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- The Spine -->
    <section id="spine" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">The Logical Spine</div>
        <h2 class="sg-h2">How the argument is built</h2>
        <p class="sg-lead">Each part answers the question the previous one opens. Read it as a single chain, not four essays.</p>
        <div class="sg-spine">
          <div class="sg-step"><div class="sg-step-n">PART I</div><div class="sg-step-t">Diagnosis</div><div class="sg-step-s">Why the system is broken (the knowledge problem)</div></div>
          <div class="sg-step"><div class="sg-step-n">PART II</div><div class="sg-step-t">The Anchor</div><div class="sg-step-s">Why Bitcoin is the response (the exogenous unit)</div></div>
          <div class="sg-step"><div class="sg-step-n">PART III</div><div class="sg-step-t">The Allocation</div><div class="sg-step-s">What it means for a portfolio &mdash; and why advisors resist it</div></div>
          <div class="sg-step"><div class="sg-step-n">PART IV</div><div class="sg-step-t">Completion</div><div class="sg-step-s">Credit + the yield curve finish the system</div></div>
          <div class="sg-step"><div class="sg-step-n">CLOSE</div><div class="sg-step-t">Endgame</div><div class="sg-step-s">The Hayekian project, operationalized</div></div>
        </div>
      </div>
    </section>

    <!-- Part I -->
    <section id="p1" class="sg-section">
      <div class="sg-container">
        <div class="sg-partbar">
          <div class="sg-partbar-n">I</div>
          <div>
            <div class="sg-partbar-t">The Diagnosis</div>
            <div class="sg-partbar-d">Why the monetary system is broken, in working order, even if everyone running it is honest.</div>
          </div>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 1</span>The Knowledge Problem</h3>
          <ul>
            <li>Hayek's 1945 paper "The Use of Knowledge in Society": the economic problem is not calculation, it is the use of <strong>dispersed knowledge that exists nowhere in concentrated form</strong>. The price system aggregates it. "The price was the knowledge."</li>
            <li>We accept Hayek for tin, labor, and almost every price, but <strong>not for the price of money</strong>, which a committee of 12 to 19 people sets eight times a year.</li>
            <li>The critique is <strong>epistemic, not moral</strong>: even saints on the FOMC are doing something incoherent, because the knowledge required cannot be possessed by any committee. The Soviet collapse is the empirical vindication.</li>
            <li>The price of money (interest rates, the money supply) is the <strong>most</strong> knowledge-intensive price, because it coordinates the entire structure of capital across time.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 2</span>Money as Information</h3>
          <ul>
            <li><strong>Money is not a commodity priced by the market. It is the substrate in which all other prices are denominated.</strong> Every price is a ratio of thing to unit.</li>
            <li>When the price of tin moves, the economy adjusts. When the price of money moves, the economy is <strong>repriced</strong>, because there is no other unit to flee to. Corrupting the unit corrupts every signal at once.</li>
            <li>The interest rate is the most important price (intertemporal coordination). Setting credit below the natural rate causes <strong>malinvestment</strong>; the recession is the discovery of malinvestment, not its cause.</li>
            <li>You can only get a <strong>discovered</strong> rate in a market subject to no central bank. That points directly at Bitcoin-denominated credit &mdash; the argument Part IV builds out in full.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 3</span>The Cantillon Engine</h3>
          <ul>
            <li>New money enters at a point (primary dealers, big banks, asset holders), not everywhere at once. <strong>First receivers spend at old prices; last receivers lose.</strong> "It's a feature, not a bug" &mdash; there's no smoke-filled room, just a transmission mechanism working as designed.</li>
            <li>2009 to 2024: M2 up ~3.5x, S&P up ~9x, home prices ~2x, real median wages up only ~15 to 20%. "Where did the inflation go?" Into <strong>assets</strong>, not the CPI.</li>
            <li>The CPI is the wrong instrument. Measure debasement by money-supply growth and the gap between asset owners and wage earners. This gap is the root political fracture of our era.</li>
            <li>Bitcoin used as a <strong>unit of measurement</strong> makes the debasement legible. Caveat: historical returns are inflated by a small base; discount them ("a haircut for arithmetic, not for skepticism").</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 4</span>Productivity, Captured</h3>
          <ul>
            <li>1947 to 1971: productivity and wages tracked each other almost perfectly. After Nixon closed the gold window in 1971 they diverged: <strong>productivity +~140%, real median wages +~15 to 20%.</strong></li>
            <li>The productivity dividend was <strong>captured by the financial layer</strong>. Total debt to GDP went 150% to 350%; cheap, abundant credit lifted assets while wages, set in labor markets, lagged.</li>
            <li><strong>Differential inflation</strong>: since 1971 the same groceries cost ~6x, the same house ~15x, the same share of stock ~50x. The regime produced this spread; it is a policy outcome, not an accident.</li>
            <li>Price assets in Bitcoin and they appear to collapse. The asset is not deflating; the dollar is debasing.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 5</span>The Recent Mirror</h3>
          <ul>
            <li>COVID 2020 to 2022 is the cleanest, fastest, best-documented Cantillon episode in history: <strong>M2 +40% in two years</strong> ($15.4T to $21.7T) plus ~$5T fiscal.</li>
            <li>It played out exactly as the framework predicts: assets first (S&P doubled, home prices +20% YoY, BTC $7k to $69k), <strong>then</strong> CPI (9.1% peak, highest since 1981), <strong>then</strong> the most aggressive hikes in 40 years (worst 60/40 year ever).</li>
            <li>The international mirror: Turkey, Argentina, Lebanon, <strong>Japan</strong> (massive QE, near-zero CPI = the framework in pure form, all in the asset and credit channels).</li>
            <li>The mechanism is universal. It is not an emerging-market story; it is every fiat currency told at different speeds.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Part II -->
    <section id="p2" class="sg-section">
      <div class="sg-container">
        <div class="sg-partbar">
          <div class="sg-partbar-n">II</div>
          <div>
            <div class="sg-partbar-t">The Anchor</div>
            <div class="sg-partbar-d">What kind of asset escapes the failure mode, and why Bitcoin is the only one that qualifies.</div>
          </div>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 6</span>The Exogenous Unit</h3>
          <ul>
            <li>The required property is not "scarce" or "limited" but <strong>exogenous</strong>: the supply rule must sit outside any deliberative body's power to change it.</li>
            <li>Gold's supply was non-deliberative, but its <strong>monetary role</strong> was repeatedly un-chosen by politics (1933, 1971). Every rules-based fiat commitment has been broken when inconvenient.</li>
            <li>Bitcoin's exogeneity is a <strong>social and technical equilibrium</strong>, not a single inviolable feature &mdash; the 21 million cap has survived 16 years of attempted change, regulatory crackdowns, and exchange collapses without budging.</li>
            <li>An exogenous unit propagates upward: it is the precondition for exogenous credit, which is the precondition for a yield curve no authority controls.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 7</span>The Evolution of Money</h3>
          <ul>
            <li>Money is evolutionary (Szabo, "Shelling Out"): shells to metals to gold to fiat, each step solving the prior bottleneck. Bitcoin is the next slot.</li>
            <li>It solves three deficiencies of gold: <strong>verification</strong> (gold is hard to verify, paper-gold runs 50 to 100x; BTC is verifiable by anyone running a node at zero cost), <strong>portability and seizure resistance</strong> (gold is heavy and confiscatable, see EO 6102; BTC self-custodies on a USB stick), and <strong>programmability</strong> (gold cannot enter a smart contract; BTC can, via DLCs).</li>
            <li>Gold is excellent money but the wrong base for a digital century. Alden's "complementary, not competitive" view is acknowledged with sympathy.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 8</span>Rules Over Discretion</h3>
          <ul>
            <li>Friedman's k-percent rule: a binding rule beats the best discretion because it removes <strong>noise</strong>. Buchanan: money is a <strong>constitutional</strong> question wrongly left to ongoing post-constitutional discretion.</li>
            <li>Bitcoin is <strong>stateless constitutional money</strong>. Its parameters are not optimal, they are <strong>Schelling points</strong>; the inviolability, not the optimality, is the source of value.</li>
            <li>Hayek's competing-currencies idea is honored, but strong network effects push to a single winner, so the real question is which <em>type</em> of single money wins.</li>
            <li>The tradeoff is explicit: <strong>inviolability over correctability</strong>. For an allocator, removing discretionary monetary risk is a category-defining feature.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 9</span>The Measuring Stick</h3>
          <ul>
            <li>Imagine a meter quietly shortened every few years. That is fiat. Bitcoin is the <strong>unmodified meter</strong>: an unconfounded unit of measurement.</li>
            <li>Priced in Bitcoin over the past decade: S&P ~ -95%, real estate similar, gold ~ -90%, wages ~ -99%. These are statements about <strong>unit debasement</strong>, not about Bitcoin as an investment (small-base caveat applies).</li>
            <li>Two uses: it makes debasement legible, and it lets you <strong>denominate long-term plans in Bitcoin</strong>. "Retire on $5M in 30 years" is meaningless; "retire on N BTC" is immune to monetary policy.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Part III -->
    <section id="p3" class="sg-section">
      <div class="sg-container">
        <div class="sg-partbar">
          <div class="sg-partbar-n">III</div>
          <div>
            <div class="sg-partbar-t">The Allocation</div>
            <div class="sg-partbar-d">The portfolio argument, made from outside the worldview, in the language of a CFA &mdash; plus the honest reason most advisors aren't making it.</div>
          </div>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 10</span>The Death of 60/40</h3>
          <ul>
            <li>60/40 rests on three assumptions, all broken: <strong>stock-bond negative correlation</strong> (broke in 2022, both fell together), <strong>positive real bond yields</strong> (negative for much of post-2008), and the <strong>central-bank backstop</strong> (the "Fed put" is impaired; forced to choose, the Fed defends the currency over asset prices).</li>
            <li>The emerging replacement: roughly 30 to 40% equities, <strong>10 to 25% self-custody Bitcoin</strong>, 20 to 30% Bitcoin-collateralized credit in place of sovereign bonds, the rest in cash, gold, and real assets.</li>
            <li>The defining move is structural: <strong>out of sovereign bonds, into Bitcoin and Bitcoin credit.</strong></li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 11</span>Position Sizing Under Uncertainty</h3>
          <ul>
            <li>Mean-variance (Markowitz) fails for Bitcoin (non-normal, fat tails, unstable correlations). Use the <strong>Kelly criterion</strong>: f = (bp − q) / b. Worked example (p=0.6, b=3): full Kelly 47%, half-Kelly 23%, quarter-Kelly 12%.</li>
            <li>Card players fear <strong>ruin</strong> (fatal), not variance (uncomfortable). <strong>Errors of omission</strong> (Buffett, Munger) are real and, on an asymmetric asset, often larger than errors of commission.</li>
            <li><strong>Decision quality vs outcome quality</strong> (Annie Duke): judge the decision by what was known then, not by how it turned out.</li>
            <li>Historical CAGR overstates forward edge &mdash; it was earned off a tiny base and won't repeat at scale, so any honest Kelly input discounts it. Younger investors with more human capital than financial capital can defensibly run higher, per the life-cycle-leverage case (Ayres & Nalebuff).</li>
            <li>The "responsible" 2 to 5% recommendation is a <strong>career-risk calculation by the advisor</strong>, not a portfolio-theory output &mdash; a claim Chapter 13 develops into its own argument. Defensible range for most readers: <strong>10 to 30% of net worth.</strong></li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 12</span>Paper Bitcoin and the Custody Question</h3>
          <ul>
            <li>A Bitcoin allocation does two jobs: <strong>directional price exposure</strong> and a <strong>hedge against the existing system's failure modes</strong>. ETFs deliver the first but not the second.</li>
            <li>An ETF share is a security held inside the same brokerage, custody, and regulatory system you are trying to hedge against. <strong>Self-custody is structurally outside the system.</strong></li>
            <li>"ETF Bitcoin and self-custody Bitcoin are two different instruments that share a price feed." Paper-gold analogy (50 to 100x).</li>
            <li>Hold the <strong>bulk in self-custody</strong>; use ETFs only for tax-advantaged accounts or mandates that forbid self-custody. Rule of thumb: count ETF Bitcoin as roughly half a self-custody allocation for the hedging job.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 13</span>The Elephant in the Room <span style="color:var(--faint); font-weight:400; font-size:12px; text-transform:none; letter-spacing:0;">&middot; new in this edition</span></h3>
          <ul>
            <li>If Chapters 11 and 12 are right, why does almost nobody in financial planning recommend a serious self-custody Bitcoin position? The answer isn't ignorance &mdash; it's the <strong>AUM compensation model</strong>. Advisors are paid a percentage of assets they custody, and self-custody Bitcoin, by design, leaves the platform entirely.</li>
            <li>An advisor who moves a client's net worth meaningfully into self-custody is recommending a cut to his own fee base. This is a <strong>structural</strong> conflict, not a moral failing &mdash; "each advisor is making locally rational decisions inside this set of constraints."</li>
            <li>It's a different conflict than the one fee-only fiduciary advice already solved. Fee-only fixes <em>which platform product</em> gets recommended; it doesn't touch whether wealth should leave the platform at all.</li>
            <li>The proposed fix isn't client-by-client persuasion, it's new fee architecture: billing against total net worth (not just custodied AUM), retainer or flat-fee planning, project-based work for self-custody setup, estate planning, and Bitcoin-collateralized credit structuring &mdash; all genuinely billable, none requiring the coins move onto a platform.</li>
            <li>The analogy is the slow correction of home-country equity bias: it wasn't fixed by argument, it was fixed by better infrastructure (index funds) that made the old default indefensible. Investors should ask their advisor about this conflict directly.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 14</span>Sovereign Debt Is Not Risk-Free</h3>
          <ul>
            <li>"Risk-free" only means nominal default is unlikely (the issuer prints the unit). It ignores that the <strong>real value of the unit is eroded by the issuer</strong>. Nominally riskless, economically destructive.</li>
            <li>2020 to 2022: long Treasuries lost ~30% nominal, worse in real terms. Duration risk is <strong>structural</strong>, not one bad cycle.</li>
            <li><strong>Sovereign credibility risk</strong>: debt growing faster than GDP, debt-service already above the defense budget, no path to sustainability without cuts, taxes, inflation, or repression. A sovereign that monetizes its own debt is, in effect, doubling its bet each round &mdash; a gambler's-ruin dynamic that holds until it doesn't.</li>
            <li>The honest reframe: sovereign debt is a <strong>credit instrument with a deteriorating counterparty</strong>, not a risk-free anchor.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 15</span>The New Fixed Income</h3>
          <ul>
            <li>The replacement is <strong>Bitcoin-collateralized credit</strong>: borrower posts BTC, receives a fiat or stablecoin loan at a market rate, liquidated if collateral falls below a threshold.</li>
            <li>The innovation is the <strong>enforcement</strong>. The last cycle (BlockFi, Celsius, Genesis) used trusted custody plus rehypothecation and <strong>all failed in 2022</strong>. The new generation uses <strong>DLCs</strong>: the borrower's Bitcoin never leaves a wallet they control.</li>
            <li>Risk profile: collateral risk (bounded by LTV, hedgeable with puts), counterparty risk (essentially eliminated by the contract), operational risk (real but small and shrinking), regulatory risk (uncertain). Net: structurally lower-risk than long-dated sovereign debt.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Part IV -->
    <section id="p4" class="sg-section">
      <div class="sg-container">
        <div class="sg-partbar">
          <div class="sg-partbar-n">IV</div>
          <div>
            <div class="sg-partbar-t">Completing the System</div>
            <div class="sg-partbar-d">Credit and the yield curve turn sound money into a complete monetary system.</div>
          </div>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 16</span>Time Value of Money on Bitcoin</h3>
          <ul>
            <li><strong>"Sound money without credit is hoarding."</strong> Money is four things: medium of exchange, unit of account, store of value, and <strong>intertemporal coordination</strong> (credit).</li>
            <li>That fourth function historically required <strong>trusted intermediaries</strong> (banks), which is incompatible with Bitcoin's whole point. The last crypto-credit cycle reintroduced trust and failed predictably.</li>
            <li><strong>DLCs</strong> (Discreet Log Contracts, Tadge Dryja, 2017) let two parties contract on an externally observed outcome, enforced by pre-signed Bitcoin transactions, no intermediary. This gives Bitcoin the fourth function and makes it a <strong>complete monetary system</strong> on a sound base.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 17</span>The Synthetic Risk-Free Rate</h3>
          <ul>
            <li>A Bitcoin-collateralized loan plus a put hedge manufactures a <strong>synthetic near-risk-free fiat yield</strong>. Cadena-style example at ~50% LTV: borrower posts $120k of BTC, lender posts $100k, lender expects $110k at maturity (a 10% yield).</li>
            <li>The residual is <strong>gap risk</strong>. A one-year put at the liquidation strike costs roughly 1 to 3% of notional at typical BTC implied vol (50&ndash;70%), ~2% a defensible mid-point. Net: ~8% near-risk-free, with <strong>no sovereign credit, no duration risk beyond the term, no counterparty-solvency dependence.</strong></li>
            <li>Varying LTV across loans <strong>triangulates the implied risk-free rate</strong>. Refinements: partial hedge, laddered tenors across the curve, or denominate the whole position in Bitcoin instead of fiat.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 18</span>The Bitcoin Yield Curve</h3>
          <ul>
            <li>The yield curve is <strong>the most important price signal in the economy</strong>, not a product: it coordinates capital across time. A corrupt curve corrupts the entire intertemporal structure of capital.</li>
            <li>Since 1971 <strong>no major economy has had a market-discovered curve</strong>; every fiat curve traces back to a policy rate. As Bitcoin-collateralized loans transact across many tenors, an empirical curve emerges in a sound-money base &mdash; the first true one in 50 years.</li>
            <li>The book defends this as the most consequential development since 1971, ahead of derivatives, ETFs, and even 2008 &mdash; those all sit on top of an administered curve; this reconstructs price discovery for capital itself.</li>
            <li>It enables honest pricing of long-duration capital, reconstruction of the derivatives apparatus on a sound base, empirical observation of the <strong>natural rate of interest</strong>, and completion of the Bitcoin monetary system.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 19</span>Everyone Has a Cost of Capital</h3>
          <ul>
            <li><strong>Everyone has a cost of capital; the only question is whether it is honest.</strong> The current hierarchy (sovereign, big banks, IG corporates, households, small business, payday) is a hierarchy of <strong>distance from the central bank's spigot</strong>, not of true credit risk.</li>
            <li>Subsidized sovereign capital funds wars, entitlements, and zombie firms that no honest rate would underwrite, and it <strong>crowds out</strong> private activity. A market-discovered curve makes the sovereign "just another borrower."</li>
            <li>Game theory: sovereigns can run the corporate <strong>Bitcoin-treasury trade</strong> (issue cheap fiat debt, buy BTC, capture the spread). First movers win; reserve-currency sovereigns (e.g. the US) have a harder incentive problem, since accumulating BTC signals hedging their own currency.</li>
            <li>Caveat: the market rate is an input, not the decision itself &mdash; your personal cost of capital, not the discovered rate, governs whether you borrow or lend.</li>
            <li>The deepest point: the specific freedom Bitcoin provides is <strong>freedom from a systematically distorted cost of capital</strong>, which determines what gets built across the whole economy.</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Chapter 20</span>The Hayekian Endgame</h3>
          <ul>
            <li>"Endgame" is <strong>not</strong> a fiat-collapse timeline &mdash; some fiat uses may persist indefinitely. It is the <strong>completion of the Hayekian project</strong>: 1945 knowledge problem, 1976 Denationalisation, Buchanan's constitutional economics, now operationalized in code.</li>
            <li>The five fragments now all exist: an exogenous monetary asset, a self-custody architecture, cryptographic credit (DLCs), an emerging market-discovered yield curve, and a portfolio framework that uses them.</li>
            <li>The transition is voluntary, gradual, and reversible per individual, but <strong>not at the systemic level</strong>. It is <strong>spontaneous order</strong> in Hayek's sense, built from decentralized choices. "The revolution, in this sense, will not be televised."</li>
          </ul>
        </div>

        <div class="sg-card">
          <h3><span class="sg-tag">Afterword</span>A Note on Inevitability &middot; Listen to the Price</h3>
          <ul>
            <li>He refuses the language of <strong>inevitability</strong>. The case requires only <strong>asymmetry</strong>: a non-trivial probability of substantial outperformance against bounded downside is enough to justify a meaningful position.</li>
            <li>No timing predictions either: the framework is meant to be robust across a wide range of paces, not dependent on any one forecast being right.</li>
            <li>Markets are not efficient, but the <strong>price system is the best information-aggregator humans have</strong>: a price is what people believe, weighted by capital at risk. <strong>"Listen to the price"</strong>: the long-term trajectory, not the daily quote. Closes with a plain reminder that nothing in the book is financial advice.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Numbers -->
    <section id="numbers" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Evidence</div>
        <h2 class="sg-h2">The numbers that make the diagnosis vivid</h2>
        <p class="sg-lead">If you remember only the data, remember these. They are the spine of Parts I, III, and IV.</p>
        <div class="sg-numbers">
          <div class="sg-stat"><div class="sg-stat-big">3.5× / 9× / 0.2×</div><div class="sg-stat-lbl">2009–2024: M2 / S&amp;P 500 / real median wages</div></div>
          <div class="sg-stat"><div class="sg-stat-big">+40%</div><div class="sg-stat-lbl">M2 growth in 2 years of COVID ($15.4T to $21.7T)</div></div>
          <div class="sg-stat"><div class="sg-stat-big">9.1%</div><div class="sg-stat-lbl">Peak CPI, June 2022 — highest since 1981</div></div>
          <div class="sg-stat"><div class="sg-stat-big">140% vs 15–20%</div><div class="sg-stat-lbl">Post-1971 productivity vs real-wage growth</div></div>
          <div class="sg-stat"><div class="sg-stat-big">150% &rarr; 350%</div><div class="sg-stat-lbl">US total debt-to-GDP since 1971</div></div>
          <div class="sg-stat"><div class="sg-stat-big">6× / 15× / 50×</div><div class="sg-stat-lbl">Since 1971: same groceries / house / share of stock</div></div>
          <div class="sg-stat"><div class="sg-stat-big">−95% / −99%</div><div class="sg-stat-lbl">S&amp;P / wages priced in BTC, past decade (unit debasement)</div></div>
          <div class="sg-stat"><div class="sg-stat-big">10% / 2% / ~8%</div><div class="sg-stat-lbl">Loan yield / put cost / synthetic risk-free rate (Ch 17)</div></div>
          <div class="sg-stat"><div class="sg-stat-big">50–100×</div><div class="sg-stat-lbl">Paper-gold-to-physical ratio — the risk ETF Bitcoin shares with it</div></div>
          <div class="sg-stat"><div class="sg-stat-big">2–5% vs 10–30%</div><div class="sg-stat-lbl">Typical advisor BTC allocation vs the Kelly-implied range</div></div>
          <div class="sg-stat"><div class="sg-stat-big">16 years</div><div class="sg-stat-lbl">The 21M cap has withstood every attempt to change it</div></div>
          <div class="sg-stat"><div class="sg-stat-big">1971</div><div class="sg-stat-lbl">Last year any major economy had a market-discovered yield curve</div></div>
        </div>
      </div>
    </section>

    <!-- Mental models -->
    <section id="models" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Frameworks</div>
        <h2 class="sg-h2">The mental models to keep</h2>
        <div class="sg-grid2">
          <div class="sg-card"><h3>Hayek's knowledge problem</h3><ul><li>Prices aggregate dispersed knowledge no mind can hold. The price <em>is</em> the knowledge. Applies to the price of money most of all.</li></ul></div>
          <div class="sg-card"><h3>The Cantillon effect</h3><ul><li>New money is not neutral. Proximity to the issuance point is a hidden tax: the near get richer, the far get poorer.</li></ul></div>
          <div class="sg-card"><h3>Constitutional vs post-constitutional (Buchanan)</h3><ul><li>Some choices belong to the rules layer, not the daily-decision layer. Money is one. Bitcoin lodges it at the constitutional level.</li></ul></div>
          <div class="sg-card"><h3>Schelling points</h3><ul><li>Bitcoin's parameters (21M, 10-min blocks) are not optimal, they are focal points everyone expects everyone to keep. Inviolability is the value.</li></ul></div>
          <div class="sg-card"><h3>Kelly criterion</h3><ul><li>Size by edge over variance, f = (bp − q)/b. Underbetting is a real error, not just caution. Ruin is fatal; missed upside is the bigger sin on asymmetric assets.</li></ul></div>
          <div class="sg-card"><h3>Decision vs outcome quality</h3><ul><li>Judge a bet by what was known when it was made, never by the result. A lucky 5% allocation was still a bad decision.</li></ul></div>
          <div class="sg-card"><h3>Asymmetric payoff &gt; inevitability</h3><ul><li>You never need Bitcoin to be inevitable. You need bounded downside and a non-trivial chance of large upside. That alone sizes the position.</li></ul></div>
          <div class="sg-card"><h3>The AUM conflict (the elephant in the room)</h3><ul><li>Advisors are paid on assets they custody. Self-custody Bitcoin leaves the platform, and the fee base, entirely &mdash; a structural, not moral, reason for the 2–5% default.</li></ul></div>
          <div class="sg-card"><h3>Sovereign gambler's ruin</h3><ul><li>A government that monetizes its own debt is doubling its bet each round to stay solvent. It works until it doesn't; the unwind is non-linear.</li></ul></div>
          <div class="sg-card"><h3>Cost-of-capital hierarchy</h3><ul><li>Today's rate ladder measures distance from the spigot, not credit risk. A discovered curve equalizes it, including for the sovereign.</li></ul></div>
          <div class="sg-card"><h3>The synthetic risk-free rate</h3><ul><li>Collateralized loan + put hedge = a near-risk-free yield with no sovereign credit underneath. Sovereign debt's claimed job, done honestly.</li></ul></div>
          <div class="sg-card"><h3>The four functions of money</h3><ul><li>Medium of exchange, unit of account, store of value, and intertemporal coordination. DLC credit gives Bitcoin the missing fourth.</li></ul></div>
        </div>
      </div>
    </section>

    <!-- Glossary -->
    <section id="glossary" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Vocabulary</div>
        <h2 class="sg-h2">Terms to own</h2>
        <div class="sg-glossary">
          <div class="sg-term"><div class="sg-term-t">Epistemic incoherence</div><div class="sg-term-d">Central banking fails because the knowledge needed cannot be possessed, not because the people are corrupt.</div></div>
          <div class="sg-term"><div class="sg-term-t">Exogenous unit</div><div class="sg-term-d">A money whose supply rule sits outside any deliberative body's power to change it. The book's core requirement.</div></div>
          <div class="sg-term"><div class="sg-term-t">Intertemporal coordination</div><div class="sg-term-d">Matching savers' time preference with borrowers' demand across time. The job of the interest rate.</div></div>
          <div class="sg-term"><div class="sg-term-t">Malinvestment</div><div class="sg-term-d">Capital allocated to projects that are only profitable at artificially suppressed rates. The recession reveals it.</div></div>
          <div class="sg-term"><div class="sg-term-t">Differential inflation</div><div class="sg-term-d">Asset prices rising far faster than wage-earner goods. The real shape of post-1971 debasement, invisible to the CPI.</div></div>
          <div class="sg-term"><div class="sg-term-t">Numeraire / measuring stick</div><div class="sg-term-d">The unit you price everything else in. Bitcoin is one that does not move.</div></div>
          <div class="sg-term"><div class="sg-term-t">DLC (Discreet Log Contract)</div><div class="sg-term-d">A Bitcoin contract that pays out on an externally observed outcome via pre-signed transactions. No intermediary, no custody.</div></div>
          <div class="sg-term"><div class="sg-term-t">Gap risk / LTV</div><div class="sg-term-d">The risk collateral falls faster than liquidation can capture. Loan-to-value bounds it; a put hedge converts it to a known cost.</div></div>
          <div class="sg-term"><div class="sg-term-t">Paper Bitcoin</div><div class="sg-term-d">ETF and custodial claims on BTC. Tracks the price but lives inside the system you are hedging against.</div></div>
          <div class="sg-term"><div class="sg-term-t">Small-base caveat</div><div class="sg-term-d">Historical returns earned off a tiny market cap will not repeat at scale. Discount them: "a haircut for arithmetic."</div></div>
          <div class="sg-term"><div class="sg-term-t">AUM conflict</div><div class="sg-term-d">Advisors are paid on assets they custody. Self-custody Bitcoin leaves the platform, and the fee, with it &mdash; a structural bias against the book's own advice.</div></div>
          <div class="sg-term"><div class="sg-term-t">Sovereign credibility risk</div><div class="sg-term-d">Debt growing faster than GDP with no path to sustainability short of cuts, taxes, inflation, or repression.</div></div>
          <div class="sg-term"><div class="sg-term-t">Bitcoin-treasury trade</div><div class="sg-term-d">Issue cheap debt, buy a non-debasing reserve asset, capture the spread. Works for corporates and, per Chapter 19, increasingly for sovereigns.</div></div>
          <div class="sg-term"><div class="sg-term-t">Spontaneous order</div><div class="sg-term-d">Hayek: order that emerges from decentralized choices, planned by no one. The shape of the Bitcoin transition.</div></div>
        </div>
      </div>
    </section>

    <!-- Quotes -->
    <section id="quotes" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Memorable Lines</div>
        <h2 class="sg-h2">Lines worth keeping</h2>
        <div class="sg-quotes">
          <blockquote class="sg-quote">"Money is the substrate in which all other prices are denominated."<cite>Ch 2</cite></blockquote>
          <blockquote class="sg-quote">"We accept Hayek for tin. We do not accept Hayek for money."<cite>Ch 1</cite></blockquote>
          <blockquote class="sg-quote">"The recession is not the cause of malinvestment. It is the discovery of malinvestment."<cite>Ch 2</cite></blockquote>
          <blockquote class="sg-quote">"People know they are being cheated. They can feel it. They know."<cite>Ch 3</cite></blockquote>
          <blockquote class="sg-quote">"Sound money without credit is hoarding."<cite>Ch 16</cite></blockquote>
          <blockquote class="sg-quote">"ETF Bitcoin and self-custody Bitcoin are two different instruments that share a price feed."<cite>Ch 12</cite></blockquote>
          <blockquote class="sg-quote">"This is the elephant in the room."<cite>Ch 13</cite></blockquote>
          <blockquote class="sg-quote">"The discount is not a haircut for skepticism. It is a haircut for arithmetic."<cite>Ch 11</cite></blockquote>
          <blockquote class="sg-quote">"Everyone has a cost of capital. The only question is whether it is honest."<cite>Ch 19</cite></blockquote>
          <blockquote class="sg-quote">"The revolution, in this sense, will not be televised."<cite>Ch 20</cite></blockquote>
          <blockquote class="sg-quote">"Listen to the price. The trajectory is the message."<cite>Afterword</cite></blockquote>
        </div>
      </div>
    </section>

    <!-- Self-test -->
    <section id="test" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Retention</div>
        <h2 class="sg-h2">Self-test: can you recall it?</h2>
        <p class="sg-lead">Read the question, answer in your head, then open it. If you can answer all fifteen, you own the book.</p>

        <div class="sg-testbar">
          <button class="sg-btn sg-btn-primary" @click="revealAll">Reveal all</button>
          <button class="sg-btn" @click="hideAll">Hide all</button>
        </div>

        <div ref="testContainer">
          <details class="sg-details">
            <summary>What makes the critique of central banking "epistemic" rather than "moral"?</summary>
            <div class="sg-answer">The knowledge required to set the right money supply or interest rate cannot in principle be possessed by any committee, because it only emerges from the market process the committee interrupts. So central banking fails <strong>even if the bankers are saints</strong>. It is incoherent, not corrupt.</div>
          </details>
          <details class="sg-details">
            <summary>Why is corrupting the price of money different from corrupting the price of tin?</summary>
            <div class="sg-answer">When tin moves, the rest of the economy adjusts. When money moves, the economy is <strong>repriced</strong>, because every other price is denominated in that same unit and there is nowhere to flee. The corruption hits every signal simultaneously.</div>
          </details>
          <details class="sg-details">
            <summary>State the Cantillon effect and the "where did the inflation go?" answer.</summary>
            <div class="sg-answer">New money enters at a point, so first receivers spend at old prices and last receivers lose. From 2009–2024 the inflation went into <strong>assets</strong> (S&P +9×) rather than the CPI, which is why measured inflation stayed low while the wealth gap exploded.</div>
          </details>
          <details class="sg-details">
            <summary>What happened to productivity and wages after 1971, and where did the dividend go?</summary>
            <div class="sg-answer">They diverged: productivity +~140%, real median wages +~15–20%. The productivity dividend was <strong>captured by the financial layer</strong> as cheap credit lifted asset prices while wages, set in slower labor markets, lagged.</div>
          </details>
          <details class="sg-details">
            <summary>Why is COVID 2020–2022 the book's cleanest case study?</summary>
            <div class="sg-answer">It compressed a decades-long Cantillon mechanism into 24 months in full view: M2 +40%, assets first, then 9.1% CPI, then the most aggressive hikes in 40 years (and the worst-ever 60/40 year). The framework predicted the sequence exactly.</div>
          </details>
          <details class="sg-details">
            <summary>What does "exogenous" mean, and why does gold fail the test?</summary>
            <div class="sg-answer">Exogenous means the supply rule is outside any deliberative body's power to change. Gold's supply was non-deliberative, but its <strong>monetary role</strong> was repeatedly suspended by politics (1933, 1971). Bitcoin's monetary properties depend on no body's continued willingness.</div>
          </details>
          <details class="sg-details">
            <summary>Which three deficiencies of gold does Bitcoin solve?</summary>
            <div class="sg-answer"><strong>Verification</strong> (anyone can validate the chain at zero cost vs paper-gold at 50–100×), <strong>portability and seizure resistance</strong> (self-custody on a USB stick vs heavy, confiscatable bullion), and <strong>programmability</strong> (DLCs and smart contracts, which gold cannot do).</div>
          </details>
          <details class="sg-details">
            <summary>What is the "measuring stick" argument?</summary>
            <div class="sg-answer">Fiat is a meter quietly shortened over time, so comparisons across time are confounded. Bitcoin is an <strong>unmodified meter</strong>: it makes debasement legible and lets you denominate long-term plans in a unit that cannot be debased ("retire on N BTC," not "$5M").</div>
          </details>
          <details class="sg-details">
            <summary>Which three assumptions of the 60/40 portfolio have broken?</summary>
            <div class="sg-answer">Stock-bond <strong>negative correlation</strong> (broke in 2022), <strong>positive real bond yields</strong> (negative for much of post-2008), and the <strong>central-bank backstop</strong> (the Fed will defend the currency over asset prices when forced to choose).</div>
          </details>
          <details class="sg-details">
            <summary>Why is the "responsible" 2–5% Bitcoin allocation not a real answer?</summary>
            <div class="sg-answer">It is a <strong>career-risk calculation by the advisor</strong>, not a portfolio-theory output. An honest Kelly application on an asymmetric asset (with omission errors counted and CAGR discounted for the small base) lands most readers around 10–30% of total net worth &mdash; and Chapter 13 explains the compensation structure behind why advisors rarely say so.</div>
          </details>
          <details class="sg-details">
            <summary>What is "the elephant in the room," and why doesn't naming it make advisors villains?</summary>
            <div class="sg-answer">The financial-planning profession is paid a percentage of the assets it <strong>custodies</strong>. Self-custody Bitcoin leaves the platform by design, so recommending it cuts the advisor's own fee base. It's a structural conflict, like the pre-index-fund home-country equity bias &mdash; not evidence of bad faith, but a reason to weight advice accordingly and ask about it directly.</div>
          </details>
          <details class="sg-details">
            <summary>Why is ETF Bitcoin not a substitute for self-custody?</summary>
            <div class="sg-answer">A Bitcoin allocation hedges the existing system's failure modes, but an ETF share is a security inside that same system. It gives directional exposure but not the hedge. "Two instruments that share a price feed; both are Bitcoin price exposure, but not both are Bitcoin."</div>
          </details>
          <details class="sg-details">
            <summary>In what sense is sovereign debt not risk-free?</summary>
            <div class="sg-answer">It is only safe from <strong>nominal</strong> default (the issuer prints the unit). The <strong>real</strong> value is eroded by that same issuer, and the issuer's creditworthiness is deteriorating. It is a credit instrument with a weakening counterparty, not a risk-free anchor.</div>
          </details>
          <details class="sg-details">
            <summary>How is a synthetic risk-free rate manufactured on Bitcoin?</summary>
            <div class="sg-answer">A Bitcoin-collateralized loan (say 10% yield at ~50% LTV) plus a put at the liquidation strike (~2% cost) nets ~8% near-risk-free, with no sovereign credit, no duration risk beyond the term, and no counterparty-solvency dependence. DLCs eliminate custody risk.</div>
          </details>
          <details class="sg-details">
            <summary>What does the title "Endgame" actually mean?</summary>
            <div class="sg-answer">Not a fiat-collapse date. It is the <strong>completion of the Hayekian project</strong>: sound money plus market-discovered credit equals restored intertemporal coordination, built from five fragments that all now exist, as spontaneous order. The case rests on asymmetry, not inevitability.</div>
          </details>
        </div>
      </div>
    </section>

    <!-- What to do -->
    <section id="todo" class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Application</div>
        <h2 class="sg-h2">What to actually do with it</h2>
        <div class="sg-todo">
          <div class="sg-todo-row"><div class="sg-todo-n">1</div><div><strong>Size by Kelly, not by career-safe defaults.</strong> For most: 10 to 30% of total net worth (include home equity). Higher if young, high-conviction, long-horizon, and able to stomach 70% drawdowns.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">2</div><div><strong>Hold the bulk in self-custody.</strong> ETFs only for tax-advantaged accounts or mandates that forbid keys. Count ETF Bitcoin as roughly half a self-custody allocation for the hedging job.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">3</div><div><strong>Replace the bond sleeve with Bitcoin-collateralized credit.</strong> DLC-enforced, non-custodial. Build a synthetic risk-free yield (loan plus put) instead of holding sovereign duration risk.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">4</div><div><strong>Denominate long-term planning in Bitcoin.</strong> Target a quantity of BTC, not a dollar figure, so the plan is immune to monetary policy over its horizon.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">5</div><div><strong>Ask your advisor about the AUM conflict directly.</strong> A 2–5% ETF-only recommendation may reflect his compensation structure more than the position-sizing math. A good advisor will engage with that honestly.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">6</div><div><strong>Read the asymmetry, not the inevitability.</strong> Bounded downside plus a real chance of large upside is the entire case. You never needed Bitcoin to be inevitable.</div></div>
          <div class="sg-todo-row"><div class="sg-todo-n">7</div><div><strong>Listen to the price.</strong> The long-term trajectory, not the daily quote, is the aggregated judgment of everyone with capital at risk. Check it periodically and ask what it is telling you.</div></div>
        </div>
      </div>
    </section>

    <!-- Go deeper -->
    <section class="sg-section">
      <div class="sg-container">
        <div class="sg-seclabel">Go Deeper</div>
        <h2 class="sg-h2">The shelf behind the book</h2>
        <div class="sg-reading">
          <p><strong>The Bitcoin Standard</strong> (Ammous) and <strong>Broken Money</strong> (Alden): the two prerequisites the author assumes you have read &mdash; there's no Bitcoin 101 chapter here.</p>
          <p><strong>The Use of Knowledge in Society</strong> (Hayek, 1945): 14 pages, the foundation of Part I. Read it twice.</p>
          <p><strong>Denationalisation of Money</strong> (Hayek, 1976) and <strong>Prices and Production</strong> (1931): the monetary and business-cycle extensions.</p>
          <p><strong>The Theory of Money and Credit</strong> (Mises, 1912): the foundational Austrian monetary text behind the malinvestment argument in Chapter 2.</p>
          <p><strong>The Calculus of Consent</strong> (Buchanan and Tullock): constitutional vs post-constitutional choice, behind Chapter 8.</p>
          <p><strong>Good Money</strong> (Selgin) and <strong>Free Banking in Britain</strong> (White): the empirical case, from history, that money doesn't require central banking.</p>
          <p><strong>Essai sur la Nature du Commerce en Général</strong> (Cantillon, 1755): the original statement of the Cantillon effect, Chapter 3's namesake.</p>
          <p><strong>The Price of Tomorrow</strong> (Booth): the deflation-vs-money-printing case. One of the author's three core influences, with Ammous and Alden.</p>
          <p><strong>Lifecycle Investing</strong> (Ayres and Nalebuff) and <strong>Thinking in Bets</strong> (Duke): the life-cycle-leverage and decision-quality inputs to Chapter 11.</p>
          <p><strong>Shelling Out</strong> (Szabo): the evolutionary frame for money in Chapter 7. Free online.</p>
          <p><strong>Layered Money</strong> (Bhatia): base money, bank money, shadow money &mdash; useful scaffolding for Part IV.</p>
          <p><strong>Bitcoin Is Venice</strong> (Farrington and Meyers) and <strong>The Sovereign Individual</strong> (Davidson and Rees-Mogg): the civilizational frame.</p>
        </div>
      </div>
    </section>

    <footer class="sg-footer">
      <div class="sg-container">
        Study guide built from a full read of the 2026 advance manuscript of <em>Endgame: Bitcoin, Sovereign Debt, and the Return of Sound Capital</em> by Kevin Bell, CFA (140 pages, 20 chapters). This is a learning aid, not the book and not financial advice &mdash; the manuscript itself is confidential and not for distribution or quotation without the author's permission, so treat this guide as a map, not a substitute for reading it. The author's own line: the framework either persuades you or it does not, and the decisions are yours.
      </div>
    </footer>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

const progressBar = ref(null)
const testContainer = ref(null)

let removeScrollListener = null

onMounted(() => {
  const onScroll = () => {
    const h = document.documentElement
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight)
    if (progressBar.value) progressBar.value.style.width = (pct * 100) + '%'
  }
  document.addEventListener('scroll', onScroll, { passive: true })
  removeScrollListener = () => document.removeEventListener('scroll', onScroll)
})

onUnmounted(() => {
  removeScrollListener?.()
})

function revealAll() {
  testContainer.value?.querySelectorAll('details').forEach(d => { d.open = true })
}
function hideAll() {
  testContainer.value?.querySelectorAll('details').forEach(d => { d.open = false })
}
</script>

<style>
.sg-page {
  --bg: #081123;
  --surface: rgba(255,255,255,.028);
  --surface2: rgba(255,255,255,.05);
  --ink: #edf0f7;
  --muted: #ffffff;
  --faint: #ffffff;
  --accent: #6738e3;
  --accent2: #a78bfa;
  --line: rgba(255,255,255,.1);
  --line2: rgba(255,255,255,.055);
  --serif: "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --sans: "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --maxw: 820px;

  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--nav-h, 72px) + 52px);
}

/* Progress bar */
.sg-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px; width: 0;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  z-index: 200;
  pointer-events: none;
}

/* In-page subnav */
.sg-subnav {
  position: sticky;
  top: var(--nav-h, 72px);
  z-index: 40;
  backdrop-filter: blur(14px);
  background: rgba(8,17,35,.9);
  border-bottom: 1px solid var(--line2);
}
.sg-subnav-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 10px 24px;
  display: flex;
  gap: 4px 14px;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}
.sg-subnav-inner::-webkit-scrollbar { display: none; }
.sg-brand {
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  margin-right: 6px;
  flex-shrink: 0;
}
.sg-subnav a {
  color: var(--muted);
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: color .15s;
}
.sg-subnav a:hover { color: var(--accent); }

/* Container */
.sg-container {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero */
.sg-hero {
  padding: 72px 0 48px;
  border-bottom: 1px solid var(--line);
}
.sg-kicker {
  color: var(--accent);
  font-size: 11.5px;
  letter-spacing: .2em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 16px;
}
.sg-title {
  font-family: var(--serif);
  font-size: clamp(40px, 7vw, 60px);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -.02em;
  margin: 0 0 14px;
}
.sg-subtitle {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(18px, 2.5vw, 22px);
  color: var(--muted);
  margin: 0 0 10px;
}
.sg-byline {
  font-size: 13.5px;
  color: var(--faint);
  margin-bottom: 32px;
}
.sg-byline strong { color: var(--ink); font-weight: 600; }

.sg-thesis {
  background: rgba(103,56,227,.07);
  border: 1px solid rgba(103,56,227,.3);
  border-radius: 14px;
  padding: 20px 22px;
  font-size: 16px;
  line-height: 1.65;
  margin-bottom: 20px;
}
.sg-accent { color: var(--accent); }

.sg-equation {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  background: var(--surface);
  font-size: 14px;
  text-align: center;
}
.sg-chip {
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--surface2);
  border: 1px solid var(--line2);
  font-weight: 600;
}
.sg-op { color: var(--accent); font-weight: 800; font-size: 18px; }
.sg-chip-out {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
}

/* Sections */
.sg-section {
  padding: 52px 0 8px;
  border-bottom: 1px solid var(--line2);
}
.sg-section:last-of-type { border-bottom: none; }

.sg-seclabel {
  color: var(--accent2);
  font-weight: 600;
  letter-spacing: .18em;
  text-transform: uppercase;
  font-size: 11.5px;
  margin-bottom: 6px;
}
.sg-h2 {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  margin: 4px 0 8px;
  letter-spacing: -.01em;
}
.sg-lead {
  color: var(--muted);
  font-size: 15.5px;
  margin: 0 0 20px;
}

/* Cards */
.sg-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  padding: 20px 22px;
  margin: 14px 0;
}
.sg-card h3 {
  font-family: var(--sans);
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--ink);
}
.sg-tag {
  display: block;
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.sg-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
}
.sg-card li {
  margin: 8px 0;
  color: var(--muted);
  font-size: 15px;
}
.sg-card li strong { color: var(--ink); font-weight: 650; }

/* Part bar */
.sg-partbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: linear-gradient(90deg, rgba(103,56,227,.07), transparent);
  margin-bottom: 6px;
}
.sg-partbar-n {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  font-family: var(--serif);
}
.sg-partbar-t { font-size: 20px; font-weight: 700; }
.sg-partbar-d { color: var(--muted); font-size: 13.5px; margin-top: 2px; }

/* Spine */
.sg-spine {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 12px 0 20px;
}
.sg-step {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  background: var(--surface);
  text-align: center;
}
.sg-step-n { color: var(--accent); font-weight: 700; font-size: 11px; letter-spacing: .1em; }
.sg-step-t { font-weight: 700; margin: 5px 0 3px; font-size: 14.5px; }
.sg-step-s { color: var(--muted); font-size: 12px; line-height: 1.4; }

/* TL;DR */
.sg-tldr {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface2);
  padding: 8px 24px 20px;
  margin-top: 14px;
}
.sg-tldr ol {
  counter-reset: tldr;
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
}
.sg-tldr ol li {
  counter-increment: tldr;
  position: relative;
  padding: 13px 0 13px 48px;
  border-bottom: 1px solid var(--line2);
  font-size: 15px;
  color: var(--muted);
}
.sg-tldr ol li:last-child { border-bottom: none; }
.sg-tldr ol li::before {
  content: counter(tldr);
  position: absolute;
  left: 0; top: 11px;
  width: 30px; height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sg-tldr ol li strong { color: var(--ink); }

/* Numbers grid */
.sg-numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}
.sg-stat {
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: 0 12px 12px 0;
  padding: 18px 18px 16px;
  background: var(--surface);
}
.sg-stat-big {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.15;
  letter-spacing: -.01em;
}
.sg-stat-lbl {
  color: var(--muted);
  font-size: 13px;
  margin-top: 6px;
  line-height: 1.45;
}

/* 2-col grid */
.sg-grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Glossary */
.sg-glossary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}
.sg-term {
  border: 1px solid var(--line2);
  border-radius: 12px;
  padding: 13px 15px;
  background: var(--surface);
}
.sg-term-t { font-weight: 700; color: var(--accent2); font-size: 14.5px; }
.sg-term-d { color: var(--muted); font-size: 13.5px; margin-top: 3px; line-height: 1.5; }

/* Quotes */
.sg-quotes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
}
.sg-quote {
  margin: 0;
  border-left: 3px solid var(--accent);
  padding: 12px 16px;
  background: var(--surface);
  border-radius: 0 12px 12px 0;
  font-size: 15px;
  color: #fff;
  font-style: italic;
  line-height: 1.55;
}
.sg-quote cite {
  display: block;
  color: var(--faint);
  font-size: 12px;
  margin-top: 8px;
  font-style: normal;
}

/* Self-test */
.sg-testbar { display: flex; gap: 10px; margin: 8px 0 16px; }
.sg-btn {
  cursor: pointer;
  border: 1px solid var(--line);
  background: var(--surface2);
  color: var(--ink);
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: var(--sans);
  transition: all .15s;
}
.sg-btn:hover { border-color: var(--accent2); color: var(--accent2); }
.sg-btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
}
.sg-btn-primary:hover { opacity: .9; color: #fff; }

.sg-details {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  margin: 9px 0;
  overflow: hidden;
}
.sg-details summary {
  cursor: pointer;
  padding: 13px 18px;
  font-weight: 600;
  font-size: 15px;
  list-style: none;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: var(--ink);
  user-select: none;
}
.sg-details summary::-webkit-details-marker { display: none; }
.sg-details summary::before {
  content: "Q";
  color: var(--accent);
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}
.sg-details[open] summary {
  border-bottom: 1px solid var(--line2);
  background: rgba(103,56,227,.06);
}
.sg-answer {
  padding: 14px 18px 16px 42px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}
.sg-answer strong { color: var(--ink); }

/* What to do */
.sg-todo {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(103,56,227,.04);
  padding: 6px 22px 18px;
  margin-top: 14px;
}
.sg-todo-row {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line2);
  font-size: 15px;
  color: var(--muted);
  line-height: 1.6;
}
.sg-todo-row:last-child { border-bottom: none; }
.sg-todo-row strong { color: var(--ink); }
.sg-todo-n {
  flex-shrink: 0;
  width: 30px; height: 30px;
  border-radius: 9px;
  background: var(--surface2);
  border: 1px solid var(--line2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-weight: 800;
  font-size: 14px;
  margin-top: 1px;
}

/* Reading list */
.sg-reading {
  columns: 2;
  column-gap: 26px;
  font-size: 14px;
  color: var(--muted);
  margin-top: 14px;
}
.sg-reading p {
  break-inside: avoid;
  margin: 0 0 12px;
  line-height: 1.6;
}
.sg-reading strong { color: var(--ink); }

/* Footer */
.sg-footer {
  padding: 36px 0 48px;
  color: var(--faint);
  font-size: 13px;
  border-top: 1px solid var(--line2);
  margin-top: 24px;
  line-height: 1.65;
}

/* Responsive */
@media (max-width: 860px) {
  .sg-numbers   { grid-template-columns: 1fr 1fr; }
  .sg-stat-big  { font-size: 17px; }
  .sg-spine     { grid-template-columns: 1fr 1fr; }
  .sg-grid2     { grid-template-columns: 1fr; }
  .sg-glossary  { grid-template-columns: 1fr; }
  .sg-quotes    { grid-template-columns: 1fr; }
  .sg-reading   { columns: 1; }
}
@media (max-width: 560px) {
  .sg-numbers   { grid-template-columns: 1fr 1fr; }
  .sg-spine     { grid-template-columns: 1fr; }
  .sg-stat-big  { font-size: 18px; }
}
</style>