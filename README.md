A thrilling web-based plane shooter game built with Python Flask backend and modern HTML5/CSS3/JavaScript frontend. Dodge enemy fire, collect power-ups, and climb the leaderboard!

🎮 Game Features
Fast-paced Action: Intense aerial combat with smooth controls

Multiple Enemy Types: Basic, Fast, and Tank enemies with unique behaviors

Power-up System: Health, Rapid Fire, and Shield power-ups

Progressive Difficulty: Levels increase enemy spawn rates

High Score Tracking: Save your best scores locally

Visual Effects: Particle explosions, animations, and smooth transitions

Responsive Design: Play on desktop or mobile devices

🎯 Game Controls
Control	Action
Arrow Keys or WASD	Move plane in all directions
Spacebar	Shoot bullets
P	Pause/Resume game
Enter	Start game from start screen
Mouse	Click buttons and UI elements
🚀 Installation & Setup
Prerequisites
Python 3.8 or higher

pip (Python package manager)

Step 1: Clone or Download the Project
bash
git clone <repository-url>
cd plane_game
Or download the ZIP file and extract it to a folder named plane_game.

Step 2: Install Python Dependencies
bash
pip install flask
Step 3: Project Structure
Ensure your project has the following structure:

text
plane_game/
├── app.py              # Flask backend
├── static/
│   ├── css/
│   │   └── style.css   # Game styling
│   ├── js/
│   │   └── game.js     # Game logic
│   └── images/         # Game assets (optional)
├── templates/
│   └── index.html      # Game interface
└── high_scores.json    # Created automatically
Step 4: Run the Game Server
bash
python app.py
Step 5: Play the Game
Open your web browser and navigate to:

text
http://localhost:5000
📁 Project Structure Details
Backend (app.py)
Flask Web Server: Handles HTTP requests and serves the game

REST API Endpoints:

GET / - Serves the main game page

GET /api/high-scores - Returns high scores list

POST /api/save-score - Saves a new high score

GET /api/game-state - Returns initial game configuration

Data Persistence: Saves high scores to high_scores.json

Frontend (templates/index.html)
Game Interface: Complete HTML structure with:

Game canvas for rendering

Start/Game Over/Pause screens

High scores panel

Game statistics display

Control instructions

Styling (static/css/style.css)
Modern UI Design: Cyberpunk-inspired color scheme

Responsive Layout: Adapts to different screen sizes

Animations: Pulse, explosion, and transition effects

Custom Scrollbars: Styled for consistency

HUD Elements: Health bar, score display, power-up indicators

Game Logic (static/js/game.js)
Game Engine: Main game loop with requestAnimationFrame

Physics: Collision detection, movement, spawning logic

Game Objects: Player, enemies, bullets, power-ups, explosions

State Management: Game states (start, playing, paused, gameover)

Power-up System: Timed power-ups with visual indicators

Score System: Progressive scoring with multipliers

🎮 Game Mechanics
Player Plane
Health: 100 points (displayed as health bar)

Movement: Smooth 8-directional movement

Shooting: Automatic or manual bullet firing

Collision: Takes damage when hitting enemies

Enemy Types
Basic Enemy (Red)

Speed: 2

Health: 20

Points: 10

Fast Enemy (Orange)

Speed: 4

Health: 10

Points: 15

Tank Enemy (Blue)

Speed: 1

Health: 50

Points: 25

Power-ups
Health Pack (❤️): Restores 25 health

Rapid Fire (⚡): Increases fire rate for 10 seconds

Shield (🛡️): Invincibility for 8 seconds

Scoring System
Destroy Basic Enemy: 10 points

Destroy Fast Enemy: 15 points

Destroy Tank Enemy: 25 points

Level Bonus: 100 points per level

Multiplier: Higher levels give score multipliers

🛠️ Customization
Changing Game Difficulty
Edit game.js to modify:

Enemy spawn rates

Enemy health and speed

Player movement speed

Power-up frequencies

Modifying Visuals
Edit style.css to change:

Color schemes

Fonts and typography

Animation speeds

Layout dimensions

Adding New Features
New Enemy Types: Add to enemy types array in game.js

New Power-ups: Extend power-up system in game.js

Sound Effects: Add audio elements in index.html

New Levels: Modify level progression logic

📱 Mobile Support
The game is fully responsive and works on:

Desktop browsers (Chrome, Firefox, Safari, Edge)

Tablets (iPad, Android tablets)

Mobile phones (iPhone, Android)

Touch controls are automatically enabled on mobile devices.

🔧 Troubleshooting
Common Issues
Game won't start

Check if Flask is installed: pip list | grep Flask

Ensure port 5000 is not in use

Check browser console for JavaScript errors

High scores not saving

Verify write permissions in project directory

Check high_scores.json file exists

Look for errors in Flask console output

Graphics not displaying properly

Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

Check CSS file path in HTML

Verify all image assets are loaded

Controls not working

Ensure browser window is focused

Check for conflicting keyboard shortcuts

Verify event listeners in game.js

Debug Mode
Enable Flask debug mode by modifying app.py:

python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
🚀 Deployment
Local Network Play
To allow others on your network to play:

bash
python app.py --host=0.0.0.0 --port=5000
Cloud Deployment Options
Heroku: Create Procfile and deploy

PythonAnywhere: Upload files and configure web app

AWS EC2: Set up with Flask and Nginx

Google Cloud Run: Containerize and deploy

📈 Future Enhancements
Planned features for future versions:

Multiplayer mode

Boss battles

Additional weapon types

Sound effects and background music

Player achievements

Cloud save synchronization

Level editor

Daily challenges

👥 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is available for educational and personal use. Modify and distribute as needed.

🙏 Acknowledgments
Built with Flask

Font Awesome icons

Google Fonts (Orbitron, Roboto)

Inspired by classic arcade shoot 'em up games

🎯 Quick Start Commands
bash
# Install and run
git clone <repo>
cd plane_game
pip install flask
python app.py

# Or using pipenv (optional)
pipenv install flask
pipenv run python app.py

# Run with custom port
python app.py --port=8080
