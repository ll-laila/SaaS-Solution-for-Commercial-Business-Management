import {Component, inject} from '@angular/core';
import {LivraisonService} from "../../../../../controller/services/inventaire/livraison/livraison.service";
import {Livraison} from "../../../../../controller/entities/inventaire/livraison/livraison";
import {Router} from "@angular/router";

@Component({
  selector: 'app-livraison-pdf',
  standalone: true,
  imports: [],
  templateUrl: './livraison-pdf.component.html',
  styleUrl: './livraison-pdf.component.scss'
})
export class LivraisonPdfComponent {
  private livraisonService = inject(LivraisonService)
  private router = inject(Router)

  public set items(value:Livraison[]) {
    this.livraisonService.items = value;
  }

  public get item(): Livraison {
    return this.livraisonService.item;
  }

  public set item(value: Livraison ) {
    this.livraisonService.item = value;
  }
  ngOnInit() {
    this.livraisonService.findById(this.item.id).subscribe({
      next: data => {
        this.livraisonService.item = data
      },
      error: err => console.log(err)
    })
  }

}
