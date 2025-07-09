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
    update_loop, build_game, create_sprite, set_scale, update_color
} from 'arcade_2d';
//ATTENTION: THE "DEBUG_LOG" FUNCTION CAN ONLY BE ACTIVITATED IN "GAME_LOOP"

import {
    set_position
} from 'game';


/* TODO: START-UP INTERFACE
         WIN & LOSE INTERFACE
         MENU
*/





// === Global GameObjects and State ===
const pacman = undefined;
const pacman_hitbox = undefined;
const monsters = [];
const walls = [];
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

const goup= 0;
const godown= 1;
const goleft= 2;
const goright= 3;

function push(array, element) {
  const newLength = array['length'] + 1;
  array[array['length']] = element;
  return newLength;
}

function get_array_element(array, index) {
  return array[index];
}

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

function update_new_position(dir,x,y){
    let newx=x;
    let newy=y;
    
    const directions=[goup,godown,goleft,goright];
    let i=0;
    while (i<4){
        const currentdir=directions[i];
        if(dir === currentdir){
            if(currentdir===goup){
                newy=newy-1;
                }
            else if (currentdir === godown){
                newy=newy+1;
            }
            else if (currentdir === goleft){
                newx=newx-1;
            }
            else if (currentdir === goright){
            newx=newx+1;
            }
            break;
      }
      i=i+1;
    }
    return [newx,newy];
}

function setup_monsters(x, y, color) {
  const sprite = create_sprite();//not very sure about how to put my image
  set_scale(sprite, 1, 1);    
  update_color(sprite, color);
  
  const screenX = x * 30;//assume one grid is 30px
  const screenY = y * 30;
  set_position(sprite, screenX, screenY);
  
  const direction = math_floor(math_random() * 4);
  
  push(monsters, [sprite, x, y, direction]);

  return [sprite, x, y, direction];
}


function randomMoveMonster(monsters, walls) {
  const sprite = get_array_element(monsters, 0);
  let x = get_array_element(monsters, 1);
  let y = get_array_element(monsters, 2);
  let dir = get_array_element(monsters, 3);

  const newposition= update_new_position(dir,x,y);
  const newx= get_array_element(newposition,0);
  const newy= get_array_element(newposition,1);
  
  
  const isWall = array_some(walls, wall => 
    get_array_element(wall, 0) === newx && 
    get_array_element(wall, 1) === newy
  );
  const isOutOfBounds = newx < 0 || newx >= map_width || newy < 0 || newy >= map_height;

  if (isWall || isOutOfBounds) {
    dir = math_floor(math_random() * 4);
    monsters[3]=dir; 
  } else {
    x=newx;
    y=newy;
    monsters[1]=x;
    monsters[2]=y;
    set_position(sprite, x * 30, y * 30);
  }
}

setup_monsters(1,1,'red');
setup_monsters(3,3,'yellow');
setup_monsters(5,5,'blue');

//From Jiao : I'll write the function to judge whether the pac man is ate by monsters






// === JIAO: Dot Collection and Score ===

function setup_score_display() {
    score_text = update_position(create_text("Your Score is: 0"), [1000.1000]);
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
        update_position(score_text,[700, 50]);
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



