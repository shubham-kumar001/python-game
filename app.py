from flask import Flask, render_template, jsonify, request
import json
import os
from datetime import datetime

app = Flask(__name__)

# High scores file
HIGH_SCORES_FILE = 'high_scores.json'

def load_high_scores():
    """Load high scores from file"""
    if os.path.exists(HIGH_SCORES_FILE):
        with open(HIGH_SCORES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_high_score(name, score):
    """Save a new high score"""
    scores = load_high_scores()
    scores.append({
        'name': name,
        'score': score,
        'date': datetime.now().strftime('%Y-%m-%d %H:%M')
    })
    # Keep top 10 scores
    scores.sort(key=lambda x: x['score'], reverse=True)
    scores = scores[:10]
    
    with open(HIGH_SCORES_FILE, 'w') as f:
        json.dump(scores, f, indent=2)
    return scores

@app.route('/')
def index():
    """Render the game page"""
    return render_template('index.html')

@app.route('/api/high-scores', methods=['GET'])
def get_high_scores():
    """Get high scores"""
    return jsonify(load_high_scores())

@app.route('/api/save-score', methods=['POST'])
def post_score():
    """Save a new high score"""
    data = request.json
    name = data.get('name', 'Anonymous')
    score = data.get('score', 0)
    
    scores = save_high_score(name, score)
    return jsonify({'success': True, 'scores': scores})

@app.route('/api/game-state', methods=['GET'])
def game_state():
    """Return initial game state"""
    return jsonify({
        'player': {
            'x': 400,
            'y': 500,
            'speed': 5,
            'health': 100
        },
        'enemies': [
            {'type': 'basic', 'speed': 2, 'health': 20},
            {'type': 'fast', 'speed': 4, 'health': 10},
            {'type': 'tank', 'speed': 1, 'health': 50}
        ],
        'bullets': {
            'player_speed': 7,
            'enemy_speed': 4
        },
        'powerups': [
            {'type': 'health', 'effect': 25},
            {'type': 'rapid_fire', 'effect': 3},
            {'type': 'shield', 'effect': 30}
        ]
    })

if __name__ == '__main__':
    # Create high scores file if it doesn't exist
    if not os.path.exists(HIGH_SCORES_FILE):
        with open(HIGH_SCORES_FILE, 'w') as f:
            json.dump([], f)
    
    app.run(debug=True, host='0.0.0.0', port=5000)