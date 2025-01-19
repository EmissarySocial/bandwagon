var playlist
var playlistIndex = -1

// Play loads and plays the song at the current playlistIndex
function Play() {

	console.log("play")
	console.log(playlist)
	console.log("index", playlistIndex)

	if (playlistIndex < 0) {
		return
	}

	if (playlistIndex >= playlist.length) {
		return
	}

	console.log("continue...")

	var audio = htmx.find("audio")
	var controls = htmx.find("#media-controls")
	var song = playlist[playlistIndex]

	// htmx.find("#source-aac").src = song.url + ".aac?bitrate=128"
	htmx.find("#source-mp3").src = song.url + ".mp3?bitrate=128&v=2"
	htmx.find("#source-ogg").src = song.url + ".ogg?bitrate=128&v=2"

	audio.load()
	console.log("loaded")
	audio.volume = 0.8
	audio.play()
	console.log("playing")

	htmx.addClass(controls, "PLAYING")
	htmx.takeClass(htmx.find("#track-" + playlistIndex), "PLAYING")
}

// Pause pauses the audio control
function Pause() {
	console.log("pause")
	var controls = htmx.find("#media-controls")
	var audio = htmx.find("audio")
	var track = htmx.find("#track-" + playlistIndex)

	audio.pause()
	htmx.removeClass(controls, "PLAYING")
	htmx.removeClass(track, "PLAYING")
}

// PlayFirst jumps to the first song in the playlist and plays it
function PlayFirst() {
	console.log("playFirst")
	if (playlist.length > 0) {
		playlistIndex = 0
		Play()
	}
}

// PlayPrevious plays the previous song in the playlist and plays it
function PlayPrevious() {
	console.log("playPrevious")
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
	console.log("playNext")

	if (playlist.length > 0 ) {
		playlistIndex++
		if (playlistIndex >= playlist.length) {
			playlistIndex = 0
		}
		Play()
	}
}

function Toggle(trackNumber) {

	console.log("toggle")
	console.log(trackNumber)

	var audio = htmx.find("audio")

	// Do not overflow the playlist.
	if (trackNumber >= playlist.length)  {
		return
	}

	// If the audio is already paused, or is playing a different track, then play this track
	if ((audio.paused) || (playlistIndex != trackNumber)) {
		playlistIndex = trackNumber
		Play()
	} else {
		Pause()
	}
}
