import { Component } from '@angular/core';
import { SearchContainer } from '../components/search-container/search-container';

@Component({
  selector: 'app-home',
  imports: [SearchContainer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
