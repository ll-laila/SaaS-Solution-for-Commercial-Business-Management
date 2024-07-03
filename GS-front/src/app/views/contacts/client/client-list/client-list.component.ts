import {Component, inject} from '@angular/core';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    ColDirective,
    NavComponent,
    NavItemComponent,
    PlaceholderAnimationDirective,
    RowComponent,
    SpinnerComponent,
    TableDirective,
    PlaceholderDirective,
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    ModalComponent,
    ModalToggleDirective,
    ModalHeaderComponent,
    ModalBodyComponent,
    TooltipDirective,
    ModalFooterComponent,
    PopoverDirective,
    ModalTitleDirective,
    ButtonCloseDirective,
    ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective,
} from "@coreui/angular";
import {ClientService} from "src/app/controller/services/contacts/client.service";
import {Client} from "src/app/controller/entities/contacts/client";
import {RouterLink} from "@angular/router";
import {IconDirective} from "@coreui/icons-angular";
import {generatePageNumbers, paginationSizes} from "src/app/controller/utils/pagination/pagination";
import {Taxe} from "../../../../controller/entities/parametres/taxe";
import {Fournisseur} from "../../../../controller/entities/contacts/fournisseur";

@Component({
  selector: 'app-client-list',
  standalone: true,
    imports: [
        RowComponent, ColComponent, CardComponent, CardBodyComponent, TableDirective,
        ButtonDirective, RouterLink, IconDirective, IconDirective, NavComponent,
        NavItemComponent, SpinnerComponent, PlaceholderAnimationDirective, PlaceholderDirective,
        ColDirective, PageItemDirective, PageLinkDirective, PaginationComponent,
        DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective,
        ModalComponent, ModalToggleDirective, ModalHeaderComponent, ModalBodyComponent, TooltipDirective, ModalFooterComponent, PopoverDirective, ModalTitleDirective, ButtonCloseDirective, ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective,
    ],
  templateUrl: './client-list.Component.html',
  styleUrl: './client-list.Component.scss'
})
export class ClientListComponent {
  protected loading = false
  protected paginating = false
  protected currentIndex: number  = 0
  protected deleteModel = false


  private service = inject(ClientService)

  ngOnInit() {
    this.findAll()
  }

  findAll() {
    this.loading = true
    this.paginate().then(() => this.loading = false)
  }

  async paginate(page: number = this.pagination.page, size: number = this.pagination.size) {
    this.paginating = true
    this.service.findPaginated(page, size).subscribe({
      next: value => {
        this.pagination = value
        this.paginating = false
      },
      error: err => {
        console.log(err)
        this.paginating = false
      }
    })
  }


  delete() {
    this.service.deleteById(this.item.id).subscribe({
      next: value => {
        this.pagination.data.splice(this.currentIndex as number, 1)
        this.pagination.totalElements--
        this.item = new Client()
        this.currentIndex = -1
        this.deleteModel = false
      },
      error: err => {
        console.log(err)
      }
    })
  }

  // GETTERS AND SETTERS
  public get items() {
    return this.service.items;
  }

  public set items(value) {
    this.service.items = value;
  }

  public get pagination() {
    return this.service.pagination;
  }

  public set pagination(value) {
    this.service.pagination = value;
  }

  public get item(): Client {
    return this.service.item;
  }

  public set item(value: Client ) {
    this.service.item = value;
  }

  public get generatePageNumbers() {
    return generatePageNumbers(this.pagination)
  }


  /////
  protected readonly paginationSizes = paginationSizes;
}
