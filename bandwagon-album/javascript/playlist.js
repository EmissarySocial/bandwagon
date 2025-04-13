var playlist
var playlistIndex = -1

// Play loads and plays the song at the current playlistIndex
function Play() {

	if (playlistIndex < 0) {
		return
	}

	if (playlistIndex >= playlist.length) {
		return
	}

	var audio = htmx.find("audio")
	var controls = htmx.find("#media-controls")
	var song = playlist[playlistIndex]

	htmx.find("#source-mp3").src = song.url + ".mp3?bitrate=128&v=2"
	htmx.find("#source-ogg").src = song.url + ".opus?bitrate=128&v=2"

	audio.load()
	audio.play()

	htmx.addClass(controls, "PLAYING")
	htmx.takeClass(htmx.find("#track-" + playlistIndex), "PLAYING")
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
function PlayNext(loop) {
	if (playlist.length > 0 ) {
		playlistIndex++
		if (playlistIndex >= playlist.length) {

			if (loop == true) {
				playlistIndex = 0
			} else {
				return
			}
		}
		Play()
	}
}

function Toggle(trackNumber) {

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
