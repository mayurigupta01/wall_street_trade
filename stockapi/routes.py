import decimal
from aifc import Error
from datetime import datetime

from . import db, app
from flask import Blueprint, request, jsonify, redirect, url_for, json
import yfinance as yf
from stockapi.models import stockinfo, users, credit, user_credits, users_account

from stockapi.symbols import Tickers, Summary, Charts, CInsight, Rating, StockSummary
from bs4 import BeautifulSoup
from flask_login import (
    LoginManager,
    current_user,

)
from oauthlib.oauth2 import WebApplicationClient
# Python standard libraries
import json

from stockapi.config import Config
from stockapi import psqlprovider
from stockapi.jwt_helper import encode_jwt_token
from stockapi.user import User
import requests

# Configuration
GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET
GOOGLE_DISCOVERY_URL = Config.GOOGLE_DISCOVERY_URL

# User session management setup
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)

# OAuth 2 client1 setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

stock_api_blueprint = Blueprint("stockapi", __name__)


# engine = create_engine(
# 'postgresql://' + Config.db_username + ':' + Config.db_password + '@' + Config.db_host + '/' + Config.db_database)
# inspector = inspect(engine)


# add try and except
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


@stock_api_blueprint.route('/', methods=['GET'])
@stock_api_blueprint.route('/home', methods=['GET'])
def get_home_page():
    try:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200
    except:
        return jsonify({"Message": "Home page is unreachable"}), 400


@stock_api_blueprint.route("/user", methods=['POST'])
def create_user():
    json_data = request.get_json()
    try:
        print(json_data)
        fn = json_data['first_name']
        ln = json_data['last_name']
        password = json_data['password']
        phone_no = json_data['phone_number']
        email = json_data['email']
        print(fn)
        db_object = users(password=password, fn=fn, ln=ln, phone_no=phone_no, email=email)
        db.session.add(db_object)
        db.session.commit()
        db.session.flush()
        shutdown_session()
    except Error as e:
        return jsonify({"message": e.message}), 400
    return jsonify({"message": "user Registration Successful"}), 200


@stock_api_blueprint.route("/login", methods=['POST'])
def login():
    json_data = request.get_json()
    try:
        username = json_data['username']
        password = json_data['password']
        db_object = users.query.filter_by(email=username).first()
        if db_object is None or db_object.email != username or db_object.password != password:
            return jsonify({"Unsuccessful Login": "Invalid user and password!"}), 400
        else:
            user_exiting_id = db_object.id
            encoded_token = encode_jwt_token(db_object)

            return jsonify({"access_token": encoded_token,
                            "user_id": user_exiting_id}), 200
    except Error as e:
        return jsonify({"access_token": e.__cause__}), 400


@stock_api_blueprint.route('/add_ticker', methods=['GET', 'POST'])
def add_ticker():
    if request.method == 'POST':
        # Read the symbol from the frontend app.(admin work)
        shutdown_session()
        symbol = request.json['symbol']
        quote = yf.Ticker(symbol)
        tickers = Tickers(quote)
        stock_object = stockinfo(symbol, tickers.industry, tickers.revenueGrowth, tickers.targetLowPrice,
                                 tickers.targetHighPrice, tickers.recommendationKey, tickers.grossProfits,
                                 tickers.currentPrice, tickers.numberOfAnalystOpinions, tickers.totalRevenue,
                                 tickers.heldPercentInstitutions, tickers.shortRatio, tickers.beta,
                                 tickers.regularMarketDayHigh, tickers.regularMarketDayLow, tickers.regularMarketVolume,
                                 tickers.marketCap, tickers.fiftyTwoWeekHigh, tickers.fiftyTwoWeekLow,
                                 tickers.dividendYield)
        # adding data to stockinfo table
        # if inspector.has_table(stockinfo.__name__):
        db.session.add(stock_object)
        db.session.commit()
        db.session.flush()
        shutdown_session()
        # else:
        # db.create_all()
        # db.session.add(stock_object)
        # db.session.commit()
        # db.session.flush()

        return jsonify({"symbol": symbol,
                        "Message": "successfully added" + ' ' + symbol + ' ' + '.'
                        }), 200


@stock_api_blueprint.route('/update_ticker', methods=['GET', 'POST'])
def update_ticker():
    try:
        if request.method == 'POST':
            # Read the symbol from the frontend app.(admin work)

            symbol = request.json['symbol']
            quote = yf.Ticker(symbol)
            tickers = Tickers(quote)
            db_object = stockinfo.query.filter_by(symbol=symbol).first()
            stock_object = stockinfo(symbol, tickers.industry, tickers.revenueGrowth, tickers.targetLowPrice,
                                     tickers.targetHighPrice, tickers.recommendationKey, tickers.grossProfits,
                                     tickers.currentPrice, tickers.numberOfAnalystOpinions, tickers.totalRevenue,
                                     tickers.heldPercentInstitutions, tickers.shortRatio, tickers.beta,
                                     tickers.regularMarketDayHigh, tickers.regularMarketDayLow,
                                     tickers.regularMarketVolume,
                                     tickers.marketCap, tickers.fiftyTwoWeekHigh, tickers.fiftyTwoWeekLow,
                                     tickers.dividendYield)

            # update feilds in DB.
            db_object.targetLowPrice = stock_object.targetLowPrice
            db_object.targetHighPrice = stock_object.targetHighPrice
            db_object.recommendationKey = stock_object.recommendationKey
            db_object.currentPrice = stock_object.currentPrice
            db_object.totalRevenue = stock_object.totalRevenue
            db_object.regularMarketDayHigh = stock_object.regularMarketDayHigh
            db_object.regularMarketDayLow = stock_object.regularMarketDayLow
            db_object.fiftyTwoWeekHigh = stock_object.fiftyTwoWeekHigh
            db_object.fiftyTwoWeekLow = stock_object.fiftyTwoWeekLow
            db.session.commit()
            shutdown_session()
            return jsonify({"symbol": symbol,
                            "message": "Updated successfully" + ' ' + symbol + ' ' + '.'
                            }), 200

    except:
        return jsonify({"symbol": symbol,
                        "message": "Symbol not added" + ' ' + symbol + ' ' + '.'
                        }), 400
    else:
        return jsonify({"message": "welcome to wall street home page"}), 200


# API endpoint to fetch ticker info from DB and show on the UI on Popup

@stock_api_blueprint.route('/stock/info', methods=['GET', 'POST'])
def get_stock_info():
    if request.method == 'POST':
        # Read the symbol from the frontend app.
        try:
            symbol = request.json['symbol']
            stock_info_db = stockinfo.query.filter_by(symbol=symbol).first()
            my_dict = Summary.to_dict(stock_info_db)
            return jsonify(my_dict), 200
        except:
            return jsonify({"Message": "Cannot retrieve stock info at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


@stock_api_blueprint.route('/get-stock-summary', methods=['POST'])
def get_stock_summary():
    if request.method == 'POST':
        try:
            symbol = request.get_json()
            symbol = symbol['search'].upper()

            url = Config.stockSummary_url
            querystring = {"symbol": symbol, "region": "US"}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            response1 = response.json()
            # stockSummary = StockSummary.getStockSummary(response)

            url = Config.stockRating_url + symbol + Config.FMP_apiKey
            response = requests.request("GET", url)
            response2 = response.json()
            # stockRating = Rating.rating(response)

            url = Config.recommendation_url
            querystring = {"symbol": symbol}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            response3 = response.json()

            stockSummary = StockSummary.getStockSummary(response1, response2, response3)

            """ payload = [
                "stockSummary": stockSummary,
                "stockRating": stockRating,
                "similarStocks": similarStocks
            ] """
            return jsonify(stockSummary), 200
        except:
            return jsonify({"Message": "Cannot retrieve stock summary at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# trending tickers based on user selection
@stock_api_blueprint.route('/trending/tickers', methods=['GET'])
def get_trending_ticker():
    if request.method == 'GET':
        try:
            # selection = request.json['selection']
            # top_n = int(selection)
            url = Config.url
            querystring = {"region": "US"}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            my_dict = response.json()
            trending_list = my_dict['finance']['result'][0]['quotes']

            # trending_tickers = {}
            trending_tickers = []
            for index in range(5):
                # trending_tickers[trending_list[index]["symbol"]] = trending_list[index]["shortName"]
                trending_tickers.append(
                    {"symbol": trending_list[index]["symbol"], "company": trending_list[index]["shortName"]})
            return jsonify(trending_tickers), 200
        except:
            return jsonify(
                {"Message": "Cannot retrieve trending tickers at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get real time current stock price
@stock_api_blueprint.route('/realtime/stock/price', methods=['GET', 'POST'])
def get_stock_price():
    if request.method == 'POST':
        # Read the symbol from the frontend app.
        try:
            symbol = request.json['symbol']
            quote = yf.Ticker(symbol)
            currentPrice = quote.info['currentPrice']
            return jsonify({
                "currentStockPrice": currentPrice
            }), 200

        except:
            return jsonify({"Message": "Cannot retrieve current stock price"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get UUId of news
def get_news_uuid():
    try:
        url = Config.post_news_url
        querystring = {"region": "US", "snippetCount": "5"}
        payload = ""
        top_n = 5
        response_list = []
        headers = {
            'content-type': "text/plain",
            'x-rapidapi-host': Config.apihost,
            'x-rapidapi-key': Config.apikey
        }
        response = requests.request("POST", url, data=payload, headers=headers, params=querystring)
        my_dict = response.json()
        for index in range(0, top_n):
            response_list.append(my_dict["data"]["main"]["stream"][index]["id"])
        return response_list
    except:
        return "cannot retrieve UUID's+"


@stock_api_blueprint.route('/news', methods=['GET'])
def get_news():
    try:
        uuid_list = get_news_uuid()
        url = Config.news_url
        # news_dict = {}
        news_dict = []
        counter = 1
        for uuid in uuid_list:
            querystring = {"uuid": uuid, "region": "US"}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            data = response.json()
            print(data)
            for item in data["data"]["contents"]:
                if item["content"]["clickThroughUrl"] is None:
                    clickThrough = item["content"]["canonicalUrl"]["url"]
                    # clickThrough = "URL Not available from the news maker"
                else:
                    clickThrough = item["content"]["clickThroughUrl"]["url"]
                title = item["content"]["title"]
                # news_dict[counter] = [title, clickThrough]
                news_dict.append({"title": title, "url": clickThrough})
                counter += 1
        return jsonify(news_dict), 200
    except:
        return jsonify({"Message": "Cannot retrieve news at this time"}), 401


# get similar stocks of a given stock
@stock_api_blueprint.route('/lookalike', methods=['GET', 'POST'])
def get_same_category():
    rec_dict = {}
    if request.method == 'POST':
        try:
            # Enter symbol and get the similar recommendation
            symbol = request.json['symbol']
            url = Config.recommendation_url
            querystring = {"symbol": symbol}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            my_dict = response.json()
            recommendation_list = my_dict['finance']['result'][0]['quotes']
            for index in recommendation_list:
                rec_dict[index['shortName'] + '(' + index['symbol'] + ')'] = index["regularMarketPrice"]

            return jsonify(rec_dict), 200
        except:
            return jsonify({"Message": "Cannot retrieve same category stocks at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get charts of the symbol
@stock_api_blueprint.route('/charts', methods=['GET', 'POST'])
def get_charts():
    if request.method == 'POST':
        try:
            # Enter symbol and get the charts .
            symbol = request.json['symbol']
            url = Config.chart_url
            querystring = {"interval": "5m", "symbol": symbol, "range": "1d", "region": "US"}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            data = response.json()
            charts_dict = Charts.create_charts(data['chart']['result'][0]['meta'])
            return jsonify(charts_dict), 200
        except:
            return jsonify({"Message": "Cannot retrieve charts at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get insight about a company
@stock_api_blueprint.route('/company/insight', methods=['GET', 'POST'])
def get_company_insight():
    if request.method == 'POST':
        try:
            # Enter symbol and get company insight.
            symbol = request.json['symbol']
            url = Config.insight_url
            querystring = {"symbol": symbol}
            response = requests.request("GET", url, headers=Config.headers, params=querystring)
            data = response.json()
            company_dict = CInsight.get_insight(data['finance']['result'])
            return jsonify(company_dict)
        except:
            return jsonify({"Message": "Cannot retrieve company insight at this time"}), 401
    else:
        return jsonify({"message": "welcome to wall street home page"}), 200


@stock_api_blueprint.route("/google_login/callback")
def callback():
    # Get authorization code Google sent back to you
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )

    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET)
    )

    # Parse the tokens!
    token = token_response.json()
    client.parse_request_body_response(json.dumps(token_response.json()))
    # token_temp  = token_response.json()
    # print(token_temp)
    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    client.access_token
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    print(userinfo_response)
    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    user_info = userinfo_response.json()
    if userinfo_response.json().get("email_verified"):
        users_email = userinfo_response.json()["email"]

        # // Get user from db
        user = psqlprovider.get_user(users_email)
        if user is not None:
            user = User(user['email'], user['fn'], user['ln'], user['user_id'], user['role_id'])
            encoded_token = encode_jwt_token(user);

            return jsonify({"access_token": encoded_token}), 200
        else:
            return jsonify({"access_token": None}), 400
    else:
        return "User email not available or not verified by Google.", 400


@stock_api_blueprint.route("/current-user")
def get_current_user():
    user = psqlprovider.get_user(current_user.get_id())
    print("current user", user)
    return jsonify(user), 200


@stock_api_blueprint.route("/google_login")
def google_login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


# get the top 5 gainers for the day
@stock_api_blueprint.route('/get-gainers', methods=['GET'])
def get_gainers():
    if request.method == 'GET':
        try:
            gainersDictionary = []
            url = Config.gainers_url
            response = requests.request("GET", url)
            response = response.json()
            for x in range(5):
                gainersDictionary.append({"stock": response["mostGainerStock"][x]["ticker"],
                                          "price": response["mostGainerStock"][x]["price"],
                                          "changes": response["mostGainerStock"][x]["changes"],
                                          "changePercent": response["mostGainerStock"][x]["changesPercentage"]})
            return jsonify(gainersDictionary), 200
        except:
            return jsonify({"Message": "Cannot retrieve top 5 gainers at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get the top 5 losers for the day
@stock_api_blueprint.route('/get-losers', methods=['GET'])
def get_losers():
    if request.method == 'GET':
        try:
            losersDictionary = []
            url = Config.losers_url
            response = requests.request("GET", url)
            response = response.json()
            for x in range(5):
                losersDictionary.append({"stock": response["mostLoserStock"][x]["ticker"],
                                         "price": response["mostLoserStock"][x]["price"],
                                         "changes": response["mostLoserStock"][x]["changes"],
                                         "changePercent": response["mostLoserStock"][x]["changesPercentage"]})
            return jsonify(losersDictionary), 200
        except:
            return jsonify({"Message": "Cannot retrieve top 5 losers at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get market open and close times as well as if market is open
@stock_api_blueprint.route('/get-market-hours', methods=['GET'])
def get_market_hours():
    if request.method == 'GET':
        try:
            marketHours = []
            url = Config.marketHours_url
            response = requests.request("GET", url)
            response = response.json()
            marketHours.append({"isMarketOpen": response["isTheStockMarketOpen"],
                                "marketOpenHours": response['stockMarketHours']['openingHour'],
                                "marketCloseHours": response['stockMarketHours']['closingHour']})
            return jsonify(marketHours), 200
        except:
            return jsonify({"Message": "Cannot retrieve market hours at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get the rating of a stock
@stock_api_blueprint.route('/get-stock-rating', methods=['POST'])
def get_stock_rating():
    if request.method == 'POST':
        try:
            symbol = request.get_json()
            symbol = symbol['search'].upper()
            url = Config.stockRating_url + symbol + Config.FMP_apiKey
            response = requests.request("GET", url)
            response = response.json()
            stockRating = Rating.rating(response)
            return jsonify(stockRating), 200
        except:
            return jsonify({"Message": "Cannot retrieve stock rating at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# get performance metrics of 15 sectors
@stock_api_blueprint.route('/get-sector-performance', methods=['GET'])
def get_sector_performance():
    if request.method == 'GET':
        try:
            sectorPerformance = []
            url = Config.sectorPerformance_url
            response = requests.request("GET", url)
            response = response.json()
            for x in range(14):
                sectorPerformance.append({"sector": response['sectorPerformance'][x]['sector'],
                                          "change": response['sectorPerformance'][x]['changesPercentage']})
            return jsonify(sectorPerformance), 200
        except:
            return jsonify({"Message": "Cannot retrieve sector performance at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# Web scraper for top 5 most mentioned stock tickers on Reddit within 24 hour period
# https://realpython.com/beautiful-soup-web-scraper-python/
@stock_api_blueprint.route('/get-reddit-mentions', methods=['GET'])
def get_reddit_mentions():
    if request.method == 'GET':
        try:
            url = "https://wsbdaily.com/"
            page = requests.get(url)
            soup = BeautifulSoup(page.content, "html.parser")
            mentionedStocks = []

            results = soup.find(id="___gatsby")
            stockSymbol = results.find_all("span", class_="css-1sctek8 e1b8pdim9")
            companyName = results.find_all("span", class_="css-8k7y81 e1b8pdim12")
            # mentionCount = results.find_all("div", class_="px-4 py-4 text-right table-cell align-middle")

            for symbols, names, x in zip(stockSymbol, companyName, range(5)):
                mentionedStocks.append({"symbol": symbols.text, "company": names.text})
            return jsonify(mentionedStocks)
        except:
            return jsonify({"Message": "Cannot retrieve Reddit mentions at this time"}), 401
    else:
        return jsonify({"Message": "Welcome to Wall Street Trade"}), 200


# user credits backend call
@stock_api_blueprint.route('/add_credits', methods=['POST'])
def add_credits():
    try:
        if request.method == 'POST':
            request_data = request.get_json()
            amount = request_data['amount']
            db_object = credit(amount)
            db.session.add(db_object)
            db.session.commit()
            db.session.flush()
            shutdown_session()
            return {"message": "credits added successfully"}, 200
    except Error as e:
        return {"message": e.message}, 400


@stock_api_blueprint.route('/show_credits', methods=['GET'])
def show_credits():
    amount_list = []
    try:
        credit_object = credit.query.all()
        for amt in credit_object:
            amount_list.append(amt.amount)
        return json.dumps(amount_list, default=json_encode_decimal)
    except Error as e:
        return {"message": e.message}, 400


def json_encode_decimal(obj):
    if isinstance(obj, decimal.Decimal):
        return str(obj)
    raise TypeError(repr(obj) + " is not JSON serializable")


@stock_api_blueprint.route('/add_user_credits', methods=['POST', 'GET'])
def add_user_credits():
    try:
        if request.method == 'POST':
            request_data = request.get_json()
            user_id = request_data['user_id']
            print("userid", user_id)
            amount = request_data['amount']
            print("amount", amount)
            db_object = user_credits.query.filter_by(user_id=user_id).first()
            print(db_object)
            if db_object is None:
                print("adding user credits")
                db_object = user_credits(user_id, amount)
                db.session.add(db_object)
                db.session.commit()
                db.session.flush()
                shutdown_session()
            else:
                db_object.credit_amount = db_object.credit_amount + amount
                db.session.commit()
                shutdown_session()
            return jsonify({"Message": "Account is credited successfully"})
    except Error as e:
        return {"message": e.message}, 400
    else:
        return "Add credit to account", 200


@stock_api_blueprint.route('/update_user_credits', methods=['POST', 'GET'])
def update_amount():
    try:
        if request.method == 'POST':
            request_data = request.get_json()
            user_id = request_data['user_id']
            amount = request_data['amount']
            db_object = user_credits.query.filter_by(user_id=user_id).first()
            if db_object is None or db_object.user_id != user_id:
                return jsonify({"Message": "Invalid user id"})
            else:
                db_object.credit_amount = db_object.credit_amount + decimal.Decimal(amount)
                db.session.commit()
                shutdown_session()
            return jsonify({"Message": "Account is credited successfully with new amount"})
    except Error as e:
        return {"message": e.message}, 400
    else:
        return "Add credit to account", 200


@stock_api_blueprint.route('/get_user_credits/<user_id>', methods=['GET'])
def get_user_credits(user_id):
    try:
        db_object = user_credits.query.filter_by(user_id=user_id).first()
        user_balance = db_object.credit_amount
        return jsonify({"Available_balance": str(user_balance)}), 200
    except Error as e:
        return {"message": e.message}, 400


@stock_api_blueprint.route('/get_all_bought_stocks/<user_id>', methods=['GET'])
def get_all_bought_stocks(user_id):
    user_details = users_account.query.filter_by(user_id=user_id).all()
    print("users account", len(user_details))
    stockDetails = []
    for user_detail in user_details:
        stockDetails.append({"symbol": user_detail.symbol,
                             "costBasis": user_detail.cost_basis,
                             "quantity": user_detail.quantity,
                             "purchaseDate": user_detail.purchase_date,
                             "sellDate": user_detail.sell_date,
                             "sellPrice":user_detail.sell_price,
                             "totalGain":user_detail.total_gain,
                             "totalLoss":user_detail.total_loss
                             })
    return json.dumps(stockDetails, indent=4, sort_keys=True, default=str)


# Trading backend calls
@stock_api_blueprint.route('/buyStock', methods=['POST', 'GET'])
def buy_symbol():
    try:
        if request.method == 'POST':
            request_data = request.get_json()
            user_id = request_data['user_id']
            symbol = request_data['symbol']
            quantity = request_data['quantity']
            buy_price = request_data['buy_price']
            # calculate balance
            # get balance of the user from user_credits
            credit_object = user_credits.query.filter_by(user_id=user_id).first()
            available_balance = credit_object.credit_amount - (decimal.Decimal(buy_price)) * quantity

            # Check if user has enough balance to buy
            if decimal.Decimal(buy_price) * quantity > available_balance:
                return jsonify({"message": "not enough credits to buy , add credit"}), 401
            else:
                user_object = users_account.query.filter_by(symbol=symbol).first()
                if user_object is None:
                    user_object = users_account(user_id=user_id, symbol=symbol, quantity=quantity, cost_basis=buy_price,
                                                purchase_date=datetime.now(), sell_date=None, sell_price=None,
                                                total_gain=None, total_loss=None)
                    db.session.add(user_object)
                    db.session.commit()
                    db.session.flush()
                else:
                    user_object.symbol = symbol
                    user_object.quantity = user_object.quantity + quantity
                    if buy_price > user_object.cost_basis:
                        user_object.cost_basis = user_object.cost_basis + \
                                                 (decimal.Decimal(buy_price)) * decimal.Decimal('0.10')
                    else:
                        user_object.cost_basis = user_object.cost_basis - \
                                                 (decimal.Decimal(buy_price)) * decimal.Decimal('0.10')
                    db.session.commit()
                # update the user_credits table.
                credit_object.credit_amount = available_balance
                db.session.commit()
                shutdown_session()
                return jsonify({"Stock": symbol,
                                "Price": buy_price,
                                "available_balance": str(available_balance),
                                "Message": "Successful"}), 200
    except Error as e:
        return {"message": e.message}, 400


@stock_api_blueprint.route('/sellstock', methods=['POST', 'GET'])
def sell_symbol():
    try:
        if request.method == 'POST':
            request_data = request.get_json()
            user_id = request_data['user_id']
            symbol = request_data['symbol']
            quantity = request_data['quantity']
            sell_price = request_data['sell_price']
            # calculate balance
            # get balance of the user from user_credits
            credit_object = user_credits.query.filter_by(user_id=user_id).first()
            available_balance = credit_object.credit_amount - (decimal.Decimal(sell_price)) * quantity
            user_object = users_account.query.filter_by(symbol=symbol).first()
            if user_object.quantity == quantity:
                user_object.quantity = 0
                user_object.sell_date = datetime.now()
                user_object.sell_price = sell_price
                credit_object.credit_amount = available_balance
                diff = quantity * (decimal.Decimal(sell_price)) - quantity * user_object.cost_basis
                if diff > 0:
                    user_object.total_gain = diff
                else:
                    user_object.total_loss = quantity * user_object.cost_basis - quantity * (
                        decimal.Decimal(sell_price))
                db.session.commit()

            else:
                diff1 = quantity * (decimal.Decimal(sell_price)) - quantity * user_object.cost_basis
                if diff1 > 0:
                    user_object.total_gain = diff1
                else:
                    user_object.total_loss = quantity * user_object.cost_basis - quantity * (
                        decimal.Decimal(sell_price))
                db.session.commit()
                user_object.quantity = user_object.quantity - quantity
                user_object.sell_date = datetime.now()
                credit_object.credit_amount = available_balance
                user_object.sell_price = sell_price
                db.session.commit()
                shutdown_session()
            return jsonify({"message": "sell is successful",
                            "symbol": symbol,
                            "available_balance": str(available_balance),
                            "quantity": quantity
                            }), 200
    except Error as e:
        return {"message": e.message}, 400


@stock_api_blueprint.route('/viewportfolio/<user_id>', methods=['GET'])
def view_portfolio(user_id):
    try:
        user_object = users_account.query.filter_by(user_id=user_id).first()
        # TODO - return the whole db object to dictionary.
        return "Show portfolio"
    except Error as e:
        return {"message": e.message}, 400


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()
