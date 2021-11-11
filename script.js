"use strict";

let canvas = document.getElementById("canvas");
canvas.width = 200;
canvas.height = 200;
let ctx = canvas.getContext("2d");
ctx.lineWidth = 1;
ctx.shadowColor = "black";
let pausemenu = document.getElementById("pausemenu");

let keyshtml = document.getElementById("keyshtml");
keyshtml.value = " Current Keys Collected:  ";
let levelhtml = document.getElementById("levelhtml");

let canvas2 = document.getElementById("canvas2");
canvas2.width = 800;
canvas2.height = 600;
let ctx2 = canvas2.getContext("2d");
ctx2.lineWidth = 1;


let selector = {};
const spawnpoint = {x:150,y:10}
let ineditor = false;



const keys = {};
let GAMEOBJECTS = [];
let KEYSCOLLECTED = [];
let level_x = 0;
let textFile = null;
let style = true;

const EDITOR = {
    name:"Edit ",
    spawn:{x:250,y:100},
    content:[
        {x:200,y:150,w:100,h:40},
    ]
}

let LEVELS = [
    {"content":[{"x":200,"y":150,"w":100,"h":40,"t":"lava","e":"none"},{"x":360,"y":230,"w":80,"h":50,"t":"platform","e":"none"},{"x":190,"y":290,"w":70,"h":60,"t":"platform","e":"none"},{"x":250,"y":440,"w":110,"h":50,"t":"platform","e":"none"},{"x":500,"y":360,"w":100,"h":90,"t":"platform","e":"none"},{"x":540,"y":180,"w":50,"h":60,"t":"platform","e":"none"},{"x":400,"y":460,"w":60,"h":30,"t":"platform","e":"none"},{"x":20,"y":550,"w":760,"h":40,"t":"platform","e":"none"},{"x":740,"y":20,"w":40,"h":470,"t":"platform","e":"none"}],"spawn":{"x":250,"y":100},"name":"test"}
    ,
    {"content":[{"x":290,"y":220,"w":230,"h":210,"t":"platform","e":"none"},{"x":510,"y":420,"w":20,"h":20,"t":"keydoor","e":null},{"x":280,"y":420,"w":20,"h":20,"t":"keydoor","e":null},{"x":280,"y":210,"w":20,"h":20,"t":"keydoor","e":null},{"x":510,"y":210,"w":20,"h":20,"t":"keydoor","e":null},{"x":50,"y":270,"w":110,"h":130,"t":"platform","e":null},{"x":150,"y":260,"w":20,"h":20,"t":"keydoor","e":null},{"x":40,"y":260,"w":20,"h":20,"t":"keydoor","e":null},{"x":40,"y":390,"w":20,"h":20,"t":"keydoor","e":null},{"x":150,"y":390,"w":20,"h":20,"t":"keydoor","e":null}],"spawn":{"x":250,"y":100},"name":"oof"}
    ,
    {"content":[{"x":570,"y":490,"w":20,"h":20,"t":"key","e":"upper key"},{"x":40,"y":400,"w":100,"h":20,"t":"platform","e":"upper key"},{"x":600,"y":290,"w":60,"h":30,"t":"platform","e":"goal door"},{"x":140,"y":570,"w":70,"h":30,"t":"platform","e":"none"},{"x":110,"y":520,"w":100,"h":50,"t":"platform","e":"none"},{"x":260,"y":470,"w":30,"h":70,"t":"platform","e":"none"},{"x":0,"y":150,"w":40,"h":450,"t":"platform","e":"none"},{"x":430,"y":340,"w":40,"h":200,"t":"keydoor","e":"upper key"},{"x":450,"y":520,"w":220,"h":50,"t":"platform","e":"upper key"},{"x":670,"y":460,"w":130,"h":140,"t":"platform","e":"none"},{"x":210,"y":520,"w":240,"h":70,"t":"platform","e":"none"},{"x":710,"y":240,"w":90,"h":30,"t":"platform","e":"final key"},{"x":430,"y":150,"w":40,"h":180,"t":"keydoor","e":"final key"},{"x":550,"y":150,"w":60,"h":30,"t":"platform","e":"final key"},{"x":0,"y":0,"w":40,"h":110,"t":"platform","e":"final key"},{"x":0,"y":110,"w":520,"h":40,"t":"platform","e":"final key"},{"x":520,"y":320,"w":140,"h":20,"t":"lava","e":"final key"},{"x":660,"y":270,"w":140,"h":20,"t":"lava","e":"final key"},{"x":660,"y":290,"w":20,"h":50,"t":"lava","e":"final key"},{"x":220,"y":320,"w":300,"h":20,"t":"platform","e":"upper key"}],"spawn":{"x":310,"y":280},"name":"a start and an end"}

    
]




// gameobject class

class gameobject{

    constructor(x,y,width,height,type = "platform",extra = "none"){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.extra = extra;
        this.setcolors();
        this.id=GAMEOBJECTS.length
        if(this.type === "moving_horizontal_platform" || this.type === "moving_vertical_platform" ){
            this.dir = 1;
            if(this.type === "moving_horizontal_platform"){this.x = this.extra[2];}else{this.y = this.extra[2]}
        }

    }

    update(i){
        this.id = i;
        if(this.type === "moving_horizontal_platform"){
            this.x += this.dir;
            if(this.x < this.extra[0]){this.dir *= -1; this.x = this.extra[0]}
            if(this.x > this.extra[1]){this.dir *= -1; this.x = this.extra[1]}
        }
        if(this.type === "moving_vertical_platform"){
            this.y += this.dir;
            if(this.y < this.extra[0]){this.dir *= -1; this.y = this.extra[0]}
            if(this.y > this.extra[1]){this.dir *= -1; this.y = this.extra[1]}
        }
    }

    render(){
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;


        ctx.beginPath();
        ctx.globalAlpha = this.opac;
        ctx.strokeStyle = this.strokecolor;
        ctx.fillStyle = this.fillcolor;
        ctx.shadowColor = this.shadowcolor;

        if(style){
            ctx.strokeRect(camera.x+this.x,camera.y+this.y,this.width,this.height);
            ctx.fillRect(camera.x+this.x,camera.y+this.y,this.width,this.height);

        }else{
            ctx.fillRect(camera.x+this.x,camera.y+this.y,this.width,this.height);
            ctx.strokeRect(camera.x+this.x,camera.y+this.y,this.width,this.height);
        }
        
        
        ctx.fill()
        ctx.stroke(); 
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;


    }

    collision(x1,y1,x2,y2){
        let colleft = (x1 > this.x && x1 < this.x+this.width);
        let colright =  (x2 > this.x && x2 < this.x+this.width);

        let coltop = (y1 > this.y && y1 < this.y+this.height);
        let colbottom = (y2 > this.y && y2 < this.y+this.height);

        
        let col = (colright || colleft) && (coltop || colbottom) 


        return {col,coltop,colbottom,colright,colleft};
    }

    setcolors(){
        if(this.type === "platform"){
            this.strokecolor = "black"
            this.fillcolor = "grey";
            this.shadowcolor = "black";
            this.opac = 1;
            ;
        }
        else if(this.type === "moving_horizontal_platform"){
            this.strokecolor = "black";
            this.fillcolor = "grey";
            this.shadowcolor = "black";
            this.opac = 1;
        } 
        else if(this.type === "moving_vertical_platform"){
            this.strokecolor = "black";
            this.fillcolor = "grey";
            this.shadowcolor = "black";
            this.opac = 1;
        } 
        else if(this.type === "lava"){
            this.strokecolor = "red";
            this.fillcolor = "red";
            this.shadowcolor = "red";
            this.opac = 1;
        }    
        else if(this.type === "bounce"){
            this.strokecolor = "#6ec971"
            this.fillcolor = "green";
            this.shadowcolor = "#6ec971";
            this.opac = 1;
        }
        else if(this.type === "water"){
            ctx.globalAlpha = 0.3;
            this.strokecolor = "white"
            this.fillcolor = "#6dccff";
            this.shadowcolor = "#6dccff";
            this.opac = 0.5;
        }
        else if(this.type === "key"){
            this.strokecolor = "#f0dc29"
            this.fillcolor = "#f0dc29";
            this.shadowcolor = "white";
            this.opac = 1;
        }
        else if(this.type === "keydoor"){
            this.strokecolor = "#6c4f38"
            this.fillcolor = "#6c4f38";
            this.shadowcolor = "black";
            this.opac = 1;
        }else{
            this.strokecolor = "white"
            this.fillcolor = "pink";
            this.shadowcolor = "pink";
            this.opac = 1;
        }
    }

}



// player class

class player{

    constructor(x,y,size){

        this.x = x;
        this.y = y;
        this.size = size;
        this.health = 100;
        this.xa = 0;
        this.ya = 0;
        this.dir = 0;
        this.dira = 0;
        this.speed = 0;
        this.speeda = 0;

    }

    update(){
    


        if(keys["w"] ){
            this.speed += 0.3;
        }
        if(keys["s"] ){
            this.speed -= 0.3;
        }
        if(keys["a"]){
            this.dira -= 0.02;
        }
        if(keys["d"]){
            this.dira += 0.02;
        }

        if(keys["r"] ){
            this.reset();
        }
        
        this.speed *= 0.9;
        this.dira *= 0.8;
        this.xa = Math.cos(this.dir)*this.speed;
        this.ya = Math.sin(this.dir)*this.speed;
        this.y += this.ya; 
        this.x += this.xa;
        this.dir += this.dira;
        

        //walls

        if( camera.x+this.x > (canvas.width-canvas.width/4)-this.size){camera.x -= Math.abs(this.xa);}
        if( camera.x+this.x < canvas.width/4){camera.x += Math.abs(this.xa);}

        if(camera.y+this.y > (canvas.height-canvas.height/4)-this.size){camera.y -= Math.abs(this.ya);}
        if(camera.y+this.y < canvas.height/4){camera.y += Math.abs(this.ya);}
        
        
        // gm collision 

        
        GAMEOBJECTS.forEach((v)=>{

            if(v.collision(this.x-this.size,this.y-this.size,this.x+this.size,this.y+this.size).col){
                this.x -= this.xa;
                if(v.collision(this.x-this.size,this.y-this.size,this.x+this.size,this.y+this.size).col){
                    this.x += this.xa;

                    this.y -= this.ya;
                if(v.collision(this.x-this.size,this.y-this.size,this.x+this.size,this.y+this.size).col){
                    this.y += this.ya;
                }else{
                    this.ya *= 0;
                }
                }else{ 
                    this.xa *= 0;
                }
            }

        })
        

    }

    render(){
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = "black";

        ctx.beginPath()
        ctx.fillStyle = "lightblue";
        ctx.arc(camera.x+this.x-this.size/100,camera.y+this.y-this.size/100, this.size, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.fill()
        ctx.stroke(); 
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.lineWidth = this.size/2;
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur = this.size;
        ctx.strokeStyle =  "black";
        ctx.moveTo(camera.x+this.x,camera.y+this.y);
        ctx.lineTo(camera.x+this.x +Math.cos(this.dir)*this.size,camera.y+ this.y + Math.sin(this.dir)*this.size);
        ctx.stroke();

        

    }

    reset(){

        if(ineditor){
        this.x = EDITOR.spawn.x;
        this.y = EDITOR.spawn.y;
        }else{
        this.x = LEVELS[level_x].spawn.x;
        this.y = LEVELS[level_x].spawn.y;
    }

        this.health = 100;
        this.xa = 0;
        this.ya = 0;

    }

}

const camera = {

x:0,
y:0,

}

function raycast(x,y,dir,amount){
    amount = Math.PI/amount;

    raycastsinfos.rays = [];

    for(let angle = dir-(Math.PI/4); angle<dir+(Math.PI/4);angle+= amount){
        new ray(x,y,angle,raycastsinfos.renderdistance);
    }
}

const raycastsinfos = {
    renderdistance : 620,
    rayamount: 600,
    rays:[],
}

class ray {

    constructor(x,y,dir,distance){
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.speed = 1;
    this.distance = distance;
    this.distancetrav = 0;
    this.objcol = null;
    this.shoot();

    }

    shoot(){

        // ctx.beginPath();
        // ctx.moveTo(camera.x+this.x,camera.y+this.y)

        for(let i = 0; i<this.distance; i++){
            this.x += Math.cos(this.dir)*this.speed;
            this.y += Math.sin(this.dir)*this.speed;
            this.distancetrav++;
            GAMEOBJECTS.forEach((v)=>{
                if(v.collision(this.x,this.y,this.x,this.y).col){
                    this.objcol = v;
                }
            })
            if (this.objcol !== null){
                break;
            }
            
        }
        
        raycastsinfos.rays.push({distance:this.distancetrav,obj:this.objcol});
        // ctx.lineTo(camera.x+this.x,camera.y+this.y)
        // ctx.stroke();
    }



}

function drawraycasts(){

    let curobj = null;
    
    raycastsinfos.rays.forEach((v,i)=>{
        
        // if(v.obj !== null && v.obj.id === curobj){
        //     ctx2.lineTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)-((raycastsinfos.renderdistance-v.distance)/2));
        //     console.log("continue obj");

        // }
        // else if(v.obj !== null && curobj === null){
        //     ctx2.beginPath();
        //     ctx2.moveTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)+((raycastsinfos.renderdistance-v.distance)/2));
        //     ctx2.lineTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)-((raycastsinfos.renderdistance-v.distance)/2));
        //     curobj = v.obj.id;
        //     ctx2.fillStyle = v.obj.fillcolor;
        //     console.log("begin after null");
        // }
        // else if(v.obj === null && curobj !== null){
        //     ctx2.lineTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)+((raycastsinfos.renderdistance-v.distance)/2));
        //     ctx2.fill();
        //     ctx2.stroke();
        //     curobj = null;
        //     console.log("end after obj now null");

        // }
        // else if(v.obj === null && curobj === null){
        //     curobj = null;
        //     console.log("continue null");

        // }
        // else if(v.obj !== null && v.obj.id  !== curobj){
        //     ctx2.fill();
        //     ctx2.stroke();
        //     ctx2.fillStyle = v.obj.fillcolor;
        //     ctx2.beginPath();
        //     ctx2.moveTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)+((raycastsinfos.renderdistance-v.distance)/2));
        //     ctx2.lineTo(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)-((raycastsinfos.renderdistance-v.distance)/2));

        //     curobj = v.obj.id;
        //     console.log("end after obj now obj");


        // }else{
        //     console.log("huh?");

        // }
        

        if(v.obj !== null){
            ctx2.fillStyle = v.obj.fillcolor;
            // ctx2.strokeRect(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)-((raycastsinfos.renderdistance-v.distance)/2),1,raycastsinfos.renderdistance-v.distance);
            ctx2.fillRect(i*(canvas2.width/raycastsinfos.rayamount)*2,(canvas2.height/2)-((raycastsinfos.renderdistance-v.distance)/2),2.5,raycastsinfos.renderdistance-v.distance);
        }

    })




    
    
}
 







// make players

const player1 = new player(LEVELS[level_x].spawn.x,LEVELS[level_x].spawn.y,9)

//  build level 

buildcurrentlevel();
levelhtml.value = LEVELS[level_x].name;


// game loop 

window.requestAnimationFrame(main); 

let lastRenderTime = 0;
let GameSpeed = 60;
let lastGameSpeed = 60

function main(currentTime){
    window.requestAnimationFrame(main);
    const sslr = (currentTime- lastRenderTime)/1000
    if (sslr < 1 / GameSpeed) {return}
    lastRenderTime = currentTime;  
    render();
    update();
}



function update(){

raycast(player1.x,player1.y,player1.dir,raycastsinfos.rayamount,)

player1.update();
GAMEOBJECTS.forEach((v,i)=>{v.update(i);})

if(keys["Escape"]){
    selector.w = 0;
    selector.h = 0;
    removeEventListener("mousemove", mousemove);
    removeEventListener("mouseup", mouseup);
}

}

function render(){

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx2.clearRect(0,0,canvas2.width,canvas2.height);
player1.render();
GAMEOBJECTS.forEach(v=>{v.render();})
ctx.strokeStyle = "black";

ctx.strokeRect(selector.x,selector.y,selector.w,selector.h)
drawraycasts();


if(ineditor){
    ctx.strokeStyle = "green";
    ctx.strokeText("Spawn",spawnpoint.x,spawnpoint.y+10);
}

}

// make gm

function makegm(x,y,w,h,type,extra){
    const newgm = new gameobject(x,y,w,h,type,extra);
    GAMEOBJECTS.push(newgm);
}

function buildcurrentlevel(hardreset = false){
    if(ineditor && hardreset === false){buildeditorlevel();}{
    GAMEOBJECTS = []
    spawnpoint.x = LEVELS[level_x].spawn.x;
    spawnpoint.y = LEVELS[level_x].spawn.y;
    LEVELS[level_x].content.forEach(v=>{
        makegm(v.x,v.y,v.w,v.h,v.t,v.e);
    })}

}

function buildeditorlevel(){
    spawnpoint.x = EDITOR.spawn.x;
    spawnpoint.y = EDITOR.spawn.y;
    EDITOR.content.forEach(v=>{
        makegm(v.x,v.y,v.w,v.h,v.t,v.e);
    })
}



function nextlevel(x=1){
    
    if(!ineditor){
    level_x += x;
    GAMEOBJECTS = [];
    
    if (level_x > LEVELS.length-1){level_x = 0; }
    if (level_x < 0){level_x = LEVELS.length-1; }

    LEVELS[level_x].spawn.x = player1.x; 
    LEVELS[level_x].spawn.y = player1.y; 
    levelhtml.value = LEVELS[level_x].name;
    buildcurrentlevel();
    }
}

function savelevel(){
    const savedcontent = [];
    const savedlevel = {};
    GAMEOBJECTS.forEach(v=>{
        const savedgm = {}
        savedgm.x = v.x;
        savedgm.y = v.y;
        savedgm.w = v.width;
        savedgm.h = v.height;
        savedgm.t = v.type;
        savedgm.e = v.extra;
        savedcontent.push(savedgm);
    })
    savedlevel.content = savedcontent;
    savedlevel.spawn = spawnpoint;
    savedlevel.name = prompt("Level Name");
    alert(JSON.stringify(savedlevel))

}

function loadlevel(towherex = level_x){
    if (towherex === LEVELS.length){LEVELS.push(new Object())}
    let loadedlevel = prompt("Enter Level Code !");
    GAMEOBJECTS = [];
    loadedlevel = JSON.parse(loadedlevel);

    if(!ineditor){
        LEVELS[towherex].content = loadedlevel.content;
        LEVELS[towherex].name = loadedlevel.name;
        LEVELS[towherex].spawn = loadedlevel.spawn;
        buildcurrentlevel();
    }else{
        EDITOR.content = loadedlevel.content;
        EDITOR.name = loadedlevel.name;
        EDITOR.spawn = loadedlevel.spawn;
        buildeditorlevel();
    }
    
    spawnpoint.x = loadedlevel.spawn.x;
    spawnpoint.y = loadedlevel.spawn.y;
    player1.reset();
}

function hardreset(){
    document.getElementById("editorbuttons").style.display = "none";
    removeEventListener("click", clicking);
    selector = {}
    GAMEOBJECTS = [];
    level_x = 0;
    player1.reset();
    buildcurrentlevel(true);
    ineditor = false;

}

//distance

function distance(x1,x2,y1,y2){

return Math.sqrt(((x2-x1)**2)+((y2-y1)**2));

}


function randomrange(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


// toggle menus n things

function togglePause(){
    document.getElementById("settingsmenu").style.display = "none";
    if(GameSpeed === 0){
        pausemenu.style.display = "none";
        canvas.style.filter = "none"
        GameSpeed = lastGameSpeed; 


    }else{
        pausemenu.style.display = "flex";
        canvas.style.filter = "blur(10px)";
        GameSpeed = 0; 
    }

}

function togglestyle(){

    if(style){
        style = false
    }else{
        style = true}

}

// file gen save map

function savemap(){

    let download = document.getElementById("DownloadMap");
    download.href = createFile(JSON.stringify(LEVELS));
    download.style.display = "block";

}

function createFile(levelstxt) {
    let data = new Blob([levelstxt], {type: 'text/plain'});
    
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

// load map

function loadmap(){
    let loadedmap = document.getElementById("loadmap").files[0];
    
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        LEVELS = JSON.parse(event.target.result);
        hardreset();
    });
    reader.readAsText(loadedmap);
    
}

//clear map

function clearmap(){

LEVELS = [[]]

}


// change input 

function changeinput(self){
    selector.t = self.value;

    if(selector.t === "key"){selector.e = prompt("Enter Key Name !")}
    if(selector.t === "keydoor"){selector.e = prompt("Enter Key Name !")}
    if(selector.t === "moving_horizontal_platform" || selector.t === "moving_vertical_platform"){
        let boundaries = prompt("Enter Boundaries (Two Numbers seperated by a comma) \n and a starting position (also seperated from the others by a comma)").split(",");
        selector.e = [];
        boundaries[0] = Number(boundaries[0]);
        boundaries[1] = Number(boundaries[1]);
        boundaries[2] = Number(boundaries[2]);
        selector.e[0] = boundaries[0]; 
        selector.e[1] = boundaries[1]; 
        selector.e[2] = boundaries[2]; 

    }

}

function toggleMenu(id){

    let keybind = document.getElementById(id);
    if(keybind.style.display==="flex"){
        keybind.style.display = "none";
    }else{
        keybind.style.display = "flex";

    }
}

addEventListener("keydown", e => {
    // console.log(e.key);
    keys[e.key] = true;
});

addEventListener("keyup", e => {
    keys[e.key] = false;
});

addEventListener("keypress",e=>{
    switch(e.key){
        case "p":
            togglePause();
            break;
    }

})

function starteditor(){
    
    ineditor = true;
    GAMEOBJECTS = [];
    buildeditorlevel();
    selector.t = "platform";
    document.getElementById("editorbuttons").style.display = "flex";
    document.getElementById("DownloadMap").style.display = "none";


    setTimeout(()=>{
        addEventListener("mousedown", clicking); 
    },100)
    


}

function clicking(e){
        
    let rect = canvas.getBoundingClientRect();
    let mouseX = Math.floor((e.clientX- rect.left) /10 )*10;
    let mouseY = Math.floor((e.clientY- rect.top) /10 )*10;
    if(mouseX>=0 && mouseX<canvas.width && mouseY>=0&&mouseY<canvas.height){

        if (selector.t === "delete"){

            GAMEOBJECTS.forEach((v,i)=>{
            let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
            if(collision.col){
                GAMEOBJECTS.splice(i,1);
            }
            
            })

        }else if(selector.t === "nove_to_top"){

            GAMEOBJECTS.forEach((v,i)=>{
                let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
                if(collision.col){
                    makegm(v.x,v.y,v.width,v.height,v.type,v.extra);
                    GAMEOBJECTS.splice(i,1)}
                }) 

        
        }else if(selector.t === "anti_clipping_b"){

            GAMEOBJECTS.forEach((v,i)=>{
                let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
                if(collision.col){
                    v.height += 10;
                }
                }) 

        
        }else if(selector.t === "spawnpoint"){
            spawnpoint.x = mouseX;
            spawnpoint.y = mouseY;
            
            EDITOR.spawn.x = spawnpoint.x ;
            EDITOR.spawn.y = spawnpoint.y ;   

        }
        else{
        addEventListener("mousemove", mousemove); 
        addEventListener("mouseup", mouseup); 

        selector.x1 = mouseX;
        selector.y1 = mouseY;
        selector.x = selector.x1;
        selector.y = selector.y1;
        selector.w = 20;
        selector.h = 20;

        }
    }

}  

function mousemove(e){
    let rect = canvas.getBoundingClientRect();
    let mouseX = Math.floor((e.clientX- rect.left) /10 )*10;
    let mouseY = Math.floor((e.clientY- rect.top) /10 )*10;

    selector.x2 = mouseX;
    selector.y2 = mouseY;
    if(selector.x1 < selector.x2){
        selector.x = selector.x1; selector.w = selector.x2-selector.x1+10;  }
    else if(selector.x1 === selector.x2){
        selector.x = selector.x1; selector.w = 20; 
    }
    else{ 
        selector.x = selector.x2; selector.w = selector.x1-selector.x2+10;   
    }

    if(selector.y1 < selector.y2){
        selector.y = selector.y1; selector.h = selector.y2-selector.y1+10;}
    else if(selector.y1 === selector.y2){
        selector.y = selector.y1; selector.h = 20; 
    }else{
        selector.y = selector.y2; selector.h = selector.y1-selector.y2+10;
        }
}

function mouseup(){

    makegm(selector.x,selector.y,selector.w,selector.h,selector.t,selector.e)
    let typet = selector.t;
    let extrat = selector.e;
    selector = {};
    selector.t = typet;
    selector.e = extrat;
    removeEventListener("mousemove", mousemove);
    removeEventListener("mouseup", mouseup);

}