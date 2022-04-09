from datetime import datetime

from . import db

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


# create Table stockinfo
class stockinfo(db.Model):
    symbol = db.Column(db.String(10), primary_key=True)
    industry = db.Column(db.String(250))
    revenueGrowth = db.Column(db.Numeric(12, 2), nullable=True)
    targetLowPrice = db.Column(db.Numeric(12, 2), nullable=True)
    targetHighPrice = db.Column(db.Numeric(12, 2), nullable=True)
    recommendationKey = db.Column(db.String(30), nullable=True)
    grossProfits = db.Column(db.BigInteger(), nullable=True)
    currentPrice = db.Column(db.Numeric(12, 2), nullable=True)
    numberOfAnalystOpinions = db.Column(db.Integer(), nullable=True)
    totalRevenue = db.Column(db.BigInteger(), nullable=True)
    heldPercentInstitutions = db.Column(db.Numeric(10, 2), nullable=True)
    shortRatio = db.Column(db.Numeric(10, 2), nullable=True)
    beta = db.Column(db.Numeric(10, 2), nullable=True)
    regularMarketDayHigh = db.Column(db.Numeric(10, 2), nullable=True)
    regularMarketDayLow = db.Column(db.Numeric(10, 2), nullable=True)
    regularMarketVolume = db.Column(db.BigInteger(), nullable=True)
    marketCap = db.Column(db.BigInteger(), nullable=True)
    fiftyTwoWeekHigh = db.Column(db.Numeric(10, 2), nullable=True)
    fiftyTwoWeekLow = db.Column(db.Numeric(10, 2), nullable=True)
    dividendYield = db.Column(db.Numeric(10, 2), nullable=True)

    def __init__(self, symbol, industry, revenueGrowth, targetLowPrice,
                 targetHighPrice, recommendationKey, grossProfits, currentPrice, numberOfAnalystOpinions,
                 totalRevenue, heldPercentInstitutions, shortRatio, beta, regularMarketDayHigh, regularMarketDayLow,
                 regularMarketVolume, marketCap, fiftyTwoWeekHigh, fiftyTwoWeekLow, dividendYield):
        self.symbol = symbol
        self.industry = industry
        self.revenueGrowth = revenueGrowth
        self.targetLowPrice = targetLowPrice
        self.targetHighPrice = targetHighPrice
        self.recommendationKey = recommendationKey
        self.grossProfits = grossProfits
        self.currentPrice = currentPrice
        self.numberOfAnalystOpinions = numberOfAnalystOpinions
        self.totalRevenue = totalRevenue
        self.heldPercentInstitutions = heldPercentInstitutions
        self.shortRatio = shortRatio
        self.beta = beta
        self.regularMarketDayHigh = regularMarketDayHigh
        self.regularMarketDayLow = regularMarketDayLow
        self.regularMarketVolume = regularMarketVolume
        self.marketCap = marketCap
        self.fiftyTwoWeekHigh = fiftyTwoWeekHigh
        self.fiftyTwoWeekLow = fiftyTwoWeekLow
        self.dividendYield = dividendYield


class users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(15), nullable=False)
    fn = db.Column(db.String(25), nullable=False)
    ln = db.Column(db.String(25), nullable=False)
    phone_no = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(25), nullable=False)

    def __init__(self, password, fn, ln, phone_no, email):
        self.password = password
        self.fn = fn
        self.ln = ln
        self.phone_no = phone_no
        self.email = email

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class users_account(db.Model):
    account_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    symbol = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Numeric(4), nullable=True)
    cost_basis = db.Column(db.Numeric(12, 2), nullable=False)
    purchase_date = db.Column(db.DateTime, nullable=False)
    sell_date = db.Column(db.DateTime, nullable=True)
    sell_price = db.Column(db.Numeric(12, 2), nullable=True)
    total_gain = db.Column(db.Numeric(12, 2), nullable=True)
    total_loss = db.Column(db.Numeric(12, 2), nullable=True)

    def __init__(self, user_id, symbol, quantity,cost_basis, purchase_date, sell_date, sell_price, total_gain,
                 total_loss):
        self.user_id = user_id
        self.symbol = symbol
        self.cost_basis = cost_basis
        self.quantity=quantity
        self.purchase_date = purchase_date
        self.sell_date = sell_date
        self.sell_price = sell_price
        self.total_gain = total_gain
        self.total_loss = total_loss


class user_credits(db.Model):
    credit_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    credit_amount = db.Column(db.Numeric(12, 2), nullable=False)

    def __init__(self, user_id, credit_amount):
        self.user_id = user_id
        self.credit_amount = credit_amount


class credit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)

    def __init__(self, amount):
        self.amount = amount
