// ======================================
//        Pac-Man Skeleton (Arcade 2D)
//        Team-based Structure - Source §4 Compatible
// ======================================

import {
    set_dimensions, set_fps, enable_debug, debug_log,
    query_pointer_position, input_left_mouse_down,
    create_circle,
    pointer_over_gameobject,
    get_game_time, update_to_top,
    update_position, create_text, update_text, gameobjects_overlap, update_scale,
    update_loop, build_game, create_sprite, set_scale, update_color, query_position,
    input_key_down, update_rotation
} from 'arcade_2d';



// === Global GameObjects and State ========================
let pacman = undefined;
const monsters = [];
// the element in monsters[] is in the format [obj,x,y,dir]
const walls = [];
const dots = [];
// the element in dots[] is in the format pair(obj,isate)
const TILE_SIZE = 35;
let score = 0;
let totalScore = 0;

//gameMenu
let score_text = undefined;
let pause_text = undefined;
let pause_button = undefined;
let game_title = undefined;

//pauseMenu
let pause_title = undefined;
let resume_button = undefined;

let title = undefined;
let startup = true;
let start_button = undefined;

let map_width = 800;
let map_height = 800;

let power_mode = false;
let power_timer = 0;

//win
let win_text = undefined;
let lose_text = undefined;
let isWin = false ;
let isLose = false ;


//restart
let restart_text = undefined;

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



//============================================================






//============helper function=================================

function push(array, element) {
    const newLength = array_length(array) + 1;
    array[array_length(array)] = element;
    return newLength;
}


function get_array_element(array, index) {
    return array[index];
}


function add_vectors(to, from) 
{
        to[0] = to[0] + from[0];
        to[1] = to[1] + from[1];
    }


function add_vectors_new(a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    }
    
    
function predic_wall(x, y) {
    const predCol = x; 
    const predRow = y;
    if (tile_map[predRow-3][predCol-1] === 1) {
        return true;
    } else {
        return false;
    }
}

function reset_all_dots() {
    for (let i = 0; i < array_length(dots); i = i + 1) {
        const dot_obj = head(dots[i]);
        dots[i] = pair(dot_obj, false);
        update_scale(dot_obj, [1, 1]); 
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
    if (dir === goup) {return godown;}
    if (dir === godown) {return goup;}
    if (dir === goleft) {return goright;}
    if (dir === goright) {return goleft;}
}

//---- check collision ---------
function check_dot_collisions() {
    for (let i = 0; i < array_length(dots); i = i + 1) {
        const dot_pair = dots[i];
        const dot_obj = head(dot_pair);
        const eaten_flag = tail(dot_pair);

        if (!eaten_flag && gameobjects_overlap(pacman, dot_obj)) {
            dots[i] = pair(dot_obj, true);
            update_scale(dot_obj, [0, 0]);
            score = score + 1;
        }
    }
}

function check_monster_collision() {
    let i = 0;
    while (i < array_length(monsters)) {
        const m = monsters[i][0];
        if (gameobjects_overlap(m, pacman)) {
            if (!power_mode) {
                isLose = true ;
            }
        }
        i = i + 1;
    }
}
    
//============================================================






//========= SETUP FUNCTIONS  =================================

//--------- UI FUNCTIONS     ------------------
function setup_canvas()
{
    set_dimensions([600, 550]);
    
}

function setup_startup_screen() {
    title = create_text("PACMAN");
    update_position(title, [300, 150]);
    update_scale(title, [4, 4]);
    start_button = create_text("Start Game");
    update_position(start_button, [300, 350]);
    update_scale(start_button, [2, 2]);
}

function setup_pause_menu() {
    pause_title = create_text("Game Paused");
    update_position(pause_title, [1000, 3000]); 
    update_scale(pause_title, [3, 3]);
    
    resume_button = create_text("Resume");
    update_position(resume_button, [2000, 1000]);
    update_scale(resume_button, [2, 2]);
}

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
}

function setup_win_screen() {
    win_text = create_text("YOU WIN!");
    update_position(win_text, [3000, 4000]);
    update_scale(win_text, [4, 4]);
    startup = true;
}

function setup_restart()
{
    restart_text = create_text("TRY AGAIN!");
    update_position(restart_text, [3000, 4000]);
    update_scale(lose_text, [4, 4]);
}

function setup_lose_screen() {
    lose_text = create_text("YOU LOSE!");
    update_position(lose_text, [3000, 4000]);
    update_scale(lose_text, [4, 4]);
}

//-----------------------------------------------


//--------- GAME OBJ ----------------------------

function setup_player() {
    // Create pacman sprite
    const up_url = "https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/pacmanUp.png";
    pacman = create_sprite(up_url);
    update_scale(pacman, [35/46, 35/45]);
    
    // Position pacman at a default starting position (will be updated after map is created)
    const start_pos = [2 * TILE_SIZE, 4 * TILE_SIZE]; // Position at [1,1] in map coordinates
    update_position(pacman, start_pos);
}



// 1 -> wall , 0 ->coin ,
function setup_maze_and_dots() {
     tile_map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const wall_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/pinkwall.png';
    const yellowdot_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/yellowball.png';
    const whitedot_image_link = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/whiteball.png';

    function render_map() {
        for (let row = 0; row < array_length(tile_map); row = row + 1) {
            const current_row = tile_map[row];
            for (let col = 0; col < array_length(current_row); col = col + 1) {
                const tile = current_row[col];
                const pos = [(col+1) * TILE_SIZE, (row+3) * TILE_SIZE];
                if (tile === 1) {
                    push(walls, update_scale(update_position(create_sprite(wall_image_link), pos), [0, 0]));
                }
                else {
                    push(dots, pair(update_scale(update_position(create_sprite(yellowdot_image_link), pos), [0, 0]), false));
                    totalScore = totalScore + 1;
                }
            }
        }
    }
    
    render_map();
    
    // Position player at a valid starting position after map is created
    let start_x = 1;
    let start_y = 1;
    // Look for first empty space in the map
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
    
    // Update pacman position to valid starting position
    const start_pos = [(start_x + 1) * TILE_SIZE, (start_y + 3) * TILE_SIZE];
    update_position(pacman, start_pos);
}



function setup_monsters() {
    function build_monsters(x, y, color) {
        const imageLink = 'https://raw.githubusercontent.com/SimpleWIND-J/NUS_Project/refs/heads/main/images/monster.png';
        const sprite = create_sprite(imageLink);
        update_scale(sprite, [1, 1]);
        update_position(sprite, [1000, 2000]);
        const direction = math_floor(math_random() * 4);
        push(monsters, [sprite, x, y, direction]);
        return [sprite, x, y, direction];
    }
    push(monsters, build_monsters(10, 10, [255, 0, 0, 255]));
}


//----------------------------------------------------


//=========================================================







//============== SHOW AND HIDE FUNCTIONS ==================

function show_win_screen()
{
    update_to_top(update_position(win_text,[300,200]));
    show_restart();
}

function hide_win_screen(){
    update_position(win_text,[2000,3000]);
    hide_restart_screen();
}



function show_lose_screen()
{
    update_to_top(update_position(lose_text,[300,200]));
    show_restart();
}

function hide_lose_screen(){
    update_position(lose_text,[2000,3000]);
    hide_restart_screen();
}


function show_restart()
{
    update_to_top(update_position(restart_text,[300,400]));
}

function hide_restart_screen(){
    update_position(restart_text,[2000,3000]);
}



//===============================================================






//================== UPDATE FUNCTIONS ===========================

function update_player_movement() {
    const movement_dist = TILE_SIZE;
    function collisionWall(dir, pos) {
        let v = [0, 0];
        if (dir === "w") {
            v = [0, -movement_dist];
        } else if (dir === "a") {
            v = [-movement_dist, 0];
        } else if (dir === "s") {
            v = [0, movement_dist];
        } else if (dir === "d") {
            v = [movement_dist, 0];
        }
    
        const test_pos = add_vectors_new(pos, v);
        const col = math_floor(test_pos[0] / TILE_SIZE) - 1; // Adjust for offset
        const row = math_floor(test_pos[1] / TILE_SIZE) - 3; // Adjust for offset
        
        if (
            row < 0 || row >= array_length(tile_map) ||
            col < 0 || col >= array_length(tile_map[0])
        ) {
            return true;
        }
        
        return tile_map[row][col] === 1;
    }
    
    function velocity(dir, pos) {
        if (dir === "w" && !collisionWall(dir, pos)) {
            add_vectors(pos, [0, -movement_dist]);
            update_rotation(pacman, 0);
        }
        if (dir === "a" && !collisionWall(dir, pos)) {
            add_vectors(pos, [-movement_dist, 0]);
            update_rotation(pacman, math_PI * 1.5);
        }
        if (dir === "s" && !collisionWall(dir, pos)) {
            add_vectors(pos, [0, movement_dist]);
            update_rotation(pacman, math_PI);
        }
        if (dir === "d" && !collisionWall(dir, pos)) {
            add_vectors(pos, [movement_dist, 0]);
            update_rotation(pacman, math_PI * 0.5);
        }
    }
    
    const current_position = query_position(pacman);
    
    // Check for new input to change direction
    if (input_key_down("w")) {
        current_direction = "w";
    }
    if (input_key_down("a")) {
        current_direction = "a";
    }
    if (input_key_down("s")) {
        current_direction = "s";
    }
    if (input_key_down("d")) {
        current_direction = "d";
    }
    
    // Continue moving in the current direction if no wall collision
    if (current_direction !== "" && !collisionWall(current_direction, current_position)) {
        velocity(current_direction, current_position);
    } else if (current_direction !== "" && collisionWall(current_direction, current_position)) {
        // Stop movement if hitting a wall
        current_direction = "";
    }
    
    update_position(pacman, current_position);
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
    const monster_info = monsters[0];
    const sprite = get_array_element(monster_info, 0);
    let x = get_array_element(monster_info, 1);
    let y = get_array_element(monster_info, 2);
    let dir = get_array_element(monster_info, 3);

    // crossroad logic
    const valid_dirs = get_valid_directions(x, y, dir);
    if (array_length(valid_dirs) >= 2) {
        dir = get_array_element(valid_dirs, math_floor(math_random() * array_length(valid_dirs)));
    }
    
    let moved = false;
    let attempts = 0;

    while (!moved && attempts < 4) {
        const newpos = update_new_position(dir, x, y);
        const newx = get_array_element(newpos, 0);
        const newy = get_array_element(newpos, 1);
        debug_log(newx);
        debug_log(newy);

        const hitWall = predic_wall(newx, newy);
        
        debug_log(hitWall);
        
        if (!hitWall) {
            // Successfully moved
            x = newx;
            y = newy;
            monsters[0][1] = x;
            monsters[0][2] = y;
            monsters[0][3] = dir;
            update_position(sprite, [x * TILE_SIZE, y * TILE_SIZE]);
            moved = true;
        } else {
            // Try different direction
            dir = math_floor(math_random() * 4);
            attempts = attempts + 1;
            debug_log(attempts);
        }
    }
}


// === UI Functions ===


function show_pause_menu() {
    update_to_top(update_position(pause_title, [300, 200]));
    update_to_top(update_position(resume_button, [300, 300]));
}

function hide_pause_menu() {
    update_position(pause_title, [1000, 1000]);
    update_position(resume_button, [1000, 1000]);
}

function update_score_display() {
    update_text(score_text, "Your Score is : " + stringify(score));
}

function show_game_screen() {
    hide_start_menu();
    show_map();
    show_gameMenu();
}

function show_start_menu()
{
    update_to_top(update_position(title, [300, 150]));
    update_to_top(update_position(start_button, [300, 350]));
}

function hide_start_menu()
{
    update_position(title, [1500, 1000]);
    update_position(start_button, [2000, 1000]);
    update_position(monsters[0][0], [350, 350]);
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
}

function show_gameMenu() {
    update_to_top(update_position(score_text, [480, 40]));
    update_to_top(update_position(pause_text, [230, 40]));
    update_to_top(update_position(pause_button, [300, 40]));
    update_to_top(update_position(game_title, [80, 40]));  
}

function restart_game() {
    score = 0;
    power_mode = false;
    power_timer = 0;
    update_position(title, [1000, 1000]);
    update_position(start_button, [800, 800]);
    update_position(win_text, [1000, 1000]);
    update_position(lose_text, [1000, 1000]);
}


// === Main Game Loop ===


function game_loop(game_state) {
    debug_log(count);

    if (startup) {
        if (pointer_over_gameobject(start_button) && input_left_mouse_down()) {
            show_game_screen();
            update_to_top(update_position(pacman,[70,140]));
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
            
            if(isWin){
                score = 0 ;
                reset_all_dots();
                //reset the map !
                
                update_score_display();
                show_win_screen();
                if (pointer_over_gameobject(restart_text) && input_left_mouse_down()) {
                isWin = false;
                hide_win_screen();
                startup = true ;
                show_start_menu();
                }
            }
            
            else if (isLose)
            {
                show_lose_screen();
                if (pointer_over_gameobject(restart_text) && input_left_mouse_down()) {
                isLose = false;
                hide_lose_screen();
                
                }
            }
            
            else
            {
            if (pointer_over_gameobject(pause_button) && input_left_mouse_down()) {
                isPaused = true;
            }

            hide_pause_menu();

            if (score === totalScore) {
                isWin = true ;
            }

            if (get_game_time() - prevTime > 700) {
                update_monsters();
                prevTime = get_game_time();
            }

        
            if(get_game_time() - prevTime2>180){
                update_player_movement();
                prevTime2 = get_game_time();
            }
            // Check collisions
            check_dot_collisions();
            check_monster_collision();

            debug_log("game_loop running");
            count = count + 1;
            update_score_display();
        }
        }
    }
}

// === Game Entry Point ===

function setup_pacman_game()
{
    setup_canvas();
    setup_gameMenu();
    setup_pause_menu();
    setup_startup_screen();
    setup_player();
    setup_maze_and_dots();
    setup_monsters();
    setup_win_screen();
    setup_lose_screen();
    setup_restart();
}


setup_pacman_game();
update_loop(game_loop);
build_game();