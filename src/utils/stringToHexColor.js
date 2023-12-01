export default function stringToHexColor(text) {
	let hash = 0;
	
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash);
	}
	
	let color = '#';
	
	for (let j = 0; j < 3; j++) {
		const value = (hash >> (j * 8)) & 0xFF;
		color += ('00' + value.toString(16)).substr(-2);
	}
	return color;
}
