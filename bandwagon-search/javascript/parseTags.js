function parseTags(value) {

	var inTag = false
	var tags = []
	var remainder = ""
	var foundTag = ""

	for (var index = 0 ; index < value.length; index++) {
		var char= value[index]

		// This is the beginning of a tag..
		if (char == "#") {
			inTag = true
			foundTag = ""
			continue
		}

		// We're not in a tag, so just add the character to the remainder
		if (inTag == false) {
			remainder += char
			continue
		}

		// This is the end of a tag
		switch (char) {

			case " ":
				tags.push(foundTag)
				inTag = false
				break

			case ",":
			case ".":
			case "?":
			case ":":
			case ";":
				remainder += char
				tags.push(foundTag)
				inTag = false
				break

			// Otherwise, add the character to the current tag
			default:
				foundTag += char

		}
	}

	// Also add tags that extend to the end of the input
	if (inTag) {
		tags.push(foundTag)
	}

	return {
		tags: tags,
		remainder: remainder
	}
}

function lastWord(value) {
	var words = value.split(" ")
	return words[words.length - 1]
}