// pages/blog.js
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function Blog() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <Head>
        <title>CFB Belt Blog</title>
        <meta name="description" content="Follow the latest updates and insights about the College Football Belt." />
        <meta property="og:image" content="/images/2025week1.png" />
      </Head>

      <NavBar />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>College Football Belt Blog</h1>

      {/* Most recent post first */}
      <article style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Great Upsets in Belt Game History</h2>
        <time
          dateTime="2025-09-09"
          style={{
            color: '#555',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'block'
          }}
        >
          September 09, 2025
        </time>
        <p>
          The USF Bulls pulled off a huge upset of the Florida Gators. The Gators were favored by 18.5 points. Here are
          some other notable CFB Belt game upsets:
        </p>
        <ul>
          <li>
            <strong>1981 – Wisconsin 21, #1 Michigan 14</strong>
            <br />
            The unranked Badgers stunned the top-ranked Wolverines in Madison, snapping Michigan’s short reign and
            handing the belt to Wisconsin for a single week.
          </li>
          <li>
            <strong>1998 – Texas A&M 28, #2 Nebraska 21</strong>
            <br />
            The Aggies halted Nebraska’s 15-game belt streak in College Station, turning a title defense into an
            unexpected transfer of power.
          </li>
          <li>
            <strong>2007 – Auburn 20, #4 Florida 17</strong>
            <br />
            Florida looked invincible after its national championship run, but Auburn walked into Gainesville as a
            two-touchdown underdog and left with the belt.
          </li>
          <li>
            <strong>2007 – Arkansas 50, #1 LSU 48 (3OT)</strong>
            <br />
            Darren McFadden and the Razorbacks outlasted top-ranked LSU in Baton Rouge, one of the wildest belt
            exchanges of the modern era.
          </li>
          <li>
            <strong>2012 – Baylor 52, #1 Kansas State 24</strong>
            <br />
            The Wildcats were eyeing a title shot before the Bears detonated those dreams in Waco, seizing the belt with
            a 28-point shocker.
          </li>
        </ul>
        <p>
          Florida at LSU is where we should see our first real challenge. The Bulls have never worn the Belt, yet their
          speed and chaos on defense could pressure the Gators. A couple of early breaks and USF might craft the next
          chapter in upset history.
        </p>
      </article>

      <article style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>2025 Season Preview</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Posted August 6, 2025</p>

        <p>
          Last year the belt moved from the Big Ten to the SEC, switched teams 4 times, and missed the playoffs after
          sticking with Washington the previous year and making it into the championship game.
        </p>
        <p>
          Who knows what is in store this year? It looks likely the belt will either stay in the SEC or find its way
          into the ACC this season — and hopefully end up in the playoffs.
        </p>
        <p>
          The season kicks off with LIU at Florida — a pretty boring game for a belt championship but the LIU logo is
          pretty cool.
        </p>

        <div style={{
  width: '100%',
  maxWidth: '600px',
  margin: '1rem auto',
  borderRadius: '8px',
  border: '1px solid #ddd',
  textAlign: 'center'
}}>
  <img
    src="/images/2025week1.png"
    alt="Florida vs. Long Island belt matchup"
    style={{ width: '100%', height: 'auto', display: 'block' }}
  />
</div>


        <p>
          Florida at LSU is where we should see our first real challenge.
        </p>
      </article>

      {/* Older post */}
      <article style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Five College Football Belt Underachievers</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Posted August 5, 2025</p>

        <p>
          Some college football blue bloods have achieved incredible success in national championships, AP rankings, and bowl wins —
          but their College Football Belt resumes don’t quite match up. Based on a combination of belt wins, reigns,
          and win percentage, here are five programs punching below their weight:
        </p>

        <ul>
          <li><strong>Notre Dame</strong> — One of college football's most legendary programs ranks only 23rd in belt wins and has a fairly unremarkable belt game profile.</li>
          <li><strong>Penn State</strong> — Ranks only 33rd in wins and has a abysmal 38.9 winning percentage in belt games.</li>
          <li><strong>Oklahoma</strong> — Ranks just below Penn State in wins and has only reigned as belt champion 4 times.</li>
          <li><strong>Iowa</strong> — 6-8-0 record with only 2 reigns. Ranked 59th in total belt wins. Iowa is not a true blue blood but you'd expect better than those stats from a program of their calibre.</li>
          <li><strong>Nebraska</strong> — Nebraska has a strong 70.4 winning percentage (19-8-1 record) but has had only 3 reigns and ranks only 25nd in total wins. </li>
        </ul>

      
      </article>
    </div>
  );
}
