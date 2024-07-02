package org.sir.appgestionstock.bean.core.inventaire.boncommande;
import org.sir.appgestionstock.bean.core.produit.Produit;
import jakarta.persistence.*;
import java.time.*;
import java.util.*;
/**
* This Class is for Association between 'BonCommande' and 'Produit'
*/
@Entity
@Table(name="boncommandeproduit")
public class BonCommandeProduit {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private double total;
private int quantite;
private double disque;
@ManyToOne(fetch = FetchType.LAZY)
private Produit produit;
@ManyToOne(fetch = FetchType.LAZY)
private BonCommande bonCommande;
public BonCommandeProduit() {
}
public Long getId() {
return id;
}
public void setId(Long id) {
this.id = id;
}
public double getTotal() {
return total;
}
public void setTotal(double value) {
this.total = value;
}
public int getQuantite() {
return quantite;
}
public void setQuantite(int value) {
this.quantite = value;
}
public double getDisque() {
return disque;
}
public void setDisque(double value) {
this.disque = value;
}
public Produit getProduit() {
return produit;
}
public void setProduit(Produit value) {
this.produit = value;
}
public BonCommande getBonCommande() {
return bonCommande;
}
public void setBonCommande(BonCommande value) {
this.bonCommande = value;
}
@Override
public boolean equals(Object object) {
if (object instanceof BonCommandeProduit bonCommandeProduit) {
return bonCommandeProduit.getId().equals(this.getId());
}
return false;
}
@Override
public int hashCode() {return (id == null) ? 0 : id.hashCode();}
}