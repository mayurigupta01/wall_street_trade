import "./home.css";
import Gainers from "../gainers/gainers";
import Losers from "../losers/losers";
import TrendingTickers from "../trendingTickers/trendingTickers";
import News from "../news/news";
import SectorPerformance from "../sectorPerformance/sectorPerformance";
import RedditMentions from '../redditMentions/redditMentions';
import Topbar from '../topbar/topbar';
import MarketHours from "../marketHours/marketHours";
import ShowCredits from "../showCredits/showCredits";
import Buy from "../buy/Buy";
import StockDetails from "../stockDetails/stockDetails";

export default function Home() {
  return (
    <div className="home">
      <div>
        <Topbar />
      </div>
      <MarketHours />
      <Buy />
      <News />
      <div className="topNTables">
        <Gainers />
        <Losers />
        <SectorPerformance />
      </div>
      <div className="topNTables">
        <RedditMentions />
        <TrendingTickers />
        <StockDetails /> 
      </div>
    </div>
  );
}