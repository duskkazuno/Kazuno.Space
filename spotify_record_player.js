var access_token = "";
var main_canvas;
var ctx;

check_auth();

function check_auth(){
	if(window.location.hash) {
		var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character

		var hash_values = hash.split("&");

		for(let i=0;i<hash_values.length;i++){
			if(hash_values[i].startsWith("access_token=")){
				access_token = hash_values[i].substring(13);

				main_canvas = document.createElement("canvas");
				main_canvas.width = window.innerWidth;
				main_canvas.height = window.innerHeight;
				ctx = main_canvas.getContext("2d");
				setInterval(drawLoop, 1000/60);

				document.getElementById("main_canvas_container").appendChild(main_canvas);

				get_current_track();
			}
		}
	} else {
		var auth_button = document.createElement("button"); 
		auth_button.onclick = auth;
		auth_button.innerHTML = "Log in"

		document.getElementById("auth_button_container").appendChild(auth_button);
	}
}

function auth(){
	var client_id = '46b65a997cb042b093496ef048d068ba';
	var redirect_uri = 'http://duskkazuno.github.io/Kazuno.Space/spotify_record_player.html';

	var scope = 'user-read-currently-playing';

	var url = 'http://accounts.spotify.com/authorize';
	url += '?response_type=token';
	url += '&client_id=' + encodeURIComponent(client_id);
	url += '&scope=' + encodeURIComponent(scope);
	url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
	//url += '&state=' + encodeURIComponent(state);
	url += "&show_dialog=true"

	window.location = url;
}

function get_current_track(){
	fetch("https://api.spotify.com/v1/me/player/currently-playing",
	{
		method: "GET",
		headers: {
			Authorization: 'Bearer ${access_token}'
		}
	})
        .then(response => {
            // Check if the response is successful (status 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse response body as JSON
            return response.json();
        })
        .then(data => {
            // Data is the parsed JSON response
            console.log(data);


            // You can do further processing with the data here
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

const base_size = 900;
var scale_factor = 1/base_size * Math.min(main_canvas.width,main_canvas.height)

function fill_background(){
	ctx.globalCompositeOperation = 'source-over';

	main_canvas.style = "background-color:"+accent_color;
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
	ctx.setTransform(1, 0, 0, 1, main_canvas.width/2, main_canvas.height/2);
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
	if(main_canvas){
		fill_background();
		calculate_rotation();
		draw_record();
		draw_tone_arm();

		last_time = cur_time;
	}	
}