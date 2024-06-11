var c = document.getElementById("main_canvas");
var ctx = c.getContext("2d");
setInterval(drawLoop, 1000/60);

function fill_background(){
	ctx.globalCompositeOperation = 'source-over';

	c.style = "background-color:"+accent_color;
}

const d = new Date();
var last_time = d.getSeconds() + d.getMilliseconds()/1000;
var cur_time = last_time;
var rotation = 0;
const rpm = 33.33; //33.33 45 78
var playback_speed = 1;
function calculate_rotation(){
	const d = new Date();
	cur_time = d.getSeconds() + d.getMilliseconds()/1000;

	let delta_time = (cur_time - last_time) % 60;
	if(delta_time < 0){
		delta_time += 60;
	}

	rotation = rotation += playback_speed * 360 * (delta_time/60) * rpm;
}

var album_art = new Image();
album_art.src = "image_temp.png";
var accent_color = '#B0f0B0';

const record_mask = new Image();
record_mask.src = "record_mask.png";
const record_base = new Image();
record_base.src = "record_base.png";
function draw_record(){
	ctx.setTransform(1, 0, 0, 1, 450, 450);
	ctx.rotate(rotation * (Math.PI / 180));
	ctx.drawImage(record_mask, -450, -450, 900, 900);
	ctx.globalCompositeOperation = 'source-in';
	ctx.drawImage(album_art, -220/2, -220/2, 220, 220);

	ctx.globalCompositeOperation = 'source-over';
	ctx.drawImage(record_base, -636/2,-636/2, 636,636);

	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

const tone_arm = new Image();
tone_arm.src = "tone_arm.png";
function draw_tone_arm(){
	let track_percentage = cur_time/60;
	let tone_arm_angle = (39.5 - 23) * track_percentage + 23; //23 - 39.5

	if(playback_speed == 0){
		tone_arm_angle = 0;
	}

	ctx.globalCompositeOperation = 'source-over';
	ctx.setTransform(1, 0, 0, 1, 893, 127);
	ctx.rotate(tone_arm_angle * (Math.PI / 180));
	ctx.drawImage(tone_arm,783-893,-71-127, 240,900);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawLoop(){
	fill_background();
	calculate_rotation();
	draw_record();
	draw_tone_arm();

	last_time = cur_time;
}