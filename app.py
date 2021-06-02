# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
import pandas as pd
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

engine = create_engine("postgresql://{user}:{pw}@{host}:{port}/{db}"
                       .format(user=os.getenv('DB_USER'),
                               pw=os.getenv('DB_PASSW'),
                               host=os.getenv('DB_HOST'),
                               port=os.getenv('DB_PORT'),
                               db=os.getenv('DB_NAME')))

@app.route('/', methods=['GET'])
def index():
    return render_template('ranking.html')

@app.route('/matrix', methods=['GET'])
def matrix():
    return render_template('matrix.html')

@app.route('/ranking', methods=['GET'])
def ranking():
    indicators = request.args.getlist('indicators[]')
    data =  get_indicators_ranking(indicators)
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/bool-matrix', methods=['GET'])
def boolean_matrix():
    data = get_boolean_matrix()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


def get_indicators_ranking(indicators_list):
    result = pd.DataFrame(data = [])
    if(len(indicators_list) == 0):
        return []
    for indicator in indicators_list:
        df = pd.read_sql("SELECT * FROM " + indicator, con=engine)
        df.index = df['ticker']
        del df['index']
        del df['ticker']
        result = result.add(df, fill_value=0)
    result['ticker'] = result.index
    col_ticker = result.pop('ticker')
    result.insert(0, col_ticker.name, col_ticker)
    col_rank = result.pop('rank')
    result.insert(len(result.columns), col_rank.name, col_rank)
    result = result.sort_values(by='rank', ascending=False).head(20)
    return result.to_json(orient="split")

def get_boolean_matrix():
    df = pd.read_sql("SELECT * FROM boolean_matrix", con=engine)
    return df.to_json(orient="split")


if __name__ == '__main__':
    app.run()