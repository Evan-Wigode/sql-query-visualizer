from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

conn = sqlite3.connect('sample.db')
print("Opened database successfully")

conn.execute('''CREATE TABLE IF NOT EXISTS SAMPLE
        (ID INT PRIMARY KEY NOT NULL,
        NAME TEXT NOT NULL);''')
print("Table created successfully")

conn.close()

app = Flask(__name__)
CORS(app)  # This is to allow requests from your React frontend

DATABASE = 'sample.db'
    
@app.route('/execute', methods=['POST'])
def execute_query():
    query = request.json['query']
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Execute the provided query
        cursor.execute(query)

        # Commit changes to the database. Important for INSERT, UPDATE, DELETE
        conn.commit()

        # Always fetch the updated table data after any query
        cursor.execute("SELECT * FROM SAMPLE")

        rows = cursor.fetchall()

        columns = [column[0] for column in cursor.description]
        data = {
            "columns": columns,
            "rows": rows
        }

        conn.close()

        return jsonify({'status': 'success', 'data': data})

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
