from stockapi import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context=('/home/ec2-user/code/wall_street_trade/stockapi/cert.pem', '/home/ec2-user/code/wall_street_trade/stockapi/key.pem'))
