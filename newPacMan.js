// ======================================
//        Pac-Man Skeleton (Arcade 2D)
//        Team-based Structure
// ======================================



//import part
import {
    set_dimensions, set_fps, enable_debug, debug_log,
    query_pointer_position, input_left_mouse_down,
    create_circle,
    pointer_over_gameobject,
    get_game_time,update_to_top,
    update_position, create_text, update_text, gameobjects_overlap, update_scale,
    update_loop, build_game, create_sprite, set_scale, update_color, query_position
} from 'arcade_2d';
//ATTENTION: THE "DEBUG_LOG" FUNCTION CAN ONLY BE ACTIVITATED IN "GAME_LOOP"

// import {
//     set_position
// } from 'game';


/* TODO: START-UP INTERFACE
         WIN & LOSE INTERFACE
         MENU
*/

set_dimensions([600, 550]);   // Game canvas size
set_fps(30); 



// === Global GameObjects and State ===
const pacman = undefined;
const pacman_hitbox = undefined;
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

let win_text = undefined;
let lose_text = undefined;

//let map_height =
//let map_width =
let tile_map = [] ;

let isPaused = false ;


//helper function
function push(array, element) {
    //const newLength = array['length'] + 1;
    //array[array['length']] = element;
    //from JIAO :this is syntax in JavaScript , I've renewed it

    const newLength = array_length(array) + 1;
    array[array_length(array)] = element;
    return newLength;
}

function get_array_element(array, index) {
    return array[index];
}

/*
//Check if there is any element in an array suits the callback func
function array_some(array, callback) {
    const length = array_length(array);
    let i = 0;

    while (i < length) {
        if (callback(get_array_element(array, i), i, array)) {
            return true;
        }
        i = i + 1;
    }

    return false;
}
*/




//GAME FUNCTIOM


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
    //debug_log("upsd is called");
}// this can be included in game_menu


function show_game_screen() {
    
    update_position(title, [1500, 1000]);
    update_position(start_button, [2000, 1000]);
    update_position(monsters[0][0], [350, 350]); //TODO
    show_map();
    show_gameMenu();
}

function show_map() {
        //resize the wall
    for (let i = 0; i < array_length(walls); i = i + 1) {
        update_scale(walls[i], [1.2, 1.2]);
    }

    //  resize the coin
    for (let i = 0; i < array_length(dots); i = i + 1) {
        update_scale(head(dots[i]), [1.2, 1.2]);
    }
}




function show_gameMenu() {
    update_position(score_text, [480, 40]);
    update_position(pause_text, [230, 40]);
    update_position(pause_button, [300, 40]);
    update_position(game_title, [80, 40]);  
}



//from freya
function restart_game(){
    score = 0;
    power_mode = false;
    power_timer = 0;
    update_position(title,[1000,1000]);
    update_position(start_button,[800,800]);
    update_position(win_text,[1000,1000]);
    update_position(lose_text,[1000,1000]);
}





function show_win_screen() {
    win_text = create_text("YOU WIN!");
    update_position(win_text,[300,400]);
    update_scale(win_text,[4,4]);
    startup = true;

}


function show_lose_screen(){
    lose_text = create_text("YOU LOSE!");
    update_position(lose_text,[300,400]);
    update_scale(lose_text,[4,4]);
}



// ===  Aryaman: Player Control ===

function setup_player() {
    // Create pacman sprite or circle
    // Create invisible hitbox circle
    // Set initial position of both
    // No object creation inside game_loop
}

function update_player_movement() {
    // if input_key_down("LEFT"), move pacman left
    // Sync hitbox position with pacman
}





// ===  Freya: Maze and Dots ===

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
                    push(walls,update_scale(update_position(create_sprite(wall_image_link),pos),[0,0]));
                }
                else{
                    push(dots,pair(update_scale(update_position(create_sprite(yellowdot_image_link),pos),[0,0]),false));
                    totalScore = totalScore + 1 ;
                }
            }
        }
        
        /*
        for (let row = 0; row < array_length(tile_map); row = row + 1) {
            const current_row = tile_map[row];
            for (let col = 0; col < array_length(current_row); col = col + 1) {
                const tile = current_row[col];
                const pos = [(col+1) * TILE_SIZE, (row+1) * TILE_SIZE];

                if (tile === 1) {
                    update_position(update_scale(create_sprite(wall_image_link),[1.2,1.2]), pos);
                }
                else {
                    const is_white = row + col ===2;
                    const dot = create_sprite(is_white ?whitedot_image_link :yellowdot_image_link);
                    update_position(update_scale(dot,[1.2,1.2]), pos);
                   
                    totalScore = totalScore +1;

                }
            }
        }
        */    //From JIAO : I will accomplish these in another function
    }
    
    render_map();
    
    // Create outer boundary walls using create_rectangle

    // Create dots using create_circle, store in dots[]
    // Set fixed positions for dots
    /*function create_dot_at(pos) {
        const dot = create_circle(3);
        update_position(dot, pos);
        append(dots, pair(dot, false)); // From JIAO : I need the "false" to judge whether the dot is ate
        // plz use this function or other function that generates "pair(dot,false)"
    }
    */
}





// === Jiayan: Monster Setup and Behavior ===

const goup = 0;
const godown = 1;
const goleft = 2;
const goright = 3;



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
} //simplified



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


function predic_wall(x,y) //parameters are the authentic position
{
    const predCol = x ; 
    const predRow = y ;
    if (tile_map[predRow-3][predCol-1] === 1) 
    {
        return true;
        
    }
    
    else{
        return false;
    }
    
}


function get_valid_directions(x, y, exclude_dir) {
    const directions = [goup, godown, goleft, goright];
    const valid = [];

    for (let i = 0; i < 4; i = i + 1) {
        const dir = directions[i];
        const next_pos = update_new_position(dir, x, y); // try the four possible directions
        const nx = get_array_element(next_pos, 0);
        const ny = get_array_element(next_pos, 1);

        if (!predic_wall(nx, ny) && dir !== opposite_direction(exclude_dir)) {
            push(valid, dir); // 如果不是墙，且不回头，就加入合法方向
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

function update_monsters() {
    const monster_info = monsters[0];
    const sprite = get_array_element(monster_info, 0);
    let x = get_array_element(monster_info, 1);
    let y = get_array_element(monster_info, 2);
    let dir = get_array_element(monster_info, 3);

    //  crossroad logic
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

        const hitWall = predic_wall(newx,newy);
        
        debug_log(hitWall);
        
        if (!hitWall) {
            // 成功移动
            x = newx;
            y = newy;
            monsters[0][1] = x;
            monsters[0][2] = y;
            monsters[0][3] = dir;
            //if(get_game_time()-prevTime>100){
            update_position(sprite, [x * TILE_SIZE, y * TILE_SIZE]);
            moved = true;
            prevTime = get_game_time();
            //}
        } else {
            // 换个方向重试
            dir = math_floor(math_random() * 4);
            attempts = attempts + 1;
            debug_log(attempts);
        }
    }
    
}
    




// === JIAO: Dot Collection and Score ===





function check_dot_collisions() {
    //debug_log(array_length(dots));
    for (let i = 0; i < array_length(dots); i = i + 1) {
        const dot_pair = dots[i];
        const dot_obj = head(dot_pair);
        const eaten_flag = tail(dot_pair);

        if (!eaten_flag && gameobjects_overlap(pacman_hitbox, dot_obj)) {
            dots[i] = pair(dot_obj, true);  // renew the pair
            update_scale(dot_obj, [0, 0]);
            score = score + 1;
            
        }
    }
}

function check_monster_collision() {
    let i = 0;
    while (i<array_length(monsters)){
        const m = monsters[i][0];
        if (gameobjects_overlap(m, pacman_hitbox)){
            if (!power_mode){
                show_lose_screen();
                startup = true;
            }
        }
        i = i + 1;
    }

}




let count = 0;
let prevTime = 0;
// ===  Main Game Loop ===

function game_loop(game_state) {
    debug_log(count);

    if (startup) {
        if (pointer_over_gameobject(start_button) && input_left_mouse_down()) {
            show_game_screen();
            startup = false;
        }

    } else {
        if (isPaused) {
            show_pause_menu();

            if (pointer_over_gameobject(resume_button) && input_left_mouse_down()) {
                isPaused = false;
                hide_pause_menu();
            }
        } else {
            if (pointer_over_gameobject(pause_button) && input_left_mouse_down()) {
                isPaused = true;
            }

            hide_pause_menu();

            if (score === totalScore) {
                show_win_screen();
            }

            if (get_game_time() - prevTime > 700) {
                update_monsters();
                prevTime = get_game_time();
            }

            debug_log("game_loop running");
            count = count + 1;
            update_score_display();
        }
    }
}






// === 🟩 Game Entry Point ===

//ATTENTION:CANNOT USE A FUNCTION TO WRAP THE FUNCTION "BUILD_GAME"!!
//OTHERWISE THERE WILL BE NO OUTPUT AT ALL

//function init_game() {
                 // 30 frames per second
//enable_debug();               // Show debug hitboxes
setup_gameMenu();
setup_pause_menu();
setup_startup_screen();
setup_player();               // Aryaman
setup_maze_and_dots();        // Freya
setup_monsters();             // Jiayan



update_loop(game_loop);
build_game();
//}

//init_game();



