import os



class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'guess-if-you-can'

    url = "https://yh-finance.p.rapidapi.com/market/get-trending-tickers"
    apihost = 'yh-finance.p.rapidapi.com'
    apikey = 'fd1576efc5msh7bb1970e4c028cdp1406ccjsn31facdab9c57'
    FMP_apiKey = "?apikey=4a57a180719691e641b931e083a0d92d"
    news_url = "https://yh-finance.p.rapidapi.com/news/v2/get-details"
    post_news_url = "https://yh-finance.p.rapidapi.com/news/v2/list"
    recommendation_url = "https://yh-finance.p.rapidapi.com/stock/v2/get-recommendations"
    chart_url = "https://yh-finance.p.rapidapi.com/stock/v2/get-chart"
    insight_url = "https://yh-finance.p.rapidapi.com/stock/v2/get-insights"
    gainers_url = "https://financialmodelingprep.com/api/v3/stock/gainers" + FMP_apiKey
    losers_url = "https://financialmodelingprep.com/api/v3/stock/losers" + FMP_apiKey
    marketHours_url = "https://financialmodelingprep.com/api/v3/is-the-market-open" + FMP_apiKey
    stockRating_url = "https://financialmodelingprep.com/api/v3/rating/"
    sectorPerformance_url = "https://financialmodelingprep.com/api/v3/stock/sectors-performance" + FMP_apiKey
    stockSummary_url = "https://yh-finance.p.rapidapi.com/stock/v2/get-summary"

    headers = {
        'x-rapidapi-host': apihost,
        'x-rapidapi-key': apikey
    }

    PROJECT_NAME = "WallStreet"
    GOOGLE_CLIENT_ID = ''
    GOOGLE_CLIENT_SECRET = ''
    GOOGLE_DISCOVERY_URL = ("https://accounts.google.com/.well-known/openid-configuration")

    # db credentials
    db_host = 'postgres.buildyourownmind.com'
    db_database = 'wall_street'
    db_username = 'postgres'
    db_password = 'StrongPassword'

