import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetContains', pure: false }) 
export class FacetContainsPipe implements PipeTransform { 
	transform(value: any, facetItems: any, facetName: any, term: any, limitFacets: any, index: number): any {		
		let objects = [];		
		let i = 0;
				
		value.sort((a, b) => a.label.localeCompare(b.label)); 
		
		if(term !== undefined) {		
			let filteredValue = (value || []).filter((item) => item.hasOwnProperty('name') && new RegExp(term, 'gi').test(item['name']));

			if(facetItems.hasOwnProperty(facetName)) {	
				if (facetItems[facetName].trim() == '') {
					Object.keys(filteredValue).forEach( key => {
						if (limitFacets.indexOf(index) > -1) {						
							objects.push(filteredValue[key]);
						} else {						
							if (i < 6) {
								objects.push(filteredValue[key]);	
							}			
							i++;
						}								
					});
				} else {
					Object.keys(filteredValue).forEach( key => {					
						if(facetItems[facetName].trim() == filteredValue[key].name.trim()) {								
							objects.push(filteredValue[key]);
						} 								
					});
				}				
			} else {			
				Object.keys(filteredValue).forEach( key => {								
					if (limitFacets.indexOf(index) > -1) {						
						objects.push(filteredValue[key]);
					} else {						
						if (i < 6) {
							objects.push(filteredValue[key]);	
						}			
						i++;
					}
				});
			}								
		} else {		
			if(facetItems.hasOwnProperty(facetName)) {				
				if (facetItems[facetName].trim() == '') {
					Object.keys(value).forEach( key => {
						if (limitFacets.indexOf(index) > -1) {						
							objects.push(value[key]);
						} else {						
							if (i < 6) {
								objects.push(value[key]);	
							}			
							i++;
						}								
					});
				} else {
					Object.keys(value).forEach( key => {					
						if(facetItems[facetName].trim() == value[key].name.trim()) {								
							objects.push(value[key]);
						} 								
					});
				}								
			} else {			
				Object.keys(value).forEach( key => {
					if (limitFacets.indexOf(index) > -1) {						
						objects.push(value[key]);
					} else {						
						if (i < 6) {
							objects.push(value[key]);	
						}			
						i++;
					}								
				});
			}
		}
						
		return objects;
	} 
}