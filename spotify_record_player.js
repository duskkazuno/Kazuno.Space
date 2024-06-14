var c = document.getElementById("main_canvas");
var ctx = c.getContext("2d");
setInterval(drawLoop, 1000/60);
c.width = window.innerWidth;
c.height = window.innerHeight;

const base_size = 900;
var scale_factor = 1/base_size * Math.min(c.width,c.height)

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
var accent_color = '#B0F0B0';

const record_mask = new Image();
record_mask.src = "record_mask.png";
const record_base = new Image();
record_base.src = "record_base.png";
function draw_record(){
	ctx.setTransform(1, 0, 0, 1, c.width/2, c.height/2);
	ctx.rotate(rotation * (Math.PI / 180));
	ctx.drawImage(record_mask, -record_mask.width * scale_factor/2, -record_mask.width * scale_factor/2, record_mask.height * scale_factor, record_mask.height * scale_factor);
	ctx.globalCompositeOperation = 'source-in';
	ctx.drawImage(album_art, -220 * scale_factor/2, -220 * scale_factor/2, 220*scale_factor, 220*scale_factor);

	ctx.globalCompositeOperation = 'source-over';
	ctx.drawImage(record_base, -record_base.width * scale_factor/2, -record_base.width * scale_factor/2, record_base.width*scale_factor,record_base.height*scale_factor);

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

	tone_arm_angle = 23

	ctx.globalCompositeOperation = 'source-over';
	ctx.setTransform(1, 0, 0, 1, 893*scale_factor, 127*scale_factor);
	ctx.rotate(tone_arm_angle * (Math.PI / 180));
	ctx.drawImage(tone_arm,(783-893)*scale_factor,(-71-127)*scale_factor, 240*scale_factor,900*scale_factor);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawLoop(){
	fill_background();
	calculate_rotation();
	draw_record();
	draw_tone_arm();

	last_time = cur_time;
}