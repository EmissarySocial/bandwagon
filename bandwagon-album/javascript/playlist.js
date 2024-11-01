var playlist
var playlistIndex = -1

// Play loads and plays the song at the current playlistIndex
function Play() {

	if (playlistIndex < 0) {
		console.log("Underflow")
		return
	}

	if (playlistIndex >= playlist.length) {
		console.log("Overflow")
		return
	}

	var audio = htmx.find("audio")
	var controls = htmx.find("#media-controls")
	var song = playlist[playlistIndex]

	htmx.find("#source-mp3").src = song.url + ".mp3?bitrate=128"
	htmx.find("#source-aac").src = song.url + ".m4a?bitrate=128"

	audio.load()
	audio.volume = 0.8
	audio.play()

	htmx.addClass(controls, "PLAYING")
	htmx.takeClass(htmx.find("#track-" + playlistIndex), "PLAYING")
}

// PlayFirst jumps to the first song in the playlist and plays it
function PlayFirst() {
	if (playlist.length > 0) {
		playlistIndex = 0
		Play()
	}
}

// PlayPrevious plays the previous song in the playlist and plays it
function PlayPrevious() {
	if (playlist.length > 0) {
		playlistIndex--
		if (playlistIndex < 0) {
			playlistIndex = playlist.length - 1
		}
		Play()
	}
}

// PlayNext plays the next song in the playlist and plays it
function PlayNext() {
	if (playlist.length > 0 ) {
		playlistIndex++
		if (playlistIndex >= playlist.length) {
			playlistIndex = 0
		}
		Play()
	}
}

function Toggle(trackNumber) {

	var audio = htmx.find("audio")

	for (var index = 0 ; index < playlist.length ; index++) {
		if (playlist[index].index == trackNumber) {
			// If the audio is already paused, or is playing a different track, then play this track
			if ((audio.paused) || (playlistIndex != index)) {
				playlistIndex = index
				Play()
			} else {
				Pause()
			}
			return
		}
	}
}


// Pause pauses the audio control
function Pause() {
	var controls = htmx.find("#media-controls")
	var audio = htmx.find("audio")
	var track = htmx.find("#track-" + playlistIndex)

	audio.pause()
	htmx.removeClass(controls, "PLAYING")
	htmx.removeClass(track, "PLAYING")
}

