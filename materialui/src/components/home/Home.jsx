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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core/styles";



export default function Home() {

  const theme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "*::-webkit-scrollbar": {
            width: "10px"
          },
          "*::-webkit-scrollbar-track": {
            background: "#E4EFEF"
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#1D388F61",
            borderRadius: "2px"
          }
        }
      }
    }
  });
  return (
    <div className="home">
      <div>
        <Topbar />
      </div>
      <MarketHours />
      <Buy />
      <div className = "container">
      <StockDetails />
      {/* </div>  */}
      {/* <News /> */}
      <div className="topNTables">
      <ThemeProvider theme={theme}>
        <Gainers />
        <Losers />
        <SectorPerformance />
        <RedditMentions />
        </ThemeProvider>
      </div>  
      </div>
      {/* <div className="topNTables">
        <TrendingTickers />
      </div> */}
    </div>
  );
}