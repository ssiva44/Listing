import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'mediaIcon' }) 
export class MediaIconPipe implements PipeTransform {	
	transform(value: any): string {
		let fontClass = '';
		let type = '';
		
		if (typeof value === 'string') {			
			type = value;
		} else {			
			for (let key in value) {				
				for (let key2 in value[key]) {
					type = value[key][key2];
				}
			}
		}

		if (type == 'Video') 
			fontClass = 'fa fa-play';
		else if (type == 'Audio')  
			fontClass = 'fa fa-cloud';
		else if (type == 'Slideshow')
			fontClass = 'fa fa-camera';
		else
			fontClass = 'hide';
		
		return fontClass;	
	} 
}