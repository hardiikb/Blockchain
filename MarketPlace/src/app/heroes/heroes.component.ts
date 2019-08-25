import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
	
  hero = "hardik's";
  heroes = ["abhi", "hardik", "zalak", "ruto"];
  constructor(private heroService : HeroService) { }

  ngOnInit() {
  	this.heroes = this.heroService.getExtra();
  }
  onSelect(hero){
  	this.hero = hero;
  }

  displayHeroes(){
  	console.log("hello");
  	this.heroService.getHeroes().subscribe(heroes => console.log(heroes));
  }

  addHeroes(hero){
    this.heroService.postHeroes(hero).subscribe(heroes => console.log(heroes));
  }

}
