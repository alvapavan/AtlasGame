from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from game import AtlasGame
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = pd.read_csv('country-list.csv')
death_points = ['A', 'D', 'E', 'I', 'N', 'O', 'R', 'U', 'Y']

game = AtlasGame(data, death_points)

class PlaceInput(BaseModel):
    word: str

@app.post("/opponent-turn")
async def oppn_turn(input: PlaceInput):
    place, valid = game.oppn_turn(input.word)
    if not valid:
        raise HTTPException(status_code=400, detail=place)
    return {"opponent_word": place, "next_letter": game.current_letter}

@app.get("/system-turn")
async def system_turn():
    system_word, game_on = game.system_turn()
    if not game_on:
        return {"message": "You Won! The Game is Over"}
    return {"system_word": system_word, "next_letter": game.current_letter}

@app.get("/game-status")
async def game_status():
    return {"game_on": game.game_on, "current_letter": game.current_letter}

@app.post("/start")
async def start_game():
    global game
    # Reinitialize the game
    game = AtlasGame(data, death_points)
    return {"message": "New game started!", "current_letter": game.current_letter}