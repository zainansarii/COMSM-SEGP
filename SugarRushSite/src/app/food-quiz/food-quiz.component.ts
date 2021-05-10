import { Component, OnInit } from '@angular/core';
//import { DataService } from '../data.service';
import { FoodItemService, IFoodItem } from '../fooditem.service';
import { ActivatedRoute } from '@angular/router';
import { HobbitService } from '../hobbit.service';

// TODO: Move to a different file? Some sort of constants file?
export enum MealTitle {
  BREAKFAST = 'Breakfast',
  SECOND_BREAKFAST = 'Second Breakfast',
  ELEVENSES = 'Elevenses',
  LUNCHEON = 'Luncheon',
  AFTERNOON_TEA = 'Afternoon Tea',
  DINNER = 'Dinner',
  SUPPER = 'Supper',
}

@Component({
   selector: 'app-food-quiz',
   templateUrl: './food-quiz.component.html',
   styleUrls: ['./food-quiz.component.css'],
})
export class FoodQuizComponent implements OnInit {

   public cond_vall: boolean = false;
   public totalSugar: number = 0;
   public answers: any = [];
   currentMeal: number = 0;

   public meals = [
      {name: MealTitle.BREAKFAST, foodChoices: [0, 1, 2]},
      {name: MealTitle.SECOND_BREAKFAST, foodChoices: [3, 4, 5]},
      {name: MealTitle.ELEVENSES, foodChoices: []},
      {name: MealTitle.LUNCHEON, foodChoices: []},
      {name: MealTitle.AFTERNOON_TEA, foodChoices: []},
      {name: MealTitle.DINNER, foodChoices: []},
      {name: MealTitle.SUPPER, foodChoices: []}
   ];
   public foodItems: IFoodItem[];
   public currentFoodChoices: any = [];

   constructor(private foodItemService: FoodItemService, private hobbitService: HobbitService, private route: ActivatedRoute) { }

   ngOnInit() {
      this.getFoodItems();
      this.hobbitService.clearAnswers();
   }

  populateFoodChoices() {
      this.currentFoodChoices.length = 0;
      for (let food of this.foodItems) {
          //var food = this.foodItems[i];
          if (food.meals.includes(this.currentMeal)) {
              this.currentFoodChoices.push(food);
          }
      }
      if(this.currentMeal == 6){
        this.cond_vall = true;
      }
  }

  getFoodItems() {
      this.foodItemService
        .get()
        .subscribe((foodItems: IFoodItem[]) => {
            this.foodItems = foodItems;
            this.populateFoodChoices();
      });
      console.error(this.foodItems);
      console.error(this.currentFoodChoices);
  }

  selectAnswer(selectedFood: any) {
      this.answers.push(selectedFood);
      this.hobbitService.addToAnswers(selectedFood);
      this.totalSugar = this.totalSugar + selectedFood.sugarAmount;
  }

  answerIsCorrect(selectedSugarContent: number): boolean{
    let minSugarContent: number = Math.min(this.currentFoodChoices[0].sugarAmount,
        this.currentFoodChoices[1].sugarAmount,
        this.currentFoodChoices[2].sugarAmount);
    if(selectedSugarContent == minSugarContent){
      return true;
    }
    return false;
  }

  belowMaxSugar(): boolean{
    this.hobbitService.setTotalSugar(this.totalSugar);
    if(this.totalSugar < 100){
      this.hobbitService.setGameWin(true);
      return true;
    }
    this.hobbitService.setGameWin(false);
    return false;
  }

  nextMeal() {
    if (this.currentMeal < 7) {
        this.currentMeal = this.currentMeal + 1;
        this.populateFoodChoices();
    }
  }
}
