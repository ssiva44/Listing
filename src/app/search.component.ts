import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({  
	selector: 'search', 	
	templateUrl: './search.component.html',
	providers: []
})

export class SearchComponent {
	@Input() queryParameter: string;
	@Input() searchIn: string;
	@Input() apiLanguage: string;	
	@Output() outParameters = new EventEmitter<string>();
	
	searchValue:string = '';	
	placeholder: string;
	
	ngOnChanges() {		  		
		if(this.queryParameter === undefined) {		
			this.placeholder = this.getPlaceholder();	
		} else {
			if (this.queryParameter.split('=')[1] == '') {
				this.placeholder = this.getPlaceholder();
			} else {
				this.placeholder = this.queryParameter.split('=')[1];				
			}
		}		           
    }

	public onSearch() {					
		this.placeholder = this.searchValue == '' ? this.getPlaceholder() : this.searchValue;		
		this.outParameters.emit('qterm=' + this.searchValue);
		this.searchValue = '';					
    };

    public getPlaceholder() {
    	let placeholder = '';
    	if (this.apiLanguage === undefined) {
			placeholder = '';
		} else {
			if (this.apiLanguage.split('=')[1] == 'en') {
				if (this.searchIn == 'news' || this.searchIn == 'results') {
					placeholder = 'Search News & Views';
				} else if (this.searchIn == 'multimedia') {
					placeholder = 'Search Multimedia';
				} else if (this.searchIn == 'all_events') {
					placeholder = 'Search Events';
				} else if (this.searchIn == 'all_experts') {
					placeholder = 'Search People';
				} else {
					placeholder = '';	
				}
			} else {
				placeholder = '';
			}
		}
		return placeholder;
    }       
}
