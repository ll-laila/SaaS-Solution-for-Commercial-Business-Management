import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  FormFloatingDirective,
  FormLabelDirective,
  FormSelectDirective,
  InputGroupComponent,
  NavComponent,
  NavItemComponent,
  RowComponent,
  SpinnerComponent,
  TableDirective
} from "@coreui/angular";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {IconDirective} from "@coreui/icons-angular";
import {NgTemplateOutlet} from "@angular/common";
import {FactureService} from "src/app/controller/services/ventes/facture/facture.service";
import {Facture} from "src/app/controller/entities/ventes/facture/facture";
import {FactureValidator} from "src/app/controller/validators/ventes/facture/facture.validator";
import {ValidatorResult} from "@bshg/validation";
import {PaiementService} from "src/app/controller/services/ventes/paiement.service";
import {Paiement} from "src/app/controller/entities/ventes/paiement";
import {RetourProduit} from "src/app/controller/entities/ventes/retourproduit/retour-produit";
import {TaxeService} from "src/app/controller/services/parametres/taxe.service";
import {Taxe} from "src/app/controller/entities/parametres/taxe";
import {ClientService} from "src/app/controller/services/contacts/client.service";
import {Client} from "src/app/controller/entities/contacts/client";
import {DevisesService} from "src/app/controller/services/parametres/devises.service";
import {Devises} from "src/app/controller/entities/parametres/devises";
import {NiveauPrixService} from "src/app/controller/services/parametres/niveau-prix.service";
import {NiveauPrix} from "src/app/controller/entities/parametres/niveau-prix";
import {Adresse} from "src/app/controller/entities/adresse/adresse";
import {FactureProduitService} from "src/app/controller/services/ventes/facture/facture-produit.service";
import {FactureProduit} from "src/app/controller/entities/ventes/facture/facture-produit";
import {EntrepriseService} from "src/app/controller/services/parametres/entreprise.service";
import {Entreprise} from "src/app/controller/entities/parametres/entreprise";
import {PaiementCreateComponent} from "src/app/views/ventes/paiement/paiement-create/paiement-create.component";
import {
  RetourProduitCreateComponent
} from "src/app/views/ventes/retourproduit/retour-produit/retour-produit-create/retour-produit-create.component";
import {AdresseCreateComponent} from "src/app/views/adresse/adresse/adresse-create/adresse-create.component";
import {TypeRabaisEnum} from "src/app/controller/enums/type-rabais-enum";
import {StatutFactureEnum} from "src/app/controller/enums/statut-facture-enum";
import {ProduitService} from "../../../../../controller/services/produit/produit.service";
import {Produit} from "../../../../../controller/entities/produit/produit";
import {ProduitNiveauPrixService} from "../../../../../controller/services/produit/produit-niveau-prix.service";
import {CommandeService} from "../../../../../controller/services/ventes/commande/commande.service";
import {Commande} from "../../../../../controller/entities/ventes/commande/commande";
import {CommandeProduitService} from "../../../../../controller/services/ventes/commande/commande-produit.service";
import {CommandeProduit} from "../../../../../controller/entities/ventes/commande/commande-produit";
import {ToasterService} from "../../../../../toaster/controller/toaster.service";

@Component({
  selector: 'app-facture-create',
  standalone: true,
  imports: [
    FormSelectDirective, RowComponent, ColComponent, FormControlDirective, NgTemplateOutlet,
    FormsModule, FormLabelDirective, FormFloatingDirective, CardComponent,
    CardBodyComponent, CardHeaderComponent, InputGroupComponent, ButtonDirective,
    RouterLink, NavComponent, NavItemComponent, SpinnerComponent, IconDirective,
    FormCheckComponent, FormCheckLabelDirective, FormCheckInputDirective, FormFeedbackComponent, AdresseCreateComponent, TableDirective, RetourProduitCreateComponent, PaiementCreateComponent
  ],
  templateUrl: './facture-create.component.html',
  styleUrl: './facture-create.component.scss'
})
export class FactureCreateComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.item.factureProduit?.forEach(factureProduit => {
      this.calculerTotal(factureProduit)
    })
  }

  protected sending = false
  protected standAlon = true

  @Input("getter") set setItemGetter(getter: () => Facture) {
    this.itemGetter = getter
    this.standAlon = false
  }

  @Input("setter") set setItemSetter(setter: (value: Facture) => void) {
    this.itemSetter = setter
  }

  @Input("validator") set setValidator(validator: FactureValidator) {
    this.validator = validator
  }
  private toasterService = inject(ToasterService)

//private datePipe:DatePipe = inject(DatePipe)
  private router = inject(Router)
  private paiementService = inject(PaiementService)
  private service = inject(FactureService)
  private taxeService = inject(TaxeService)
  private clientService = inject(ClientService)
  private devisesService = inject(DevisesService)
  private niveauPrixService = inject(NiveauPrixService)
  private entrepriseService = inject(EntrepriseService)
  private produitService = inject(ProduitService)
  private produitniveauxPrix = inject(ProduitNiveauPrixService)
  private factureProduitService = inject(FactureProduitService)
  private commandeService = inject(CommandeService)
  private commandeProduitService= inject(CommandeProduitService)
  private formBuilder: FormBuilder = inject(FormBuilder)
  protected validator = FactureValidator.init(() => this.item)
   // .setPaiement(PaiementValidator.init(() => this.paiement))
   // .setRetourProduit(RetourProduitValidator.init(() => this.retourProduit))
    //.setAddressFacturation(AdresseValidator.init(() => this.addressFacturation))
    //.setAddressExpedition(AdresseValidator.init(() => this.addressExpedition))

  protected taxeList!: Taxe[]
  protected clientList!: Client[]
  protected devisesList!: Devises[]
  protected niveauPrixList!: NiveauPrix[]
  protected entrepriseList!: Entreprise[]
  protected produitList!: Produit[]
  protected factureProduits!: FactureProduit[]
  protected readonly TypeRabaisEnum = TypeRabaisEnum;

//selectedDate: any = this.datePipe.transform(new Date(),"yyyy-MM-dd");

  ngOnInit() {
    if (this.service.keepData) {
      let taxeCreated = this.taxeService.createdItemAfterReturn;
      if (taxeCreated.created) {
        this.item.taxe = taxeCreated.item
        this.validator.taxe.validate()
      }
     /* let taxeExpeditionCreated = this.taxeService.createdItemAfterReturn;
      if (taxeExpeditionCreated.created) {
        this.item.taxeExpedition = taxeExpeditionCreated.item
        this.validator.taxeExpedition.validate()
      }*/
      let clientCreated = this.clientService.createdItemAfterReturn;
      if (clientCreated.created) {
        this.item.client = clientCreated.item
        this.validator.client.validate()
      }
      let entrepriseCreated = this.entrepriseService.createdItemAfterReturn;
      if (entrepriseCreated.created) {
        this.item.entreprise = entrepriseCreated.item
        this.validator.entreprise.validate()
      }
      let devisesCreated = this.devisesService.createdItemAfterReturn;
      if (devisesCreated.created) {
        this.item.devises = devisesCreated.item
        this.validator.devises.validate()
      }
    } else {
      this.reset(false)
    }
    this.service.keepData = false
    this.item.addressFacturation = new Adresse()
    this.item.addressExpedition = new Adresse()
    this.loadTaxeList()
    this.calculerTotal(this.itemFP);
    this.loadClientList()
    this.loadDevisesList()
    this.loadNiveauPrixList()
    this.loadEntrepriseList()
    this.findProduitCommande()
    this.clientForm = this.formBuilder.group({
      code: [{value: this.generateCode(), disabled: true}]
    });
    this.service.getNextCode().subscribe({
      next: value => this.item.code = value.code,
      error: err => console.log(err)
    })
  }

  currentCodeNumber: number = 1;

  clientForm !: FormGroup;

  generateCode(): string {
    return 'I' + this.currentCodeNumber.toString().padStart(7, '0');
  }
  // LOAD DATA
  loadTaxeList() {
    this.taxeService.findAll().subscribe({
      next: data => this.taxeList = data,
      error: err => console.log(err)
    })
  }

  loadClientList() {
    this.clientService.findAll()
      .subscribe({
        next: data => {
          this.clientList = data
          this.loadProduitList()
        },
        error: err => console.log(err)
      })
  }

  loadDevisesList() {
    this.devisesService.findAll().subscribe({
      next: data => this.devisesList = data,
      error: err => console.log(err)
    })
  }

  loadNiveauPrixList() {
    this.niveauPrixService.findAll().subscribe({
      next: data => this.niveauPrixList = data,
      error: err => console.log(err)
    })
  }

  loadEntrepriseList() {
    this.entrepriseService.findAll().subscribe({
      next: data => this.entrepriseList = data,
      error: err => console.log(err)
    })
  }

  loadProduitList() {
    this.produitService.findAll().subscribe({
      next: data => this.produitList = data,
      error: err => console.log(err)
    })
  }
  create() {
    console.log(this.item)
    if (!this.validator.validate()) {
      console.log(this.validator);
      return;
    }
    this.sending = true;
    this.service.create().subscribe({
      next: data => {
        this.sending = false
        if (data == null) return
        this.item = data
        if (this.toReturn) {
          this.router.navigate([this.returnUrl]).then()
          return;
        }
        this.router.navigate(["/ventes/facture/facture/factureautre"]).then()
        this.toasterService.toast({message: "Une nouvelle facture a été ajouté", color: "success"})

        //  this.router.navigate(["/ventes/facture/facture"]).then()
      },
      error: err => {
        this.sending = false
        console.log(err)
        this.validator.import(err.error as ValidatorResult<any>[])
      }
    })
   // this.router.navigate(["/ventes/facture/autre"]).then()
  }
  reset(force = true) {
    if (force || this.item == null) this.item = new Facture()
    this.validator.reset()
  }
 // GETTERS AND SETTERS
  public get items() {
    return this.service.items;
  }

  public set items(value) {
    this.service.items = value;
  }

  public get item(): Facture {
    return this.itemGetter();
  }

  public set item(value: Facture) {
    this.itemSetter(value);
  }

  private itemGetter(): Facture {
    return this.service.item;
  }

  private itemSetter(value: Facture) {
    this.service.item = value;
  }

  public get paiement(): Paiement {
    if (this.item.paiement == null)
      this.item.paiement = new Paiement()
    return this.item.paiement;
  }

  public set paiement(value: Paiement) {
    this.item.paiement = value;
  }
  protected paiementGetter = () => this.paiement;
  protected paiementSetter = (value: Paiement) => this.paiement = value;

  public get retourProduit(): RetourProduit {
    if (this.item.retourProduit == null)
      this.item.retourProduit = new RetourProduit()
    return this.item.retourProduit;
  }
  public set retourProduit(value: RetourProduit) {
    this.item.retourProduit = value;
  }
  protected retourProduitGetter = () => this.retourProduit;
  protected retourProduitSetter = (value: RetourProduit) => this.retourProduit = value;

  public get addressFacturation(): Adresse {
    if (this.item.addressFacturation == null)
      this.item.addressFacturation = new Adresse()
    return this.item.addressFacturation;
  }

  public set addressFacturation(value: Adresse) {
    this.item.addressFacturation = value;
  }

  generateDocument() {
    this.service.generateDocument().subscribe({
      next: data => console.log('success'),
      error: err => console.log(err)
    })
  }
  protected addressFacturationGetter = () => this.addressFacturation;
  protected addressFacturationSetter = (value: Adresse) => this.addressFacturation = value;

  public get addressExpedition(): Adresse {
    if (this.item.addressExpedition == null)
      this.item.addressExpedition = new Adresse()
    return this.item.addressExpedition;
  }

  public set addressExpedition(value: Adresse) {
    this.item.addressExpedition = value;
  }

  protected addressExpeditionGetter = () => this.addressExpedition;
  protected addressExpeditionSetter = (value: Adresse) => this.addressExpedition = value;

  public get taxe(): Taxe {
    if (this.item.taxe == null)
      this.item.taxe = new Taxe()
    return this.item.taxe;
  }

  public set taxe(value: Taxe) {
    this.item.taxe = value;
  }


  public get taxeExpedition(): Taxe {
    if (this.item.taxeExpedition == null)
      this.item.taxeExpedition = new Taxe()
    return this.item.taxeExpedition;
  }

  public set taxeExpedition(value: Taxe) {
    this.item.taxeExpedition = value;
  }

  public get client(): Client {
    if (this.item.client == null)
      this.item.client = new Client()
    return this.item.client;
  }

  public set client(value: Client) {
    this.item.client = value;
  }


  public get devises(): Devises {
    if (this.item.devises == null)
      this.item.devises = new Devises()
    return this.item.devises;
  }

  public set devises(value: Devises) {
    this.item.devises = value;
  }

  public get niveauPrix(): NiveauPrix {
    if (this.item.niveauPrix == null)
      this.item.niveauPrix = new NiveauPrix()
    return this.item.niveauPrix;
  }

  public set niveauPrix(value: NiveauPrix) {
    this.item.niveauPrix = value;
  }

  public get entreprise(): Entreprise {
    if (this.item.entreprise == null)
      this.item.entreprise = new Entreprise()
    return this.item.entreprise;
  }

  public set entreprise(value: Entreprise) {
    this.item.entreprise = value;
  }

  public get factureProduit(): FactureProduit[] {
    if (this.item.factureProduit == null)
      this.item.factureProduit = []
    return this.item.factureProduit;
  }

  public set factureProduit(value: FactureProduit[]) {
    this.item.factureProduit = value;
  }


  // Many To Many

  updateDisponible(factureProduit: FactureProduit): number {
    const niveauStockInitial = factureProduit?.produit?.niveauStockInitial ?? 0;
    const quantite = factureProduit.quantite ?? 0;

    if (niveauStockInitial === 0 || quantite === 0) {
      return 0;
    }

    return niveauStockInitial - quantite;
  }

  public addFactureProduits(produit: Produit): void {
    console.log(produit);
    if (this.item.factureProduit == null) {
      this.item.factureProduit = [];
    }

// this.produitniveauxPrix.findByProduitId(produit.id).subscribe(data => produit.produitNiveauPrix = data);
    let factureProduit = new FactureProduit();
    factureProduit.produit = produit
    console.log("produit", produit);
    factureProduit.disque = 0
    factureProduit.quantite = 1
    produit.disponible = produit?.niveauStockInitial - factureProduit?.quantite;
    console.log("disponible", produit.disponible);
    factureProduit.disponible = produit.disponible
    console.log(factureProduit.disponible);
// factureProduit.prix = produit.produitNiveauPrix?.filter(it => it.niveauPrix?.id == this.item.niveauPrix?.id)[0]?.prix

    factureProduit.prix = produit?.produitNiveauPrix?.filter(it => it.niveauPrix?.id == this.client?.niveauPrix?.id)[0]?.prix || produit.prixGros;
    console.log("client", this.client);
    console.log("niveau prix du client", this?.client.niveauPrix);
    console.log(factureProduit.prix);
    factureProduit.total = this.calculerTotal(factureProduit);
    console.log(factureProduit.total);

    this.item.factureProduit = [...this.item.factureProduit, factureProduit]
    console.log(this.item.factureProduit)
  }

  public get returnUrl() {
    return this.service.returnUrl;
  }


  /* calculerTotal(): number {
     if (this.factureProduit) {
       console.log(this.factureProduit);

       this.factureProduitService.calculerTotal(this.itemFP).subscribe({
         next: value => {
           this.itemFP.total = value.total;
           console.log('Total:', this.itemFP.total);
         },
         error: err => console.log(err)
       });
     }
     return this.itemFP.total;

   }*/

  public get toReturn() {
    return this.service.toReturn();
  }

  public navigateToTaxeCreate() {
    this.taxeService.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/parametres/taxe/create']).then()
  }

  public navigateToClientCreate() {
    this.clientService.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/contacts/client/create']).then()
  }

  public navigateToDevisesCreate() {
    this.devisesService.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/parametres/devises/create']).then()
  }

  public navigateToNiveauPrixCreate() {
    this.niveauPrixService.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/parametres/niveau-prix/create']).then()
  }

  public navigateToEntrepriseCreate() {
    this.entrepriseService.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/parametres/entreprise/create']).then()
  }

  public navigateToFactureAutre() {
    this.service.returnUrl = this.router.url
    this.service.keepData = true
    this.router.navigate(['/ventes/facture/create']).then()
  }

  ////
  protected typeRabaisEnumList = Object.values(TypeRabaisEnum)
  protected statutFactureEnumList = Object.values(StatutFactureEnum)

  cancel() {
    this.item = new Facture();
  }

  retour() {
    this.router.navigate(['/pays/pays/list']).then()
  }

  deleteFactureProduit(itemFP: FactureProduit): void {
    this.item.factureProduit = this.item.factureProduit?.filter(item => item !== itemFP);
  }

  calculerTotal(factureProduit1: FactureProduit): number {
    console.log(this.item);
    // Vérifier si factureProduit1.produit existe
    if (factureProduit1.produit) {
      let prix = factureProduit1.prix || 0;

      factureProduit1.produit.produitNiveauPrix?.forEach(e => {
        if (this.item.niveauPrix?.id == e.niveauPrix?.id) {
          console.log("Niveau de prix trouvé...");
          prix = e.prix;
        }
      });
      console.log("prixProduit", prix);
      // Calculer le sous-total
      let sousTotal = (factureProduit1.quantite * prix);
      console.log("sousTotal", sousTotal);

      // Obtenir la taxe du produit
      let taxeProduit = factureProduit1.produit.taxe ? factureProduit1.produit.taxe.tauxImposition : 0.0;
      console.log("taxeProduit", taxeProduit);

      // Obtenir la taxe de la facture
      let taxeFacture = this.taxeList?.find(it => it.id == this.item.taxe?.id)?.tauxImposition || 0.0;
      console.log("taxeFacture", taxeFacture);

      let totalFinal = 0; // Initialisation par défaut

      // Si le type de rabais est un pourcentage
      if (this.item.typeRabais != null && this.item.typeRabais == this.TypeRabaisEnum.POURCENTAGE) {
        let totalAvecTaxe = sousTotal * (1 + ((taxeFacture + taxeProduit) / 100));
        console.log("totalAvecTaxe (pourcentage)", totalAvecTaxe);

        let disque = totalAvecTaxe * (this.item.rabais / 100);
        console.log("disque (pourcentage)", disque);

        totalFinal = totalAvecTaxe - disque; // Calcul du total final
        console.log("totalFinal (pourcentage)", totalFinal);
      }
      // Si le type de rabais est un montant fixe
      else if (this.item.typeRabais != null && this.item.typeRabais == this.TypeRabaisEnum.MONTANT) {
        let totalAvecTaxe = sousTotal * (1 + ((taxeFacture + taxeProduit) / 100));
        console.log("totalAvecTaxe (montant)", totalAvecTaxe);

        let disque = this.item.rabais;
        console.log("disque (montant)", disque);

        totalFinal = totalAvecTaxe - disque; // Calcul du total final
        console.log("totalFinal (montant)", totalFinal);
      }

      totalFinal *= factureProduit1.quantite || 1;
      totalFinal -= factureProduit1.disque || 0;
      totalFinal = parseFloat(totalFinal.toFixed(2)); // Formater le total avec 2 chiffres après la virgule
      factureProduit1.total = totalFinal;
      return totalFinal; // Retourne la valeur correcte de totalFinal
    }

    console.log("Produit non trouvé...");
    return 0; // Si aucun produit n'est trouvé, retourne 0
  }
  calculerSommeSousTotal(factureProduits: FactureProduit[]): string {
    const somme = factureProduits.reduce((total, factureProduit) => {
      if (factureProduit?.quantite && factureProduit?.prix) {
        return total + (factureProduit.quantite * factureProduit.prix);
      } else {
        return total;
      }
    }, 0);
    this.item.sousTotal = somme
    return somme.toFixed(2);
  }
  calculerSommeTotale(factureProduitList: FactureProduit[]): number {
    const sommeTotale = factureProduitList.reduce((somme, factureProduit) => {
      const total = this.calculerTotal(factureProduit);
      console.log(`Total pour ${factureProduit.produit?.nom}: ${total}`);
      return somme + total;
    }, 0);

    const sommeTotaleFormatee = parseFloat(sommeTotale.toFixed(2));
    console.log(`Somme totale formatée: ${sommeTotaleFormatee}`);
    this.item.total = sommeTotaleFormatee;
    return sommeTotaleFormatee;
  }
  calculerSommeQuantite(factureProduitList: FactureProduit[]): number {
    let number = factureProduitList.reduce((sommeQuantite, factureProduit) => {
      return sommeQuantite + (factureProduit.quantite || 0);
    }, 0);
      this.item.totalUnites = number
    return number;
  }


  public get itemFP(): FactureProduit {
    return this.factureProduitService.item;
  }

  public set itemFP(value: FactureProduit) {
    this.factureProduitService.item = value;
  }

  public get itemP(): Produit {
    return this.produitService.item;
  }

  public set itemP(value: Produit) {
    this.produitService.item = value;
  }

  totalPayer() {
    if (this.item.total === this.item.paiement?.montantPaye) {
      this.item.statut = StatutFactureEnum.PAYE;
    } else {
      this.item.statut= StatutFactureEnum.NONPAYE;
    }
  }

  public set itemsC(value:Commande[]) {
    this.commandeService.items = value;
  }

  public get itemC(): Commande {

    return this.commandeService.item;
  }

  public set itemC(value: Commande ) {
    this.commandeService.item = value;
  }
  findByCommandeId() {
    const commandeId = this?.item?.commande?.id;

    if (commandeId !== undefined) {
      this.commandeService.findById(commandeId).subscribe({
        next: value => {
          this.item.commande = value;
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      console.log("Commande ID is undefined");
    }
  }

  public set itemsCommandeProduits(value: CommandeProduit[]) {
    this.commandeProduitService.items = value;
  }

  public get itemCommandeProduit(): CommandeProduit {
    return this.commandeProduitService.item;
  }

  public set itemCommandeProduit(value: CommandeProduit ) {
    this.commandeProduitService.item = value;
  }
  findProduitCommande() {
    this.commandeProduitService.findById(this.itemCommandeProduit.id).subscribe({
      next: data => this.itemCommandeProduit = data,
      error: err => console.log(err)
    })
  }

}
