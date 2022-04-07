import "./home.css";
import Gainers from "../gainers/gainers";
import Losers from "../losers/losers";
import TrendingTickers from "../trendingTickers/trendingTickers";
import News from "../news/news";
import SectorPerformance from "../sectorPerformance/sectorPerformance";
import RedditMentions from '../redditMentions/redditMentions';
import Topbar from '../topbar/topbar';
import MarketHours from "../marketHours/marketHours";

export default function Home() {
  return (
    <div className="home">
      <div>
        <Topbar />
      </div>
      <MarketHours />
      <News />
      <div className="topNTables">
        <Gainers />
        <Losers />
        <SectorPerformance />
      </div>
      <div className="topNTables">
        <RedditMentions />
        <TrendingTickers />
      </div>
    </div>
  );
}