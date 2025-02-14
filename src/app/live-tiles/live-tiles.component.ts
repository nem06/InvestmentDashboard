import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-tiles',
  imports: [ CommonModule ],
  templateUrl: './live-tiles.component.html',
  styleUrl: './live-tiles.component.css'
})


export class LiveTilesComponent {
  livedata:any;

  constructor(private sharedService: SharedService, private router:Router){}
  
  ngOnInit(): void {
    this.sharedService.LiveDataObject$.subscribe(
      (liveData:any) => {
      this.livedata = liveData; 
    });
  }

  navigateHome(){
    this.router.navigate(['/dashboard']);
  }
}
