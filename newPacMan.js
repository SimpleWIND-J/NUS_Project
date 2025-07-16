// ======================================
//        Pac-Man Skeleton (Arcade 2D)
//        Team-based Structure - Source §4 Compatible
// ======================================

import {
    set_dimensions, set_fps, enable_debug, debug_log,
    query_pointer_position, input_left_mouse_down,
    create_rectangle,
    pointer_over_gameobject,
    get_game_time, update_to_top,
    update_flip,
    update_position, create_text, update_text, gameobjects_overlap, update_scale,
    update_loop, build_game, create_sprite, set_scale, update_color, query_position,
    input_key_down, update_rotation, play_audio, stop_audio, loop_audio, create_audio
} from 'arcade_2d';




// === Global GameObjects and State ========================


const up_url = "https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/pacmanUp.png";
const red_url = "https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/red_pacman1.png";
const url_arr = [[up_url, "https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/pacmanClosed.png"], [red_url, "https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/red_closed.png"]];
let pacman = [[], []];
const monsters = [];
// the element in monsters[] is in the format [obj,x,y,dir]
let walls = [];
let dots = [];

//music
const menuMusic = create_audio("https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/main/audio/game%20menu.mp3", 0.5);
loop_audio(menuMusic);
const backgroundMusic = create_audio("https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/main/audio/game%20background.wav", 0.5);
loop_audio(backgroundMusic);
const startsound = create_audio("https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/main/audio/game%20start.mp3", 0.5);
const winsound = create_audio("https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/main/audio/gamewin.mp3", 0.5);
const losesound = create_audio("https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/main/audio/gameover.wav", 0.5);

//powerdots
let powerdots = [];
const power_duration = 5000;


let current_map_index = 0;
let new_map_index = 0;

// the element in dots[] is in the format pair(obj,isate)
const TILE_SIZE = 35;
let score = 0;
let totalScore = 0;

//gameMenu
let score_text = undefined;
let pause_text = undefined;
let pause_button = undefined;
let game_title = undefined;

//skin menu
let options = undefined;
let skins = [[], []];
let skin_index = 0;
let skin_index2 = 1;
let next = undefined;
let prev = undefined;

// Add s_text global variable
let s_text = undefined;

// Multi mode variables
let mode = 0;
let mode_multi = undefined;
let current_direction2 = "";
// let single_text = update_scale(create_text("Single Player Mode"),[2,2]);
// update_position(single_text,[3000,3000]);

//pauseMenu
let pause_title = undefined;
let resume_button = undefined;

let title = undefined;
let startup = true;
let start_button = undefined;

let canvas_width = 600;
let canvas_height = 650;

let power_mode = false;
let power_timer = 0;

//win
let win_text = undefined;
let lose_text = undefined;
let isWin = false;
let isLose = false;


//restart
let restart_text = undefined;
let restart_button = undefined;

let tile_map = [];
let isPaused = false;
let current_direction = "";
// Store the current movement direction for continuous movement

//used to control monsters
const goup = 0;
const godown = 1;
const goleft = 2;
const goright = 3;

//used to control the moving of obj in loop
let count = 0;
let prevTime = 0;
let prevTime2 = 0;



//control the speed
let monsterThreshold = 700;
let pacmanThershold = 250;

// game level
let gamelevel = 1;

let rebornTime = 3000;
let isReborn1 = false;
let rebornStart1 = 0;
let isReborn2 = false;
let rebornStart2 = 0;


let smartchance = 0.21; // 21% chance to use smart move



let lives1 = 3;
let lives2 = 3;
let isFail = false; // Flag to indicate if the game is over
//============================================================



let overlay_rect = undefined;


function setup_overlay() {


    overlay_rect = update_color(create_rectangle(canvas_width - 200, canvas_height - 100), [0, 0, 0, 180]);
    update_position(overlay_rect, [5000, 5000]);

}


function show_overlay() {

    update_position(overlay_rect, [canvas_width / 2, canvas_height / 2]);
    //update_to_top(overlay_rect);
}


function hide_overlay() {

    update_position(overlay_rect, [5000, 5000]);

}



let fail_text = undefined;

function setup_fail_screen() {
    fail_text = create_text("GAME OVER!");
    update_position(fail_text, [3000, 4000]);
    update_scale(fail_text, [4, 4]);
}

function show_fail_screen() {
    show_overlay();
    update_to_top(update_position(fail_text, [300, 200]));
    show_restart();
}

function hide_fail_screen() {
    hide_overlay();
    update_position(fail_text, [3000, 4000]);
    hide_restart_screen();
}




















//============helper function=================================

function push(array, element) {
    const newLength = array_length(array) + 1;
    array[array_length(array)] = element;
    return newLength;
}


function get_array_element(array, index) {
    return array[index];
}

function shuffle_array(arr) {
    const n = array_length(arr);

    //Fisher-Yates 
    for (let i = n - 1; i > 0; i = i - 1) {
        const j = math_floor(math_random() * (i + 1));
        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}


function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
}



/*
function add_vectors(to, from) {
    to[0] = to[0] + from[0];
    to[1] = to[1] + from[1];
}


function add_vectors_new(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
*/


function predic_wall(x, y) {
    const predCol = x;
    const predRow = y;
    if (tile_map[predRow - 3][predCol - 1] === 1) {
        return true;
    } else {
        return false;
    }
}


function get_valid_directions(x, y, exclude_dir) {
    const directions = [goup, godown, goleft, goright];
    const valid = [];

    for (let i = 0; i < 4; i = i + 1) {
        const dir = directions[i];
        const next_pos = update_new_position(dir, x, y);
        const nx = get_array_element(next_pos, 0);
        const ny = get_array_element(next_pos, 1);

        if (!predic_wall(nx, ny) && dir !== opposite_direction(exclude_dir)) {
            push(valid, dir);
        }
    }
    return valid;
}


function opposite_direction(dir) {
    if (dir === goup) { return godown; }
    if (dir === godown) { return goup; }
    if (dir === goleft) { return goright; }
    if (dir === goright) { return goleft; }
}

function is_occupied(x, y, self_index) {
    for (let i = 0; i < array_length(monsters); i = i + 1) {
        if (i !== self_index) {
            const other_x = get_array_element(monsters[i], 1);
            const other_y = get_array_element(monsters[i], 2);
            if (x === other_x && y === other_y) {
                return true;
            }
        }
    }
    return false;
}


//---- check collision ---------
function check_dot_collisions() {
    for (let i = 0; i < array_length(dots); i = i + 1) {
        const dot_pair = dots[i];
        const dot_obj = head(dot_pair);
        const eaten_flag = tail(dot_pair);

        if (!eaten_flag && gameobjects_overlap(pacman[0][0], dot_obj)) {
            dots[i] = pair(dot_obj, true);
            update_scale(dot_obj, [0, 0]);
            score = score + 1;
        }
        // Check collision for second player in multi-mode
        if (mode === 1 && !eaten_flag && gameobjects_overlap(pacman[1][0], dot_obj)) {
            dots[i] = pair(dot_obj, true);
            update_scale(dot_obj, [0, 0]);
            score = score + 1;
        }
    }
}

function check_powerdot_collisions() {
    for (let i = 0; i < array_length(powerdots); i = i + 1) {
        const dot_pair = powerdots[i];
        const dot_obj = head(dot_pair);
        const eaten_flag = tail(dot_pair);

        if (!eaten_flag && gameobjects_overlap(pacman[0][0], dot_obj)) {
            debug_log("Pacman hit powerdot!");

            powerdots[i] = pair(dot_obj, true);
            update_scale(dot_obj, [0, 0]);
            power_mode = true;
            power_timer = get_game_time();
        }

        if (mode === 1 && !eaten_flag && gameobjects_overlap(pacman[1][0], dot_obj)) {
            powerdots[i] = pair(dot_obj, true);
            update_scale(dot_obj, [0, 0]);
            power_mode = true;
            power_timer = get_game_time();
        }
    }
}


function check_monster_collision() {
    for (let i = 0; i < array_length(monsters); i = i + 1) {
        const m = monsters[i][0];
        // player1
        if (gameobjects_overlap(m, pacman[0][0])) {
            if (power_mode) {
                update_scale(m, [0, 0]);
                debug_log("Monster defeated by power mode!");
                monsters[i][5] = get_game_time();
            }

            else if (!isReborn1) {
                lives1 = lives1 - 1;
                if (lives1 > 0) {
                    isLose = true;
                    isReborn1 = true;
                }

                else {
                    isFail = true;
                    stop_audio(backgroundMusic);
                    play_audio(losesound);
                }
            }
        }



        // player2
        if (gameobjects_overlap(m, pacman[1][0])) {

            if (power_mode) {
                update_position(m, [4000, 3000]);
                monsters[i][5] = get_game_time();
            }
            else if (!isReborn2) {
                lives2 = lives2 - 1;
                if (lives2 > 0) {
                    isLose = true;
                    isReborn2 = true;
                } else {
                    isFail = true;
                }
            }
        }
    }
}

//============================================================






//========= SETUP FUNCTIONS  =================================

//--------- UI FUNCTIONS     ------------------
function setup_canvas() {
    set_dimensions([canvas_width, canvas_height]); //TODO
    set_fps(150);
}

function setup_startup_screen() {
    title = create_text("PACMAN");
    update_position(title, [300, 150]);
    update_scale(title, [4, 4]);

    start_button = create_text("Start Game");
    update_position(start_button, [300, 350]);
    update_scale(start_button, [2, 2]);

    options = create_text("Player Skins");
    update_position(options, [300, 400]);
    update_scale(options, [2, 2]);

    mode_multi = create_text("Multiplayer");
    update_scale(mode_multi, [2, 2]);
    update_position(mode_multi, [300, 450]);

    play_audio(menuMusic);
}

function setup_pause_menu() {
    pause_title = create_text("Game Paused");
    update_position(pause_title, [1000, 3000]);
    update_scale(pause_title, [3, 3]);

    resume_button = create_text("Resume");
    update_position(resume_button, [2000, 1000]);
    update_scale(resume_button, [2, 2]);
}

let lives_text = undefined;
let level_text = undefined;

function setup_gameMenu() {
    score_text = create_text("Your Score is: 0");
    update_position(score_text, [1000, 1000]);
    update_scale(score_text, [1.1, 1.1]);

    pause_text = create_text("Pause");
    update_position(pause_text, [1000, 1000]);
    update_scale(pause_text, [1, 1]);

    pause_button = create_text("[ P ]");
    update_position(pause_button, [1000, 1000]);
    update_scale(pause_button, [1, 1]);

    game_title = create_text("PACMAN");
    update_position(game_title, [1000, 1000]);
    update_scale(game_title, [1.5, 1.5]);

    // 新增生命值和关卡文本对象
    lives_text = create_text("Lives: 3");
    update_position(lives_text, [2300, 80]);
    update_scale(lives_text, [1.1, 1.1]);

    level_text = create_text("Level: 1");
    update_position(level_text, [80, 1100]);
    update_scale(level_text, [1.1, 1.1]);

    restart_button = create_text("Restart");
    update_position(restart_button, [5400, 40]);
    update_scale(restart_button, [1, 1]);
}

function setup_win_screen() {
    win_text = create_text("YOU WIN!");
    update_position(win_text, [3000, 4000]);
    update_scale(win_text, [4, 4]);
    startup = true;
}

function setup_restart() {
    restart_text = create_text("TRY AGAIN!");
    update_position(restart_text, [3000, 4000]);
    update_scale(lose_text, [4, 4]);
}

function setup_lose_screen() {
    lose_text = create_text("YOU LOSE!");
    update_position(lose_text, [3000, 4000]);
    update_scale(lose_text, [4, 4]);
}


// 1 -> wall , 0 ->coin ,

// 1 -> wall , 0 ->coin ,


// the four tiles in the middle of the map is '0' , used to setup mons
const tile_maps = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 2, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 2, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 2, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]];


const walls_by_map = [];
const dots_by_map = [];
const powerdots_by_map = [];


const offset_x = 1;
const offset_y = 3;
// offset_x and offset_y are used to adjust the position of the tiles to fit the canvas

function setup_all_maps() {

    const wall_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/pinkwall.png';
    const yellowdot_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/yellowball.png';
    const whitedot_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/whiteball.png';

    for (let map_index = 0; map_index < array_length(tile_maps);
        map_index = map_index + 1) {
        const map = tile_maps[map_index];
        const walls = [];
        const dots = [];
        const powerdots = [];
        for (let row = 0; row < array_length(map); row = row + 1) {
            for (let col = 0; col < array_length(map[row]); col = col + 1) {

                const tile = map[row][col];
                const pos = [(col + offset_x) * TILE_SIZE, (row + offset_y) * TILE_SIZE];

                if (tile === 1) {
                    const wall = create_sprite(wall_image_link);
                    update_position(wall, pos);
                    update_scale(wall, [0, 0]);
                    push(walls, wall);
                } else if (tile === 2) {
                    const pd = create_sprite(whitedot_image_link);
                    update_position(pd, pos);
                    update_scale(pd, [0, 0]);
                    push(powerdots, pair(pd, false));
                }
                else {
                    const dot = create_sprite(yellowdot_image_link);
                    update_position(dot, pos);
                    update_scale(dot, [0, 0]);
                    push(dots, pair(dot, false));
                }
            }
        }
        push(walls_by_map, walls);
        push(dots_by_map, dots);
        push(powerdots_by_map, powerdots);
    }
}
//-----------------------------------------------


//--------- GAME OBJ ----------------------------

function setup_player() {
    // Create all pacman skin sprites (open and closed), hide all except the default
    for (let i = 0; i < array_length(url_arr); i = i + 1) {
        for (let j = 0; j < array_length(url_arr[i]); j = j + 1) {
            skins[i][j] = create_sprite(url_arr[i][j]);
            if (i === 1) {
                update_scale(skins[i][j], [3.4 / 50, 3.4 / 50]);
            } else {
                update_scale(skins[i][j], [33 / 46, 33 / 45]);
            }
            update_position(skins[i][j], [5000, 5000]); // Hide initially
        }
    }
    // Assign open and closed sprites for player 1 and 2
    pacman[0][0] = skins[0][0]; // open
    pacman[0][1] = skins[0][1]; // closed
    pacman[1][0] = skins[1][0]; // open
    pacman[1][1] = skins[1][1]; // closed
    // Hide both closed sprites initially
    update_position(pacman[0][1], [5000, 5000]);
    update_position(pacman[1][1], [5000, 5000]);
}


function setup_monsters() {
    const imageLinks = [
        'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/monster.png',
        'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/red_monster_resized.png',
        'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/blue_monster_resized.png',
        'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/yellow_monster_resized.png'
    ];

    function build_monsters(x, y, monsterIndex) {
        const imageLink = imageLinks[monsterIndex];
        const sprite = create_sprite(imageLink);
        update_scale(sprite, [1, 1]);
        update_position(sprite, [1000, 2000]);
        const direction = math_floor(math_random() * 4);

        let isLeft = false;

        //set the intial orientation of the image
        if (direction === 2) {
            update_flip(sprite, [true, false]);
            isLeft = true;
        }

        //push(monsters, [sprite, x, y, direction]);
        return [sprite, x, y, direction, isLeft];
    }


    // the four monsters are created in the middle of the map
    // the four monsters are created near the middle of the map
    for (let monsterIndex = 0; monsterIndex < array_length(imageLinks); monsterIndex = monsterIndex + 1) {
        if (monsterIndex === 0) {
            push(monsters, build_monsters(7 + offset_x, 7 + offset_y, monsterIndex));
        } else if (monsterIndex === 1) {
            push(monsters, build_monsters(7 + offset_x, 8 + offset_y, monsterIndex));
        } else if (monsterIndex === 2) {
            push(monsters, build_monsters(8 + offset_x, 7 + offset_y, monsterIndex));
        } else if (monsterIndex === 3) {
            push(monsters, build_monsters(8 + offset_x, 8 + offset_y, monsterIndex));
        }
        // only four right now
        else {
            push(monsters, build_monsters(10, 10, monsterIndex));
        }
    }//setup all the monsters

    monster_tweens = [];
    for (let i = 0; i < array_length(monsters); i = i + 1) {
        // [active, start, end, progress, direction]
        push(monster_tweens, [false, [0, 0], [0, 0], 0, 0]);
    }


}



//==========   RESET FUNCTIONS   ===============

function reset_monsters() {

    for (let monsterIndex = 0; monsterIndex < array_length(monsters); monsterIndex = monsterIndex + 1) {
        const monster_info = monsters[monsterIndex];

        update_scale(get_array_element(monster_info, 0), [1, 1]);
        // reset the monster position and direction

        const sprite = get_array_element(monster_info, 0);
        const isLeft = get_array_element(monster_info, 4);
        // renew the image

        const newdirection = math_floor(math_random() * 4);

        let newisLeft = false;

        //set the intial orientation of the image
        if (newdirection === 2 && !isLeft) {
            update_flip(sprite, [true, false]);
            newisLeft = true;
        }

        else if (newdirection === 3 && isLeft) {
            update_flip(sprite, [true, false]);
            newisLeft = false;
        }

        // Reset position and direction
        update_position(sprite, [1000, 2000]);

        if (monsterIndex === 0) {
            monsters[monsterIndex] = [sprite, 7 + offset_x, 7 + offset_y, newdirection, newisLeft];
        } else if (monsterIndex === 1) {
            monsters[monsterIndex] = [sprite, 7 + offset_x, 8 + offset_y, newdirection, newisLeft];
        } else if (monsterIndex === 2) {
            monsters[monsterIndex] = [sprite, 8 + offset_x, 7 + offset_y, newdirection, newisLeft];
        } else if (monsterIndex === 3) {
            monsters[monsterIndex] = [sprite, 8 + offset_x, 8 + offset_y, newdirection, newisLeft];
        }
    }
}


function reset_game_parameters() {

    score = 0;

    gamelevel = 1;
    monsterThreshold = 700;
    smartchance = 0.21;
    isWin = false;
    isLose = false;
    isReborn1 = false;
    isReborn2 = false;
    rebornStart1 = 0;
    rebornStart2 = 0;
    // reset lives
    lives1 = 3;
    lives2 = 3;

}



//? call the function after changing the map
function reset_pacman() {
    let start_x = 1;
    let start_y = 1;
    for (let row = 0; row < array_length(tile_map); row = row + 1) {
        for (let col = 0; col < array_length(tile_map[row]); col = col + 1) {
            if (tile_map[row][col] === 0) {
                start_x = col;
                start_y = row;
                break;
            }
        }
        if (tile_map[start_y][start_x] === 0) {
            break;
        }
    }
    const start_pos = [(start_x + offset_x) * TILE_SIZE, (start_y + offset_y) * TILE_SIZE];
    update_position(pacman[0][0], start_pos);
    //! reset the tween state
    pacman_tweens[0] = [false, start_pos, start_pos, 0, ""];

    //* multi mode
    if (mode === 1) {
        let start_x2 = 1;
        let start_y2 = 1;
        for (let row = 0; row < array_length(tile_map); row = row + 1) {
            for (let col = 0; col < array_length(tile_map[row]); col = col + 1) {
                if (tile_map[row][col] === 0 && (col !== start_x || row !== start_y)) {
                    start_x2 = col;
                    start_y2 = row;
                    break;
                }
            }
            if (tile_map[start_y2][start_x2] === 0 && (start_x2 !== start_x || start_y2 !== start_y)) {
                break;
            }
        }
        const start_pos2 = [(start_x2 + offset_x) * TILE_SIZE, (start_y2 + offset_y) * TILE_SIZE];
        update_position(pacman[1][0], start_pos2);
        //!reset the tween state 
        pacman_tweens[1] = [false, start_pos2, start_pos2, 0, ""];
    }
}



//==============================================



function setup_skin_menu() {
    options = create_text("Player Skins");


    skins[0][0] = create_sprite(up_url);
    update_position(skins[0][0], [2500, 2500]);
    update_scale(skins[0][0], [2, 2]);


    skins[1][0] = create_sprite(red_url);
    update_position(skins[1][0], [3500, 2500]);
    update_scale(skins[1][0], [3.4 / 50, 3.4 / 50]);


    prev = create_text("<");
    next = create_text(">");
    update_position(prev, [2000, 2500]);
    update_position(prev, [2500, 2500]);
    update_position(options, [2000, 2000]);

    // Create s_text for starting game from skin menu
    s_text = create_text("Start Game");
    update_position(s_text, [300, 350]);
    update_scale(s_text, [2, 2]);
}


//----------------------------------------------------


//=========================================================







//============== SHOW AND HIDE FUNCTIONS ==================
function show_win_screen() {
    show_overlay();
    update_to_top(update_position(win_text, [300, 200]));
    update_to_top(update_position(next_level_text, [300, 400]));
    for (let i = 0; i < array_length(pacman); i = i + 1) {
        update_position(pacman[i][0], [3500, 3500]);
    }
}

function hide_win_screen() {
    hide_overlay();
    update_position(win_text, [2000, 3000]);
    update_position(next_level_text, [3000, 4200]);
}



function show_lose_screen() {
    show_overlay();
    update_to_top(update_position(lose_text, [300, 200]));
    //update_position(single_text,[3100,3100]);
    show_restart();
}

function hide_lose_screen() {
    update_position(lose_text, [2000, 3000]);
    hide_restart_screen();
    hide_overlay();
}



//===============================================================






//================== UPDATE FUNCTIONS ===========================

// === Tween Animation State ===
let pacman_tweens = [
    [false, [0, 0], [0, 0], 0, ""], // [active, start, end, progress, direction] for player 1
    [false, [0, 0], [0, 0], 0, ""]  // for player 2
];
let monster_tweens = [];
// === Chomping Animation State ===
let chomping_timer = [0, 0]; // [last toggle time for p0, p1]
let chomping_state = [0, 0]; // 0=open, 1=closed for each pacman
let pacman_rotation = [0, 0]; // Store last applied rotation for each pacman


function update_tweens() {
    // Chomping animation for both Pac-Men
    const now = get_game_time();
    for (let p = 0; p < 2; p = p + 1) {
        // Sync closed sprite's position, scale, and rotation with open
        const pos = query_position(pacman[p][0]);
        update_position(pacman[p][1], pos);
        // Copy scale
        let scale = [1, 1];
        if (p === 0) {
            scale = (skin_index === 1) ? [3.4 / 50, 3.4 / 50] : [35 / 46, 35 / 45];
        } else {
            scale = (skin_index2 === 1) ? [3.4 / 50, 3.4 / 50] : [35 / 46, 35 / 45];
        }
        update_scale(pacman[p][1], scale);
        // Copy rotation from pacman_rotation
        update_rotation(pacman[p][1], pacman_rotation[p]);
        // Chomping toggle every 180ms
        if (now - chomping_timer[p] > 180) {
            chomping_state[p] = 1 - chomping_state[p];
            chomping_timer[p] = now;
        }
        // Set color for visibility
        let open_color = [255, 255, 0, 255];
        let closed_color = [255, 255, 0, 255];
        if (p === 1) { open_color = [255, 0, 0, 255]; closed_color = [255, 0, 0, 255]; }
        if (chomping_state[p] === 0) {
            update_color(pacman[p][0], open_color); // show open
            update_color(pacman[p][1], [closed_color[0], closed_color[1], closed_color[2], 0]); // hide closed
        } else {
            update_color(pacman[p][0], [open_color[0], open_color[1], open_color[2], 0]); // hide open
            update_color(pacman[p][1], closed_color); // show closed
        }
    }
    for (let p = 0; p < 2; p = p + 1) {
        if (pacman_tweens[p][0]) {
            // Check if the end position is a wall BEFORE interpolating
            const end = pacman_tweens[p][2];
            let col = math_round(end[0] / TILE_SIZE);
            let row = math_round(end[1] / TILE_SIZE);
            let is_wall = false;
            if (
                row - 3 < 0 || row - 3 >= array_length(tile_map) ||
                col - 1 < 0 || col - 1 >= array_length(tile_map[0]) ||
                tile_map[row - 3][col - 1] === 1
            ) {
                is_wall = true;
            }
            if (is_wall) {
                // Snap to nearest valid tile center
                const start = pacman_tweens[p][1];
                let scol = math_round(start[0] / TILE_SIZE);
                let srow = math_round(start[1] / TILE_SIZE);
                update_position(pacman[p][0], [scol * TILE_SIZE, srow * TILE_SIZE]);
                // Re-apply correct scale
                if (p === 0) {
                    if (skin_index === 1) {
                        update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[0][0], [35 / 46, 35 / 45]);
                    }
                } else {
                    if (skin_index2 === 1) {
                        update_scale(pacman[1][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[1][0], [35 / 46, 35 / 45]);
                    }
                }
                pacman_tweens[p][0] = false;
                continue;
            }
            pacman_tweens[p][3] = pacman_tweens[p][3] + 0.04;
            if (pacman_tweens[p][3] >= 1) {
                // Snap to center of target tile
                let ecol = math_round(pacman_tweens[p][2][0] / TILE_SIZE);
                let erow = math_round(pacman_tweens[p][2][1] / TILE_SIZE);
                update_position(pacman[p][0], [ecol * TILE_SIZE, erow * TILE_SIZE]);
                if (p === 0) {
                    if (skin_index === 1) {
                        update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[0][0], [35 / 46, 35 / 45]);
                    }
                } else {
                    if (skin_index2 === 1) {
                        update_scale(pacman[1][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[1][0], [35 / 46, 35 / 45]);
                    }
                }
                pacman_tweens[p][0] = false;
                // After tween completes, try to start a new tween in the same direction if possible
                const dir = pacman_tweens[p][4];
                const pos = [ecol * TILE_SIZE, erow * TILE_SIZE];
                const movement_dist = TILE_SIZE;
                let v = [0, 0];
                if (dir === "w") { v = [0, -movement_dist]; }
                if (dir === "a") { v = [-movement_dist, 0]; }
                if (dir === "s") { v = [0, movement_dist]; }
                if (dir === "d") { v = [movement_dist, 0]; }
                const next_pos = [pos[0] + v[0], pos[1] + v[1]];
                // Check collision for next tile
                let can_move = false;
                let ncol = math_round(next_pos[0] / TILE_SIZE);
                let nrow = math_round(next_pos[1] / TILE_SIZE);
                if (
                    nrow - 3 >= 0 && nrow - 3 < array_length(tile_map) &&
                    ncol - 1 >= 0 && ncol - 1 < array_length(tile_map[0]) &&
                    tile_map[nrow - 3][ncol - 1] !== 1
                ) {
                    can_move = true;
                }
                if (can_move) {
                    pacman_tweens[p][0] = true;
                    pacman_tweens[p][1] = pos;
                    pacman_tweens[p][2] = next_pos;
                    pacman_tweens[p][3] = 0;
                    // Keep direction
                }
            } else {
                // Interpolate strictly between tile centers
                const t = pacman_tweens[p][3];
                const start = pacman_tweens[p][1];
                const end = pacman_tweens[p][2];
                let scol = math_round(start[0] / TILE_SIZE);
                let srow = math_round(start[1] / TILE_SIZE);
                let ecol = math_round(end[0] / TILE_SIZE);
                let erow = math_round(end[1] / TILE_SIZE);
                const spos = [scol * TILE_SIZE, srow * TILE_SIZE];
                const epos = [ecol * TILE_SIZE, erow * TILE_SIZE];
                const pos = [spos[0] + (epos[0] - spos[0]) * t, spos[1] + (epos[1] - spos[1]) * t];
                update_position(pacman[p][0], pos);
                if (p === 0) {
                    if (skin_index === 1) {
                        update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[0][0], [35 / 46, 35 / 45]);
                    }
                } else {
                    if (skin_index2 === 1) {
                        update_scale(pacman[1][0], [3.4 / 50, 3.4 / 50]);
                    } else {
                        update_scale(pacman[1][0], [35 / 46, 35 / 45]);
                    }
                }
            }
        }
    }
    // Monster tweens (new)
    for (let i = 0; i < array_length(monster_tweens); i = i + 1) {
        if (monster_tweens[i][0]) {
            monster_tweens[i][3] = monster_tweens[i][3] + 0.0125; // smoother and slower than Pac-Man
            if (monster_tweens[i][3] >= 1) {
                update_position(monsters[i][0], monster_tweens[i][2]);
                monster_tweens[i][0] = false;
            } else {
                const t = monster_tweens[i][3];
                const start = monster_tweens[i][1];
                const end = monster_tweens[i][2];
                const pos = [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
                update_position(monsters[i][0], pos);
            }
        }
    }
}

function update_player_movement() {
    const movement_dist = TILE_SIZE;
    // Player 1
    // Update desired_direction on every frame for higher responsiveness
    let desired_direction = "";
    let desired_direction2 = "";
    if (input_key_down("w")) { desired_direction = "w"; }
    if (input_key_down("a")) { desired_direction = "a"; }
    if (input_key_down("s")) { desired_direction = "s"; }
    if (input_key_down("d")) { desired_direction = "d"; }
    // Only update desired_direction on key press (not while held)
    let direction_changed = desired_direction !== current_direction;
    let key_w = false;
    let key_a = false;
    let key_s = false;
    let key_d = false;
    if (input_key_down("w")) {
        if (!key_w) { desired_direction = "w"; direction_changed = true; }
        key_w = true;
    } else { key_w = false; }
    if (input_key_down("a")) {
        if (!key_a) { desired_direction = "a"; direction_changed = true; }
        key_a = true;
    } else { key_a = false; }
    if (input_key_down("s")) {
        if (!key_s) { desired_direction = "s"; direction_changed = true; }
        key_s = true;
    } else { key_s = false; }
    if (input_key_down("d")) {
        if (!key_d) { desired_direction = "d"; direction_changed = true; }
        key_d = true;
    } else { key_d = false; }
    // If a direction key was pressed and Pac-Man is tweening, try to change direction immediately if possible
    if (pacman_tweens[0][0] && direction_changed) {
        const pos = query_position(pacman[0][0]);
        let v = [0, 0];
        if (desired_direction === "w") { v = [0, -movement_dist]; update_rotation(pacman[0][0], 0); }
        if (desired_direction === "a") { v = [-movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 1.5); }
        if (desired_direction === "s") { v = [0, movement_dist]; update_rotation(pacman[0][0], math_PI); }
        if (desired_direction === "d") { v = [movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 0.5); }
        const next_pos = [pos[0] + v[0], pos[1] + v[1]];
        let can_move = false;
        if (desired_direction !== "") {
            let col = math_floor(next_pos[0] / TILE_SIZE) - 1;
            let row = math_floor(next_pos[1] / TILE_SIZE) - 3;
            if (
                row >= 0 && row < array_length(tile_map) &&
                col >= 0 && col < array_length(tile_map[0]) &&
                tile_map[row][col] !== 1
            ) {
                can_move = true;
            }
        }
        if (can_move) {
            // Interrupt current tween and start new tween in the new direction
            pacman_tweens[0][1] = pos;
            pacman_tweens[0][2] = next_pos;
            pacman_tweens[0][3] = 0;
            pacman_tweens[0][4] = desired_direction;
            current_direction = desired_direction;
        }
    }
    if (!pacman_tweens[0][0]) {
        const current_position = query_position(pacman[0][0]);
        // Try desired_direction first
        let v = [0, 0];
        let try_dir = desired_direction !== "" ? desired_direction : current_direction;
        if (try_dir === "w") { v = [0, -movement_dist]; update_rotation(pacman[0][0], 0); }
        if (try_dir === "a") { v = [-movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 1.5); }
        if (try_dir === "s") { v = [0, movement_dist]; update_rotation(pacman[0][0], math_PI); }
        if (try_dir === "d") { v = [movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 0.5); }
        const next_pos = [current_position[0] + v[0], current_position[1] + v[1]];
        let can_move = false;
        if (try_dir !== "") {
            let col = math_floor(next_pos[0] / TILE_SIZE) - offset_x;
            let row = math_floor(next_pos[1] / TILE_SIZE) - offset_y;
            if (
                row >= 0 && row < array_length(tile_map) &&
                col >= 0 && col < array_length(tile_map[0]) &&
                tile_map[row][col] !== 1    //! not a wall
            ) {
                can_move = true;
            }
        }
        if (can_move) {
            pacman_tweens[0][0] = true;
            pacman_tweens[0][1] = current_position;
            pacman_tweens[0][2] = next_pos;
            pacman_tweens[0][3] = 0;
            pacman_tweens[0][4] = try_dir;
            current_direction = try_dir;
        } else if (current_direction !== "") {
            // Try to continue in current direction if desired is not possible
            v = [0, 0];
            if (current_direction === "w") { v = [0, -movement_dist]; update_rotation(pacman[0][0], 0); }
            if (current_direction === "a") { v = [-movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 1.5); }
            if (current_direction === "s") { v = [0, movement_dist]; update_rotation(pacman[0][0], math_PI); }
            if (current_direction === "d") { v = [movement_dist, 0]; update_rotation(pacman[0][0], math_PI * 0.5); }
            const next_pos2 = [current_position[0] + v[0], current_position[1] + v[1]];
            let can_move2 = false;
            let col2 = math_floor(next_pos2[0] / TILE_SIZE) - 1;
            let row2 = math_floor(next_pos2[1] / TILE_SIZE) - 3;
            if (
                row2 >= 0 && row2 < array_length(tile_map) &&
                col2 >= 0 && col2 < array_length(tile_map[0]) &&
                tile_map[row2][col2] !== 1
            ) {
                can_move2 = true;
            }
            if (can_move2) {
                pacman_tweens[0][0] = true;
                pacman_tweens[0][1] = current_position;
                pacman_tweens[0][2] = next_pos2;
                pacman_tweens[0][3] = 0;
                pacman_tweens[0][4] = current_direction;
            }
        }
    }
    // Player 2 (multiplayer)
    let direction_changed2 = false;
    if (input_key_down("i")) { desired_direction2 = "w"; direction_changed2 = true; }
    if (input_key_down("j")) { desired_direction2 = "a"; direction_changed2 = true; }
    if (input_key_down("k")) { desired_direction2 = "s"; direction_changed2 = true; }
    if (input_key_down("l")) { desired_direction2 = "d"; direction_changed2 = true; }
    if (mode === 1 && pacman_tweens[1][0] && direction_changed2) {
        const pos2 = query_position(pacman[1][0]);
        let v2 = [0, 0];
        if (desired_direction2 === "w") { v2 = [0, -movement_dist]; update_rotation(pacman[1][0], 0); }
        if (desired_direction2 === "a") { v2 = [-movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 1.5); }
        if (desired_direction2 === "s") { v2 = [0, movement_dist]; update_rotation(pacman[1][0], math_PI); }
        if (desired_direction2 === "d") { v2 = [movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 0.5); }
        const next_pos2 = [pos2[0] + v2[0], pos2[1] + v2[1]];
        let can_move2 = false;
        if (desired_direction2 !== "") {
            let col2 = math_floor(next_pos2[0] / TILE_SIZE) - 1;
            let row2 = math_floor(next_pos2[1] / TILE_SIZE) - 3;
            if (
                row2 >= 0 && row2 < array_length(tile_map) &&
                col2 >= 0 && col2 < array_length(tile_map[0]) &&
                tile_map[row2][col2] !== 1
            ) {
                can_move2 = true;
            }
        }
        if (can_move2) {
            pacman_tweens[1][1] = pos2;
            pacman_tweens[1][2] = next_pos2;
            pacman_tweens[1][3] = 0;
            pacman_tweens[1][4] = desired_direction2;
            current_direction2 = desired_direction2;
        }
    }
    if (mode === 1 && !pacman_tweens[1][0]) {
        const current_position2 = query_position(pacman[1][0]);
        let v2 = [0, 0];
        let try_dir2 = desired_direction2 !== "" ? desired_direction2 : current_direction2;
        if (try_dir2 === "w") { v2 = [0, -movement_dist]; update_rotation(pacman[1][0], 0); }
        if (try_dir2 === "a") { v2 = [-movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 1.5); }
        if (try_dir2 === "s") { v2 = [0, movement_dist]; update_rotation(pacman[1][0], math_PI); }
        if (try_dir2 === "d") { v2 = [movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 0.5); }
        const next_pos2 = [current_position2[0] + v2[0], current_position2[1] + v2[1]];
        let can_move2 = false;
        if (try_dir2 !== "") {
            let col2 = math_floor(next_pos2[0] / TILE_SIZE) - 1;
            let row2 = math_floor(next_pos2[1] / TILE_SIZE) - 3;
            if (
                row2 >= 0 && row2 < array_length(tile_map) &&
                col2 >= 0 && col2 < array_length(tile_map[0]) &&
                tile_map[row2][col2] !== 1
            ) {
                can_move2 = true;
            }
        }
        if (can_move2) {
            pacman_tweens[1][0] = true;
            pacman_tweens[1][1] = current_position2;
            pacman_tweens[1][2] = next_pos2;
            pacman_tweens[1][3] = 0;
            pacman_tweens[1][4] = try_dir2;
            current_direction2 = try_dir2;
        } else if (current_direction2 !== "") {
            v2 = [0, 0];
            if (current_direction2 === "w") { v2 = [0, -movement_dist]; update_rotation(pacman[1][0], 0); }
            if (current_direction2 === "a") { v2 = [-movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 1.5); }
            if (current_direction2 === "s") { v2 = [0, movement_dist]; update_rotation(pacman[1][0], math_PI); }
            if (current_direction2 === "d") { v2 = [movement_dist, 0]; update_rotation(pacman[1][0], math_PI * 0.5); }
            const next_pos22 = [current_position2[0] + v2[0], current_position2[1] + v2[1]];
            let can_move22 = false;
            let col22 = math_floor(next_pos22[0] / TILE_SIZE) - 1;
            let row22 = math_floor(next_pos22[1] / TILE_SIZE) - 3;
            if (
                row22 >= 0 && row22 < array_length(tile_map) &&
                col22 >= 0 && col22 < array_length(tile_map[0]) &&
                tile_map[row22][col22] !== 1
            ) {
                can_move22 = true;
            }
            if (can_move22) {
                pacman_tweens[1][0] = true;
                pacman_tweens[1][1] = current_position2;
                pacman_tweens[1][2] = next_pos22;
                pacman_tweens[1][3] = 0;
                pacman_tweens[1][4] = current_direction2;
            }
        }
    }
}

function update_new_position(dir, x, y) {
    if (dir === goup) {
        return [x, y - 1];
    } else if (dir === godown) {
        return [x, y + 1];
    } else if (dir === goleft) {
        return [x - 1, y];
    } else {
        // goright
        return [x + 1, y];
    }
}




function update_monsters() {
    const MONSTER_REBORN_TIME = 5000;


    for (let i = 0; i < array_length(monsters); i = i + 1) {
        const monster_info = monsters[i];
        const rebornStart = monster_info[5];

        if (rebornStart !== undefined && get_game_time() - rebornStart > MONSTER_REBORN_TIME) {

            const sprite = monster_info[0];
            update_scale(
                update_position(sprite, [8 * TILE_SIZE, 8 * TILE_SIZE]),
                [1, 1]);
            monster_info[1] = 8 + offset_x;
            monster_info[2] = 8 + offset_y;
            monster_info[3] = math_floor(math_random() * 4);
            monster_info[5] = undefined;
        }
    }

    for (let i = 0; i < array_length(monsters); i = i + 1) {


        const monster_info = monsters[i];

        if (monster_info[5] !== undefined) {
            continue;
        }//* Skip monsters that are currently reborn


        let x = get_array_element(monster_info, 1);
        let y = get_array_element(monster_info, 2);
        let dir = get_array_element(monster_info, 3);
        let isLeft = get_array_element(monster_info, 4);

        //valid means that
        //no hitting the wall and not equal to the current direction

        const valid_dirs = get_valid_directions(x, y, dir);
        const valid_num = array_length(valid_dirs);

        let newdir = dir;

        shuffle_array(valid_dirs);
        //shuffle the array to make route less similar


        // more than one valid direction , can apply smart mode
        if (valid_num >= 2) {
            const use_smart_move = math_random() < 0.21;
            // 21% use judge-distance
            if (use_smart_move) {
                let best_dir = dir;
                let min_dist = 999999;

                for (let j = 0; j < valid_num; j = j + 1) {
                    const try_dir = get_array_element(valid_dirs, j);
                    const try_pos = update_new_position(try_dir, x, y);
                    const try_x = get_array_element(try_pos, 0);
                    const try_y = get_array_element(try_pos, 1);

                    // the collision of monster havr higher priority than the
                    // "smart" mode
                    if (!is_occupied(try_x, try_y, i)) {
                        const pacman0_position = query_position(pacman[0][0]);
                        const pacman0_x = pacman0_position[0] / TILE_SIZE;
                        const pacman0_y = pacman0_position[1] / TILE_SIZE;
                        const d0 = distance(try_x, try_y, pacman0_x, pacman0_y);
                        if (d0 < min_dist) {
                            min_dist = d0;
                            best_dir = try_dir;
                        }

                        if (mode === 1) {
                            // if mode is 1 , we have two pacman
                            const pacman1_position = query_position(pacman[1][0]);
                            const pacman1_x = pacman1_position[0] / TILE_SIZE;
                            const pacman1_y = pacman1_position[1] / TILE_SIZE;
                            const d1 = distance(try_x, try_y, pacman1_x, pacman1_y);
                            if (d1 < min_dist) {
                                min_dist = d1;
                                best_dir = try_dir;
                            }

                        }
                    }
                }

                if (min_dist !== 999999) {
                    newdir = best_dir;
                } else {
                    // we will only go into this case when this monster is
                    // surrounded by other monster , so just give a random
                    newdir = valid_dirs[0];
                    //because of shuffle function , it is already a random dir

                    //and we might not return oppsite_direction()


                }
            } else {
                // 79% random
                let found = false;
                for (let j = 0; j < valid_num; j = j + 1) {
                    const try_dir = get_array_element(valid_dirs, j);
                    const try_pos = update_new_position(try_dir, x, y);
                    const try_x = get_array_element(try_pos, 0);
                    const try_y = get_array_element(try_pos, 1);

                    // reduce the chance to have the same route
                    if (!is_occupied(try_x, try_y, i)) {
                        newdir = try_dir;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newdir = valid_dirs[0];
                }
            }
        }



        else if (valid_num === 0) {
            newdir = opposite_direction(dir);
            // highest priority , avoid  hitting the wall
            // no more thing to do

        }


        // 2 cases in one valid-dir situation
        //    # # #          # # #
        //      O #            O
        //    #   #          # # #

        else {
            const try_pos = update_new_position(valid_dirs[0], x, y);
            const try_x = get_array_element(try_pos, 0);
            const try_y = get_array_element(try_pos, 1);
            if (!is_occupied(try_x, try_y, i)) {
                newdir = valid_dirs[0];
            } else {
                newdir = opposite_direction(dir);
            }
        }


        const newpos = update_new_position(newdir, x, y);
        const newx = get_array_element(newpos, 0);
        const newy = get_array_element(newpos, 1);

        // Instead of updating position directly, set up a tween
        monster_tweens[i][0] = true;
        monster_tweens[i][1] = [x * TILE_SIZE, y * TILE_SIZE];
        monster_tweens[i][2] = [newx * TILE_SIZE, newy * TILE_SIZE];
        monster_tweens[i][3] = 0;
        monster_tweens[i][4] = newdir;
        // Update logical state for next move
        monsters[i][1] = newx;
        monsters[i][2] = newy;
        monsters[i][3] = newdir;
        // Flip logic (keep as before)
        if (newdir === 2 || newdir === 3) {
            const shouldFlip = (newdir === 2);
            if (isLeft !== shouldFlip) {
                update_flip(monsters[i][0], [shouldFlip, false]);
                monsters[i][4] = shouldFlip;
            }
        }
    }
}



function update_map(new_index) {


    // hide old map

    for (let i = 0; i < array_length(walls_by_map[current_map_index]); i = i + 1) {
        update_scale(walls_by_map[current_map_index][i], [0, 0]);
    }
    for (let i = 0; i < array_length(dots_by_map[current_map_index]); i = i + 1) {
        update_scale(head(dots_by_map[current_map_index][i]), [0, 0]);
        set_tail(dots_by_map[current_map_index][i], false);
    }

    for (let i = 0; i < array_length(powerdots_by_map[current_map_index]); i = i + 1) {
        update_scale(head(powerdots_by_map[current_map_index][i]), [0, 0]);
        set_tail(powerdots_by_map[current_map_index][i], false);
    }
    //reset the condition




    //NEW MAP
    tile_map = tile_maps[new_index];
    // tile_map is a global variable , other functions can share it 

    current_map_index = new_index;
    walls = walls_by_map[new_index];
    dots = dots_by_map[new_index];
    powerdots = powerdots_by_map[new_index];
    totalScore = array_length(dots);

    for (let i = 0; i < array_length(walls); i = i + 1) {
        update_scale(walls[i], [0, 0]);
        //TODO : use with "show_map(" together

    }
    for (let i = 0; i < array_length(dots); i = i + 1) {
        update_scale(head(dots[i]), [0, 0]);
    }

    for (let i = 0; i < array_length(powerdots); i = i + 1) {
        update_scale(head(powerdots[i]), [0, 0]);
    }

}


// === UI Functions ===

function show_skin_menu() {
    update_position(title, [2000, 2000]);
    update_position(start_button, [2000, 2000]);
    update_position(options, [300, 100]);
    update_scale(options, [3, 3]);
    // Hide all skins
    for (let i = 0; i < array_length(skins); i = i + 1) {
        update_position(skins[i][0], [2500, 2500]);
        update_position(skins[i][1], [2500, 2500]);
    }
    // Show only the current skin
    if (skin_index === 1) {
        update_scale(skins[skin_index][0], [3.3 / 50, 3.3 / 50]);
        update_scale(skins[skin_index][1], [3.3 / 50, 3.3 / 50]);
    } else {
        update_scale(skins[skin_index][0], [33 / 46, 33 / 45]);
        update_scale(skins[skin_index][1], [33 / 46, 33 / 45]);
    }
    update_position(skins[skin_index][0], [300, 200]);
    update_position(skins[skin_index][1], [300, 200]);
    update_position(prev, [100, 200]);
    update_scale(prev, [1.5, 1.5]);
    update_position(next, [500, 200]);
    update_scale(next, [1.5, 1.5]);
    // Show s_text on skin menu
    update_position(s_text, [300, 350]);
}

function show_pause_menu() {
    show_overlay();
    update_to_top(update_position(pause_title, [300, 200]));
    update_to_top(update_position(resume_button, [300, 300]));
}

function hide_pause_menu() {
    hide_overlay();
    update_position(pause_title, [1000, 1000]);
    update_position(resume_button, [1000, 1000]);
}

function update_score_display() {
    update_text(score_text, "Your Score is : " + stringify(score));
}

function show_game_screen() {
    play_audio(backgroundMusic);
    hide_start_menu();

    // hide select skin
    update_position(options, [1000, 1000]);
    update_position(s_text, [3000, 3000]);

    for (let i = 0; i < array_length(skins); i = i + 1) {
        update_position(skins[i][0], [5000, 5000]); // Hide all skins
        update_position(skins[i][1], [5000, 5000]); // Hide all skins
    }
    // Show only the selected skin at the starting position
    if (skin_index === 1) {
        update_scale(skins[skin_index][0], [3.3 / 50, 3.3 / 50]);
        update_scale(skins[skin_index][1], [3.3 / 50, 3.3 / 50]);
    } else {
        update_scale(skins[skin_index][0], [33 / 46, 33 / 45]);
        update_scale(skins[skin_index][1], [33 / 46, 33 / 45]);
    }


    update_position(skins[skin_index][0], [2 * TILE_SIZE, 4 * TILE_SIZE]);
    pacman[0][0] = skins[skin_index][0];
    update_to_top(pacman[0][0]); // Ensure pacman is visible

    // Handle multi-mode
    if (mode === 1) {
        if (skin_index2 === 1) {
            update_scale(skins[skin_index2][0], [3.3 / 50, 3.3 / 50]);
            update_scale(skins[skin_index2][1], [3.3 / 50, 3.3 / 50]);
        } else {
            update_scale(skins[skin_index2][0], [33 / 46, 33 / 45]);
            update_scale(skins[skin_index2][1], [33 / 46, 33 / 45]);
        }
        // Position second pacman in a valid corridor (column 13, row 5)
        update_position(skins[skin_index2][0], [13 * TILE_SIZE, 5 * TILE_SIZE]);
        pacman[1][0] = skins[skin_index2][0];
        update_to_top(pacman[1][0]); // Ensure second pacman is visible
        update_position(skins[skin_index2][1], [13 * TILE_SIZE, 5 * TILE_SIZE]);
        pacman[1][1] = skins[skin_index2][1];
        update_to_top(pacman[1][1]); // Ensure second pacman is visible
    } else {
        // Hide second pacman in single player mode
        update_position(pacman[1][0], [5000, 5000]);
        update_position(pacman[1][1], [5000, 5000]);
    }

    update_position(next, [3000, 3000]);
    update_position(prev, [3100, 3100]);


    show_map();

    show_gameMenu();

    reset_pacman();

    //update_position(pacman[0],[TILE_SIZE*2,TILE_SIZE*4]);
}

function show_start_menu() {
    update_to_top(update_position(title, [300, 150]));
    update_to_top(update_position(start_button, [300, 350]));

    update_to_top(update_position(options, [300, 400]));
    update_to_top(update_position(mode_multi, [300, 450]));
}


function hide_start_menu() {
    update_position(title, [1500, 1000]);
    update_position(start_button, [2000, 1000]);
    update_position(mode_multi, [5000, 5000]);
    update_position(options, [1000, 1000]);
    update_position(s_text, [3000, 3000]);
}

function hide_map() {
    for (let i = 0; i < array_length(walls); i = i + 1) {
        update_scale(walls[i], [0, 0]);
    }
    for (let i = 0; i < array_length(dots); i = i + 1) {
        update_scale(head(dots[i]), [0, 0]);
    }
    for (let i = 0; i < array_length(powerdots); i = i + 1) {
        update_scale(head(powerdots[i]), [0, 0]);
    }
}

function hide_monsters() {
    for (let i = 0; i < array_length(monsters); i = i + 1) {
        update_scale(monsters[i][0], [0, 0]);
    }
}

function hide_pacman() {
    for (let i = 0; i < array_length(pacman); i = i + 1) {
        for (let j = 0; j < array_length(pacman[i]); j = j + 1) {
            update_position(pacman[i][j], [5000, 5000]);
        }
    }
}


function show_restart() {
    update_to_top(update_position(restart_text, [300, 400]));
    //update_position(single_text,[300,500]);
}

function hide_restart_screen() {
    update_position(restart_text, [2000, 3000]);
}


function show_map() {
    //resize the wall
    for (let i = 0; i < array_length(walls); i = i + 1) {
        update_scale(walls[i], [1, 1]);
    }
    // resize the coin
    for (let i = 0; i < array_length(dots); i = i + 1) {
        update_scale(head(dots[i]), [1, 1]);
    }

    for (let i = 0; i < array_length(powerdots); i = i + 1) {
        update_scale(head(powerdots[i]), [1, 1]);
    }
}


function show_gameMenu() {
    update_to_top(update_position(score_text, [480, 40]));
    update_to_top(update_position(pause_text, [230, 40]));
    update_to_top(update_position(pause_button, [300, 40]));
    update_to_top(update_position(game_title, [60, 20]));
    update_to_top(update_position(restart_button, [540, 80]));
}

function hide_gameMenu() {
    update_position(score_text, [1000, 1000]);
    update_position(pause_text, [1000, 1000]);
    update_position(pause_button, [1000, 1000]);
    update_position(game_title, [1000, 1000]);
    update_position(restart_button, [1000, 1000]);
}


let next_level_text = undefined;
function setup_next_level_text() {
    next_level_text = create_text("Next Level!");
    update_position(next_level_text, [3000, 4000]);
    update_scale(next_level_text, [4, 4]);
}


// === Main Game Loop ===


function game_loop(game_state) {
    //debug_log(count);

    if (startup) {
        reset_monsters();
        //TODO: reset_pacman();
        if (pointer_over_gameobject(start_button) && input_left_mouse_down()) {
            play_audio(startsound);
            stop_audio(menuMusic);
            play_audio(backgroundMusic);

            update_map(new_map_index);
            show_game_screen();
            // Always set correct scale and bring to top after position update
            if (skin_index === 1) {
                update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
            } else {
                update_scale(pacman[0][0], [35 / 46, 35 / 45]);
            }
            update_position(pacman[0][0], [2 * TILE_SIZE, 4 * TILE_SIZE]);
            update_to_top(pacman[0][0]);
            startup = false;
        } if (pointer_over_gameobject(options) && input_left_mouse_down()) {
            show_skin_menu();
        }
        if ((pointer_over_gameobject(next) && input_left_mouse_down()) && skin_index < array_length(skins) - 1) {
            skin_index = skin_index + 1;
            show_skin_menu();
        }
        if ((pointer_over_gameobject(prev) && input_left_mouse_down()) && skin_index > 0) {
            skin_index = skin_index - 1;
            show_skin_menu();
        }
        // Handle s_text global variable click to show game screen
        if (pointer_over_gameobject(s_text) && input_left_mouse_down()) {
            show_game_screen();

            // Always set correct scale and bring to top after position update
            if (skin_index === 1) {
                update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
            } else {
                update_scale(pacman[0][0], [35 / 46, 35 / 45]);
            }
            update_position(pacman[0][0], [2 * TILE_SIZE, 4 * TILE_SIZE]);
            update_to_top(pacman[0][0]);
            startup = false;
        }
        if (pointer_over_gameobject(mode_multi) && input_left_mouse_down()) {
            mode = 1;
            update_map(new_map_index);
            reset_pacman(); // Reset pacman position and color
            show_game_screen();

            // Always set correct scale and bring to top after position update for both pacmen
            if (skin_index === 1) {
                update_scale(pacman[0][0], [3.4 / 50, 3.4 / 50]);
            } else {
                update_scale(pacman[0][0], [35 / 46, 35 / 45]);
            }
            update_position(pacman[0][0], [2 * TILE_SIZE, 4 * TILE_SIZE]);
            update_to_top(pacman[0][0]);
            if (skin_index2 === 1) {
                update_scale(pacman[1][0], [3.4 / 50, 3.4 / 50]);
            } else {
                update_scale(pacman[1][0], [33 / 46, 33 / 45]);
            }
            update_position(pacman[1][0], [13 * TILE_SIZE, 5 * TILE_SIZE]);
            update_to_top(pacman[1][0]);
            startup = false;
        }

    } else {
        if (isPaused) {
            show_pause_menu();
            if (pointer_over_gameobject(resume_button) && input_left_mouse_down()) {
                isPaused = false;
                hide_pause_menu();
                //startup = true ;
            }
        } else {

            if (isWin) {
                //stop_audio(backgroundMusic);
                //play_audio(winsound);

                score = 0;//reset the score

                // choose different map index
                new_map_index = current_map_index;
                while (new_map_index === current_map_index) {
                    new_map_index = math_floor(math_random() * array_length(tile_maps));
                }
                //update_map(new_map_index);

                reset_monsters();
                reset_pacman();

                update_score_display();
                show_win_screen();
                if (pointer_over_gameobject(next_level_text) && input_left_mouse_down()) {
                    isWin = false;
                    hide_win_screen();

                    //reset lives
                    lives1 = 3;
                    lives2 = 3;

                    // level up
                    gamelevel = gamelevel + 1;

                    monsterThreshold = monsterThreshold * (1 - 0.05 * gamelevel);
                    smartchance = smartchance * (1 + 0.5 * gamelevel);

                    update_map(new_map_index);
                    reset_pacman();
                    show_game_screen();
                }
            }

            else if (isLose) {
                show_lose_screen();

                if (pointer_over_gameobject(restart_text) && input_left_mouse_down()) {
                    isLose = false;
                    hide_lose_screen();
                    rebornStart1 = rebornStart2 = get_game_time();
                    //count the time of reborn at this position
                }
            }

            else if (isFail) {
                //stop_audio(backgroundMusic);
                //play_audio(losesound);

                // show the fail interface
                show_overlay();
                show_fail_screen();
                // reset all
                if (pointer_over_gameobject(restart_text) && input_left_mouse_down()) {
                    isFail = false;
                    hide_overlay();
                    hide_fail_screen();
                    hide_map();
                    hide_gameMenu();
                    hide_monsters();
                    hide_pacman();
                    reset_game_parameters();

                    // get back to the main menu
                    startup = true;

                    reset_monsters();
                    show_start_menu();
                }
            }

            //? main game loop
            else {

                if (pointer_over_gameobject(restart_button) && input_left_mouse_down()) {
                    reset_game_parameters();

                    reset_pacman();
                    startup = true;
                    show_start_menu();
                    hide_gameMenu();
                    hide_map();

                    hide_monsters();

                    hide_pacman();
                    //TODO: hide pacman is not working
                }


                //* power mode
                if (power_mode && get_game_time() - power_timer > 5000) {
                    power_mode = false;
                }

                if (power_mode) {
                    debug_log("Power Mode Active");
                    update_color(pacman[0][0], [0, 255, 255, 255]);
                    if (mode === 1) {
                        update_color(pacman[1][0], [0, 255, 0, 255]);
                    }
                }

                if (pointer_over_gameobject(pause_button) && input_left_mouse_down()) {
                    isPaused = true;
                }

                hide_pause_menu();

                // handle with the reborn case
                // player 1
                if (isReborn1) {
                    if (get_game_time() - rebornStart1 > rebornTime) {
                        isReborn1 = false;
                    } else {
                        update_color(pacman[0][0], [0, 255, 255, 255]);
                    }
                } else if (!power_mode) {
                    update_color(pacman[0][0], [255, 255, 0, 255]);
                    //!otherwise, it will be set to yellow even in power mode
                }
                // player2
                if (isReborn2) {
                    if (get_game_time() - rebornStart2 > rebornTime) {
                        isReborn2 = false;
                    } else {
                        update_color(pacman[1][0], [0, 0, 255, 255]);
                    }
                } else {
                    update_color(pacman[1][0], [255, 0, 0, 255]);
                }


                if (score === totalScore) {
                    isWin = true;
                    stop_audio(backgroundMusic);
                    play_audio(winsound);
                }

                if (get_game_time() - prevTime > monsterThreshold) {
                    update_monsters();
                    prevTime = get_game_time();
                }

                if (get_game_time() - prevTime2 > pacmanThershold) {
                    update_player_movement();
                    prevTime2 = get_game_time();
                }

                //update
                update_tweens();

                // Check collisions
                check_dot_collisions();
                check_powerdot_collisions();
                check_monster_collision();

                debug_log("game_loop running");
                count = count + 1;

                //update_gamemenu
                update_score_display();
                if (mode === 1) {
                    update_text(lives_text, "Lives1: " + stringify(lives1) + "  Lives2: " + stringify(lives2));
                } else {
                    update_text(lives_text, "Lives: " + stringify(lives1));
                }
                update_text(level_text, "Level: " + stringify(gamelevel));

                update_to_top(update_position(lives_text, [80, 60]));
                update_to_top(update_position(level_text, [80, 80]));
            }
        }
    }
}

// === Game Entry Point ===

function setup_pacman_game() {
    setup_canvas();
    setup_skin_menu();
    setup_gameMenu();
    setup_pause_menu();
    setup_startup_screen();
    setup_player();
    //setup_maze_and_dots();
    setup_all_maps();
    update_map(0); // Initialize with first map
    setup_monsters();
    setup_overlay();
    setup_win_screen();
    setup_fail_screen();
    setup_lose_screen();
    setup_restart();
    setup_next_level_text();
}

//enable_debug();

setup_pacman_game();
update_loop(game_loop);
build_game();











//*  A* pathfinding for grid-based map
function astar_find_path(start, goal, tile_map) {
    const rows = array_length(tile_map);
    const cols = array_length(get_array_element(tile_map, 0));
    const openSet = [];
    // openSet will contain the keys of positions to be (or we say being) evaluated
    const closedSet = [];

    // use {} ?
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    // [x, y] -> string key
    function pos_key(pos) {
        return stringify(get_array_element(pos, 0))
            + ","
            + stringify(get_array_element(pos, 1));
    }

    function parse_pos(key) {
        // key: "x,y" -> [x, y]
        const arr = [];
        let idx = 0;
        let num = "";
        for (let i = 0; i < length(key); i = i + 1) {
            const ch = char_at(key, i);
            if (ch === ",") {
                arr[idx] = parse_int(num);
                idx = idx + 1;
                num = "";
            } else {
                num = num + ch;
            }
        }
        arr[idx] = parse_int(num);
        return arr;
    }

    function neighbors(pos) {
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const result = [];
        for (let i = 0; i < 4; i = i + 1) {
            const nx = get_array_element(pos, 0)
                + get_array_element(get_array_element(dirs, i), 0);
            const ny = get_array_element(pos, 1)
                + get_array_element(get_array_element(dirs, i), 1);
            if (nx >= 0
                && nx < cols
                && ny >= 0
                && ny < rows
                && get_array_element(get_array_element(tile_map, ny), nx) !== 1) {
                push(result, [nx, ny]);
                // if not a wall, add to neighbors
            }
        }
        return result;
    }

    //? we use Manhattan distance as heuristic
    function heuristic(a, b) {
        return math_abs(get_array_element(a, 0)
            - get_array_element(b, 0))
            + math_abs(get_array_element(a, 1)
                - get_array_element(b, 1));
    }

    const startKey = pos_key(start);
    push(openSet, startKey);

    //? a* uses gScore and fScore to track the cost of the path
    //? gScore: cost from start to current node
    //? fScore: estimated cost from start to goal through current node
    gScore[startKey] = 0;
    fScore[startKey] = heuristic(start, goal);

    while (array_length(openSet) > 0) {
        // check all the openSet to find the node with the lowest fScore
        // this is the current node we are evaluating
        let currentKey = get_array_element(openSet, 0);
        let currentIdx = 0;
        for (let i = 1; i < array_length(openSet); i = i + 1) {
            if ((fScore[get_array_element(openSet, i)] || 99999)
                < (fScore[currentKey] || 99999)) {
                currentKey = get_array_element(openSet, i);
                currentIdx = i;
            }
        }
        const current = parse_pos(currentKey);

        // if we reach the goal, we can reconstruct the path
        if (get_array_element(current, 0) === get_array_element(goal, 0)
            && get_array_element(current, 1) === get_array_element(goal, 1)) {
            const path = [];
            let ck = currentKey;
            while (cameFrom[ck]) {
                push(path, parse_pos(ck));
                ck = cameFrom[ck];
            }

            // reverse the path to get from start to goal
            const rev = [];
            for (let i = array_length(path) - 1; i >= 0; i = i - 1) {
                push(rev, get_array_element(path, i));
            }
            return rev;
        }

        // remove current from openSet and add to closedSet
        const newOpenSet = [];
        for (let i = 0; i < array_length(openSet); i = i + 1) {
            if (i !== currentIdx) {
                push(newOpenSet, get_array_element(openSet, i));
            }
        }
        openSet = newOpenSet;

        push(closedSet, currentKey);

        // check neighbors of current node
        // and update their gScore and fScore
        const ns = neighbors(current);
        for (let i = 0; i < array_length(ns); i = i + 1) {
            const neighbor = get_array_element(ns, i);
            const neighborKey = pos_key(neighbor);
            let closed = false;

            // if neighbor is in closedSet(already explored), skip it
            for (let j = 0; j < array_length(closedSet); j = j + 1) {
                if (get_array_element(closedSet, j) === neighborKey) {
                    closed = true;
                }
            }
            if (closed) { continue; }

            // if neighbor is in current openSet, we can skip it , 
            // 'cause we already have a better path to it
            const tentative_gScore = (gScore[currentKey] || 99999) + 1;
            let inOpen = false;
            for (let j = 0; j < array_length(openSet); j = j + 1) {
                if (get_array_element(openSet, j) === neighborKey) {
                    inOpen = true;
                }
            }

            // if neighbor is not in openSet, we need to add it
            // or update its gScore and fScore if we found a better path
            if (!inOpen) {
                push(openSet, neighborKey);
            } else if (tentative_gScore >= (gScore[neighborKey] || 99999)) {
                continue;
            }

            // update the cameFrom, gScore and fScore for the neighbor
            // we use the current node as the previous node for the neighbor
            // this is how we reconstruct the path later
            cameFrom[neighborKey] = currentKey;
            gScore[neighborKey] = tentative_gScore;
            fScore[neighborKey] = tentative_gScore + heuristic(neighbor, goal);
        }
    }
    return []; // no path found
}
