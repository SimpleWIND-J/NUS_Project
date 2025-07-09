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
    update_position, create_text, update_text, gameobjects_overlap, update_scale,
    update_loop, build_game
} from 'arcade_2d';
//ATTENTION: THE "DEBUG_LOG" FUNCTION CAN ONLY BE ACTIVITATED IN "GAME_LOOP"




/* TODO: START-UP INTERFACE
         WIN & LOSE INTERFACE
         MENU
*/





// === Global GameObjects and State ===
const pacman = undefined;
const pacman_hitbox = undefined;
const monsters = [];
const dots = list(); //use list is more convenient , because it have more funcions         
let score = 0;
let totalScore = 0;
let score_text = undefined;
let startup = true ;
let start_button = undefined;



function setup_startup_screen() {
    const title = create_text("PACMAN");
    update_position(title, [300, 200]);

    start_button = create_text("Start Game");
    update_position(start_button, [300, 250]);
    update_scale(start_button, [2, 2]); // 放大一点
}



function gameMenu() {

}

function show_win_screen(){
    
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

function setup_maze_and_dots() {
    // From JIAO : I need a variable named 'totalScore' , which equals to the num of dots
    // and has been predeclared
    // plz help me accomplish it in your function


    // Create outer boundary walls using create_rectangle

    // Create dots using create_circle, store in dots[]
    // Set fixed positions for dots
    function create_dot_at(pos) {
        const dot = create_circle(3);
        update_position(dot, pos);
        append(dots, pair(dot, false)); // From JIAO : I need the "false" to judge whether the dot is ate
        // plz use this function or other function that generates "pair(dot,false)"
    }
}





// === Jiayan: Monster Setup and Behavior ===

function setup_monsters() {
    // Create monster sprites or circles
    // Assign initial direction { dx, dy }
    // Store each monster and direction in monsters[]
}

function update_monsters() {
    // Move each monster by its direction
    // If collision with wall, pick new random direction
}

//From Jiao : I'll write the function to judge whether the pac man is ate by monsters






// === JIAO: Dot Collection and Score ===

function setup_score_display() {
    score_text = update_position(create_text("Your Score is: 0"), [700, 50]);
}

function update_score_display() {
    update_text(score_text, "Your Score is : " + stringify(score));
    //debug_log("upsd is called");
}// this can be included in game_menu

function check_dot_collisions() {
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






// ===  Main Game Loop ===

function game_loop(game_state) {
    if (startup) {
        if (pointer_over_gameobject(start_button) && input_left_mouse_down()) {
            // these two functions must be called in gameloop
            // destroy_obj(start_button);  // release
            startup = false;
        }

    }

    else {
        update_position();
        if (score === totalScore) {
            show_win_screen();
            
        }

        update_player_movement();
        update_monsters();
        //check_dot_collisions();
        update_score_display();
    }
}





// === 🟩 Game Entry Point ===

//ATTENTION:CANNOT USE A FUNCTION TO WRAP THE FUNCTION "BUILD_GAME"!!
//OTHERWISE THERE WILL BE NO OUTPUT AT ALL

//function init_game() {
set_dimensions([800, 800]);   // Game canvas size
set_fps(30);                  // 30 frames per second
enable_debug();               // Show debug hitboxes

setup_startup_screen();
setup_player();               // Aryaman
setup_maze_and_dots();        // Freya
setup_monsters();             // Jiayan
setup_score_display();        // JIAO



update_loop(game_loop);
build_game();
//}

//init_game();



