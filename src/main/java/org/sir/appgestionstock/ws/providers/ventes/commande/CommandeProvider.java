package org.sir.appgestionstock.ws.providers.ventes.commande;
import org.sir.appgestionstock.bean.core.ventes.commande.Commande;
import org.sir.appgestionstock.service.facade.ventes.commande.CommandeService;
import org.sir.appgestionstock.ws.converter.ventes.commande.CommandeConverter;
import org.sir.appgestionstock.ws.dto.ventes.commande.CommandeDto;
import org.sir.appgestionstock.zutils.code.CodeGenerator;
import org.sir.appgestionstock.zutils.code.CodeResponse;
import org.sir.appgestionstock.zutils.pagination.Pagination;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.List;
@RestController
@RequestMapping("/api/commande")
public class CommandeProvider {
@Autowired private CommandeService service;
@Autowired private CommandeConverter converter;
@GetMapping("/id/{id}")
public ResponseEntity<CommandeDto> findById(@PathVariable Long id) {
var result = service.findById(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@GetMapping
public ResponseEntity<List<CommandeDto>> findAll() {
var result = service.findAll();
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@GetMapping("/optimized")
public ResponseEntity<List<CommandeDto>> findAllOptimized() {
var result = service.findAllOptimized();
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@GetMapping("/paginated")
public ResponseEntity<Pagination<CommandeDto>> findPaginated(
@RequestParam(name = "page", defaultValue = "0", required = false) int page,
@RequestParam(name = "size", defaultValue = "10", required = false) int size
) {
var result = service.findPaginated(page, size);
var pagination = result.convert(converter::toDto);
return ResponseEntity.ok(pagination);
}
@PostMapping
public ResponseEntity<CommandeDto> save(@RequestBody CommandeDto dto) {
if (dto == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dto);
var result = service.create(item);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@PostMapping("/all")
public ResponseEntity<List<CommandeDto>> save(@RequestBody List<CommandeDto> dtos) {
if (dtos == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dtos);
var result = service.create(item);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@PutMapping()
public ResponseEntity<CommandeDto> update(@RequestBody CommandeDto dto) {
if (dto == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dto);
var result = service.update(item);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@PutMapping("/all")
public ResponseEntity<List<CommandeDto>> update(@RequestBody List<CommandeDto> dtos) {
if (dtos == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dtos);
var result = service.update(item);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping
public ResponseEntity<CommandeDto> delete(@RequestBody CommandeDto dto) {
if (dto == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dto);
service.delete(item);
return ResponseEntity.ok(dto);
}
@DeleteMapping("/all")
public ResponseEntity<List<CommandeDto>> delete(@RequestBody List<CommandeDto> dtos) {
if (dtos == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
var item = converter.toItem(dtos);
service.delete(item);
return ResponseEntity.ok(dtos);
}
@DeleteMapping("/id/{id}")
public ResponseEntity<Long> deleteById(@PathVariable Long id) {
service.deleteById(id);
return ResponseEntity.ok(id);
}
@DeleteMapping("/ids")
public ResponseEntity<List<Long>> deleteByIdIn(@RequestParam("id") List<Long> ids) {
service.deleteByIdIn(ids);
return ResponseEntity.ok(ids);
}
@DeleteMapping("/facture/id/{id}")
public ResponseEntity<Long> deleteByFactureId(@PathVariable Long id){
service.deleteByFactureId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/facture/id/{id}")
public ResponseEntity<CommandeDto> findByFactureId(@PathVariable Long id){
var result = service.findByFactureId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/taxe/id/{id}")
public ResponseEntity<Long> deleteByTaxeId(@PathVariable Long id){
service.deleteByTaxeId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/taxe/id/{id}")
public ResponseEntity<List<CommandeDto>> findByTaxeId(@PathVariable Long id){
var result = service.findByTaxeId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/taxeexpedition/id/{id}")
public ResponseEntity<Long> deleteByTaxeExpeditionId(@PathVariable Long id){
service.deleteByTaxeExpeditionId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/taxeexpedition/id/{id}")
public ResponseEntity<List<CommandeDto>> findByTaxeExpeditionId(@PathVariable Long id){
var result = service.findByTaxeExpeditionId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/client/id/{id}")
public ResponseEntity<Long> deleteByClientId(@PathVariable Long id){
service.deleteByClientId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/client/id/{id}")
public ResponseEntity<List<CommandeDto>> findByClientId(@PathVariable Long id){
var result = service.findByClientId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/devises/id/{id}")
public ResponseEntity<Long> deleteByDevisesId(@PathVariable Long id){
service.deleteByDevisesId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/devises/id/{id}")
public ResponseEntity<List<CommandeDto>> findByDevisesId(@PathVariable Long id){
var result = service.findByDevisesId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/niveauprix/id/{id}")
public ResponseEntity<Long> deleteByNiveauPrixId(@PathVariable Long id){
service.deleteByNiveauPrixId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/niveauprix/id/{id}")
public ResponseEntity<List<CommandeDto>> findByNiveauPrixId(@PathVariable Long id){
var result = service.findByNiveauPrixId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/addressfacturation/id/{id}")
public ResponseEntity<Long> deleteByAddressFacturationId(@PathVariable Long id){
service.deleteByAddressFacturationId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/addressfacturation/id/{id}")
public ResponseEntity<CommandeDto> findByAddressFacturationId(@PathVariable Long id){
var result = service.findByAddressFacturationId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/addressexpedition/id/{id}")
public ResponseEntity<Long> deleteByAddressExpeditionId(@PathVariable Long id){
service.deleteByAddressExpeditionId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/addressexpedition/id/{id}")
public ResponseEntity<CommandeDto> findByAddressExpeditionId(@PathVariable Long id){
var result = service.findByAddressExpeditionId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
@DeleteMapping("/entreprise/id/{id}")
public ResponseEntity<Long> deleteByEntrepriseId(@PathVariable Long id){
service.deleteByEntrepriseId(id);
return ResponseEntity.ok(id);
}
@GetMapping("/entreprise/id/{id}")
public ResponseEntity<List<CommandeDto>> findByEntrepriseId(@PathVariable Long id){
var result = service.findByEntrepriseId(id);
var resultDto = converter.toDto(result);
return ResponseEntity.ok(resultDto);
}
    @GetMapping("/next-code")
    public ResponseEntity<CodeResponse> getNextCode() {
        var generated = CodeGenerator.generate("C", service.findMaxId());
        return ResponseEntity.ok(generated);
    }

    @PutMapping("/idC/{idC}/idF/{idF}")
    public ResponseEntity<?> commandeFacture(@PathVariable Long idC , @PathVariable Long idF){
        service.commandeFacture(idC, idF);
        return ResponseEntity.ok().build();
    }
}