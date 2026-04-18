import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../services/map/map.service';
import MapEvent from 'ol/MapEvent';
import View from 'ol/View';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private mapService = inject(MapService);

  constructor() {}

  ngAfterViewInit(): void {
    // 🔗 Attach existing map to the DOM
    this.mapService.setTarget(this.mapContainer.nativeElement);
  }

  ngOnDestroy(): void {
    // 🧹 Detach map when component is destroyed
    this.mapService.clearTarget();
  }

}
