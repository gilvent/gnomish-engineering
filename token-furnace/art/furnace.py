#!/usr/bin/env python3
"""Draws the token furnace's five heats into ../assets as pixel-art sprites. Needs Pillow.

Run it again after changing a sprite: python3 art/furnace.py [contact-sheet.png]
"""
import sys
from pathlib import Path

from PIL import Image

WIDTH, HEIGHT = 24, 24
ZOOM = 8
ASSETS = Path(__file__).resolve().parent.parent / "assets"

FIRE = {"K": "#1B1424", "D": "#2A1E22", "r": "#B5301F", "O": "#FF8A1F", "Y": "#FFD84A", "W": "#FFF8DC", "s": "#8E96A3",
        "S": "#C3CCD6"}
COLD_IRON = {"M": "#7C8896", "m": "#4F5966", "H": "#A9B4C0", "B": "#5F6875"}
WARM_IRON = {"M": "#8C7F86", "m": "#5E4B52", "H": "#BBA9A6", "B": "#7A5348"}
HOT_IRON = {"M": "#B5533A", "m": "#7A2E24", "H": "#E38A55", "B": "#D9642B"}
MOLTEN_IRON = {"M": "#E2452B", "m": "#A32218", "H": "#FF9B4A", "B": "#FFB53A"}

BODY = [
    "..........KKKK..........",
    ".........KHMMmK.........",
    ".........KHMMmK.........",
    ".....KKKKKHMMmKKKKK.....",
    "....KHHMMMMMMMMMMmmK....",
    "...KHMMMMMMMMMMMMMmmK...",
    "...KBBBBBBBBBBBBBBBBK...",
    "...KHMMMMMMMMMMMMMmmK...",
    "...KHMMKKKKKKKKKKMmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMKDDDDDDDDDDKmmK...",
    "...KHMMKKKKKKKKKKMmmK...",
    "...KBBBBBBBBBBBBBBBBK...",
    "....KMMMMMMMMMMMMmmK....",
    ".....KKKKKKKKKKKKKK.....",
    "....KmmK........KmmK....",
    "....KKKK........KKKK....",
]
BODY_TOP = HEIGHT - len(BODY)
MOUTH = (7, BODY_TOP + 9)
CHIMNEY_TOP = (6, 0)

EMBERS_FIRE = [
    "..........",
    "..........",
    "..........",
    "..........",
    ".r....r...",
    "rOr.rrOrr.",
]
KINDLED_FIRE = [
    "..........",
    "....O.....",
    "...OOO....",
    "..OOYOO.O.",
    ".OOYYYOOOr",
    "rOYYYYYOOO",
]
BLAZING_FIRE = [
    ".O..OO..O.",
    "OOOOOOOOO.",
    "OOYYOOYOOO",
    "OYYYYYYYOO",
    "OYYWWWYYYO",
    "YYWWWWWWYY",
]
WHITE_HOT_FIRE = [
    "OYYOOYYOOY",
    "YYYYYYYYYY",
    "YYWWYYWWYY",
    "YWWWWWWWWY",
    "WWWWWWWWWW",
    "WWWWWWWWWW",
]
MELTDOWN_FIRE = ["WWWWWWWWWW"] * 6

SMOKE = [
    "......s.....",
    ".....sS.....",
    "......s.....",
]
CHIMNEY_FLAME = [
    "............",
    "......O.....",
    ".....OYO....",
]
CHIMNEY_BLAZE = [
    ".....O.O....",
    "....OOYOO...",
    "....OYWYO...",
]
CHIMNEY_ERUPTION = [
    "..O..OYO..O.",
    "...OOYWYOO..",
    "...OYWWWYO..",
]
CRACKS = [
    "........................",
    "........................",
    "........................",
    "........................",
    "......Y.........Y.......",
    ".....Y...........Y......",
    "........................",
    "....Y..............Y....",
    "..O.Y..............Y.O..",
    ".OYO.Y............Y.OYO.",
    "..O..................O..",
    "........................",
    ".O....................O.",
    "OYO.Y..............Y.OYO",
    ".O..Y..............Y..O.",
    "....Y.............Y.....",
    "........................",
    ".....Y..........Y.......",
    "........................",
    "..Y.......YY.........Y..",
    ".YOY.....YOOY.......YOY.",
]

HEATS = {
    "embers": (COLD_IRON, EMBERS_FIRE, None, None),
    "kindled": (COLD_IRON, KINDLED_FIRE, SMOKE, None),
    "blazing": (WARM_IRON, BLAZING_FIRE, CHIMNEY_FLAME, None),
    "white-hot": (HOT_IRON, WHITE_HOT_FIRE, CHIMNEY_BLAZE, None),
    "meltdown": (MOLTEN_IRON, MELTDOWN_FIRE, CHIMNEY_ERUPTION, CRACKS),
}


def stamp(grid, patch, x, y):
    for dy, line in enumerate(patch):
        for dx, char in enumerate(line):
            if char != ".":
                grid[y + dy][x + dx] = char


def furnace(fire, above_chimney, cracks):
    grid = [["."] * WIDTH for _ in range(HEIGHT)]
    stamp(grid, BODY, 0, BODY_TOP)
    stamp(grid, fire, *MOUTH)
    if above_chimney:
        stamp(grid, above_chimney, *CHIMNEY_TOP)
    if cracks:
        stamp(grid, cracks, 0, BODY_TOP)
    return grid


def render(grid, colors):
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for y, row in enumerate(grid):
        assert len(row) == WIDTH, (y, len(row))
        for x, char in enumerate(row):
            if char != ".":
                h = colors[char].lstrip("#")
                image.putpixel((x, y), (*[int(h[i:i + 2], 16) for i in (0, 2, 4)], 255))
    return image.resize((WIDTH * ZOOM, HEIGHT * ZOOM), Image.NEAREST)


if __name__ == "__main__":
    ASSETS.mkdir(exist_ok=True)
    sheet = Image.new("RGBA", (WIDTH * ZOOM * len(HEATS), HEIGHT * ZOOM), "#16181D")
    for column, (name, (iron, fire, above_chimney, cracks)) in enumerate(HEATS.items()):
        image = render(furnace(fire, above_chimney, cracks), {**FIRE, **iron})
        image.save(ASSETS / f"{name}.png", optimize=True)
        sheet.alpha_composite(image, (column * WIDTH * ZOOM, 0))
    if len(sys.argv) > 1:
        sheet.save(sys.argv[1])
    print(f"{len(HEATS)} heats in {ASSETS}")
