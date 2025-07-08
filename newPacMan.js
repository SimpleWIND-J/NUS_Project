// ======================================
//        Pac-Man Skeleton (Arcade 2D)
//        Team-based Structure
// ======================================


//import part
import {
    set_dimensions,set_fps,enable_debug,debug_log,
    update_position,create_text,update_text,
    update_loop,build_game
} from 'arcade_2d';


// === Global GameObjects and State ===
const pacman = undefined;
const pacman_hitbox = undefined;
const monsters = [];    
const dots = [];         
let score = 0;
let score_text = undefined;



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
    // Create outer boundary walls using create_rectangle
    // Optional: create inner maze blocks
    // Create dots using create_circle, store in dots[]
    // Set fixed positions for dots
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





// === JIAO: Dot Collection and Score ===

function setup_score_display() {
    score_text = update_position(create_text("Your Score is:"), [700, 50]);
}

function update_score_display() {
    update_text(score_text, score);
    debug_log("upsd is called");
}

function check_dot_collisions() {
    // For each dot in dots:
    //   if gameobjects_overlap(pacman_hitbox, dot):
    //       hide or move dot
    //       increment score
    //       update_score_display()
}





// ===  Main Game Loop ===


function game_loop(game_state) {
    update_player_movement();    // Aryaman
    update_monsters();           // Jiayan
    check_dot_collisions();      // JIAO
    update_score_display();
    

    // Optional: win condition check?
}



// === 🟩 Game Entry Point ===

//ATTENTION:CANNOT USE A  FUNCTION TO WRAP THE FUNCTION "BUILD_GAME"!!

//function init_game() {
    set_dimensions([800, 800]);   // Game canvas size
    set_fps(30);                  // 30 frames per second
    enable_debug();               // Show debug hitboxes

    setup_player();               // Aryaman
    setup_maze_and_dots();        // Freya
    setup_monsters();             // Jiayan
    setup_score_display();        // JIAO

    update_loop(game_loop);       
    build_game();                 
//}

//init_game();



