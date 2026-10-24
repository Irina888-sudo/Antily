Backend: TypeScript
Frontend: VueJs
BaseDe Donnee : Postgres

Comment lancer ce genre de format ?
Ajout membre 
verificaton si la date de naissance existe ? 
si ca n'existe pas on le stocke direct

si ca existe 
on passe a la question : 

Vus voulez vraiment continuer 
Si oui , inserer dans la base
Si non, on ne stock pas


schema.txt — Qui fait quoi ?

Navigateur ──► Controller ──► Service ──► Repository ──► Table "product"
 (demande)    (réceptionniste)  (cuisinier)  (outil BD)    (les données)
              reçoit l'URL      fait le       parle à      stockées dans
              et passe          travail       Postgres     Postgres