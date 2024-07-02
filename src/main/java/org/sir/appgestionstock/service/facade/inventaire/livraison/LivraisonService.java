package org.sir.appgestionstock.service.facade.inventaire.livraison;
import org.sir.appgestionstock.bean.core.inventaire.livraison.Livraison;
import org.sir.appgestionstock.bean.core.parametres.Entreprise;
import org.sir.appgestionstock.bean.core.contacts.Fournisseur;
import org.sir.appgestionstock.bean.core.inventaire.livraison.LivraisonProduit;
import org.sir.appgestionstock.bean.core.parametres.Taxe;
import org.sir.appgestionstock.zutils.pagination.Pagination;
import java.util.List;
public interface LivraisonService {
Livraison findById(Long id);
List<Livraison> findAllOptimized();
List<Livraison> findAll();
Pagination<Livraison> findPaginated(int page, int size);
Livraison create(Livraison item);
List<Livraison> create(List<Livraison> item);
Livraison update(Livraison item);
List<Livraison> update(List<Livraison> item);
void deleteById(Long id);
void delete(Livraison item);
void delete(List<Livraison> items);
void deleteByIdIn(List<Long> ids);
int deleteByTaxeExpeditionId(Long id);
List<Livraison> findByTaxeExpeditionId(Long id);
int deleteByFournisseurId(Long id);
List<Livraison> findByFournisseurId(Long id);
int deleteByEntrepriseId(Long id);
List<Livraison> findByEntrepriseId(Long id);
    Long findMaxId();
}