from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "todo_app")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "123Pass.in")

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, title, description FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT 5;")
        tasks = cur.fetchall()
        cur.close()
        conn.close()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2]
            })
        return jsonify(task_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        if not data or 'title' not in data:
            return jsonify({'error': 'Title is required!'}), 400

        title = data['title']
        description = data.get('description', '')

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO task (title, description) VALUES (%s, %s) RETURNING id;', (title, description))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'id': new_id, 'title': title, 'description': description}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:task_id>/complete', methods=['POST'])
def complete_task(task_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('UPDATE task SET completed = TRUE WHERE id = %s;', (task_id,))
        
        if cur.rowcount == 0:
            return jsonify({'error': 'Task not found'}), 404

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'Task marked as complete'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)